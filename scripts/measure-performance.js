import { spawn } from 'node:child_process';

async function sendCdp(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  console.log('--- Medição de Performance (Linha de Base) ---');
  const vite = spawn('npx', ['vite', '--port', '5173'], { stdio: 'pipe' });
  await new Promise((r) => setTimeout(r, 1500));

  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu'
  ]);
  await new Promise((r) => setTimeout(r, 1500));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    let pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) {
      const newPageRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:5173/');
      pageTarget = await newPageRes.json();
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));

    await sendCdp(ws, 'Performance.enable');
    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'Runtime.enable');

    const startTime = Date.now();
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:5173/' });

    // Aguarda SVG carregar no DOM
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const check = () => {
          if (document.querySelector('path#amazonia')) resolve(true);
          else setTimeout(check, 50);
        };
        check();
      })`,
      awaitPromise: true
    });

    const loadTime = Date.now() - startTime;
    console.log(`Tempo de carregamento inicial (SVG pronto): ${loadTime}ms`);

    // Métricas de performance iniciais
    const metricsRes = await sendCdp(ws, 'Performance.getMetrics');
    const metricMap = {};
    for (const m of metricsRes.metrics) {
      metricMap[m.name] = m.value;
    }

    console.log('Heap Inicial (JS):', (metricMap.JSHeapUsedSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('Nós DOM:', metricMap.Nodes);
    console.log('Recálculos de estilo (iniciais):', metricMap.RecalcStyleCount);
    console.log('Layouts (iniciais):', metricMap.LayoutCount);

    // Medir latência de clique nos biomas
    const biomes = ['cerrado', 'caatinga', 'mata-atlantica', 'pantanal', 'pampa', 'amazonia'];
    const clickDurations = [];

    for (const biome of biomes) {
      const clickPerf = await sendCdp(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const path = document.querySelector('path#${biome}');
          if (!path) return { error: 'path not found' };
          const t0 = performance.now();
          path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          const t1 = performance.now();
          return {
            dispatchDuration: t1 - t0,
            activeClass: document.querySelector('.app-layout').classList.contains('biome-${biome}')
          };
        })()`,
        returnByValue: true
      });
      clickDurations.push({ biome, ...clickPerf.result.value });
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log('Latências de clique nos biomas:', clickDurations);

    // Medir impacto do hover contínuo (emulando movimento do mouse sobre os biomas)
    const hoverPerf = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const paths = ['amazonia', 'cerrado', 'caatinga', 'pantanal', 'mata-atlantica', 'pampa'];
        const t0 = performance.now();
        for (let i = 0; i < 60; i++) {
          const biomeId = paths[i % paths.length];
          const el = document.querySelector('path#' + biomeId);
          if (el) {
            el.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
          }
          await new Promise(r => requestAnimationFrame(r));
        }
        const t1 = performance.now();
        return {
          totalDuration: t1 - t0,
          avgPerFrame: (t1 - t0) / 60
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Performance de Hover (60 frames):', hoverPerf.result.value);

    const finalMetrics = await sendCdp(ws, 'Performance.getMetrics');
    const finalMap = {};
    for (const m of finalMetrics.metrics) {
      finalMap[m.name] = m.value;
    }

    console.log('Heap Final (JS):', (finalMap.JSHeapUsedSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('Total Recálculos de estilo:', finalMap.RecalcStyleCount);
    console.log('Total Layouts:', finalMap.LayoutCount);

    ws.close();
  } finally {
    chrome.kill();
    vite.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
