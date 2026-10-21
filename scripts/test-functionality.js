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
  console.log('--- Iniciando Auditoria Funcional com Chrome CDP ---');

  const vite = spawn('npx', ['vite', '--port', '5173'], { stdio: 'pipe' });
  await new Promise((r) => setTimeout(r, 1500));

  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu'
  ]);
  await new Promise((r) => setTimeout(r, 1500));

  const results = {
    consoleErrors: [],
    failedRequests: [],
    biomeTests: {},
    audioToggle: null,
    nightModeToggle: null,
    threatenedToggle: null,
    emptyStateTest: null
  };

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

    ws.addEventListener('message', (evt) => {
      const data = JSON.parse(evt.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        const text = data.params.args.map((a) => a.value || a.description).join(' ');
        if (type === 'error') {
          results.consoleErrors.push(text);
        }
      }
      if (data.method === 'Network.responseReceived') {
        const response = data.params.response;
        if (response.status >= 400) {
          results.failedRequests.push({ url: response.url, status: response.status });
        }
      }
    });

    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'Runtime.enable');
    await sendCdp(ws, 'Network.enable');

    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Testar cada um dos 6 biomas
    const biomes = ['amazonia', 'cerrado', 'caatinga', 'mata-atlantica', 'pantanal', 'pampa'];

    for (const biomeId of biomes) {
      const res = await sendCdp(ws, 'Runtime.evaluate', {
        expression: `(async () => {
          const path = document.querySelector('path#${biomeId}, [data-bioma="${biomeId}"]');
          if (!path) return { found: false };
          path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          await new Promise(r => setTimeout(r, 200));
          
          const app = document.querySelector('.app-layout');
          const hasBiomeClass = app ? app.classList.contains('biome-${biomeId}') : false;
          const legendActive = document.querySelector('.legend-item.selected .legend-name')?.textContent;
          const galleryName = document.querySelector('.gallery-biome-name')?.textContent;
          const cardsCount = document.querySelectorAll('.animal-card').length;
          
          return {
            found: true,
            hasBiomeClass,
            legendActive,
            galleryName,
            cardsCount
          };
        })()`,
        awaitPromise: true,
        returnByValue: true
      });

      results.biomeTests[biomeId] = res.result.value;
      console.log(`Bioma [${biomeId}]:`, res.result.value);
    }

    // 2. Testar alternância Dia / Noite
    const nightModeRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const btn = document.querySelector('.btn-fauna-toggle');
        if (!btn) return { found: false };
        btn.click();
        await new Promise(r => setTimeout(r, 300));
        const isNight = document.querySelector('.app-layout')?.classList.contains('night-mode');
        const galleryTitle = document.querySelector('.gallery-title')?.textContent;
        const flashlightVisible = !!document.querySelector('.flashlight-spotlight');
        btn.click(); // voltar para o dia
        await new Promise(r => setTimeout(r, 300));
        const backToDay = document.querySelector('.app-layout')?.classList.contains('day-mode');
        return {
          toggledToNight: isNight,
          galleryTitle,
          flashlightVisible,
          restoredToDay: backToDay
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    results.nightModeToggle = nightModeRes.result.value;
    console.log('Modo Noite/Dia:', nightModeRes.result.value);

    // 3. Testar botão de Ameaçados
    const threatenedRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const btn = document.querySelector('.btn-threatened-header');
        if (!btn) return { found: false };
        btn.click();
        await new Promise(r => setTimeout(r, 300));
        const isActive = btn.classList.contains('active');
        const cardsCount = document.querySelectorAll('.animal-card').length;
        btn.click(); // desativar
        await new Promise(r => setTimeout(r, 300));
        const isInactive = !btn.classList.contains('active');
        return {
          activated: isActive,
          cardsWithFilter: cardsCount,
          deactivated: isInactive
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    results.threatenedToggle = threatenedRes.result.value;
    console.log('Filtro Ameaçados:', threatenedRes.result.value);

    // 4. Testar botão de Áudio
    const audioRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const btn = document.querySelector('.btn-audio-toggle');
        const audio = document.querySelector('audio');
        if (!btn || !audio) return { found: false };
        const initialPaused = audio.paused;
        btn.click();
        await new Promise(r => setTimeout(r, 300));
        const playingClass = btn.classList.contains('playing');
        btn.click();
        await new Promise(r => setTimeout(r, 300));
        const mutedClass = btn.classList.contains('muted');
        return {
          initialPaused,
          playingClass,
          mutedClass,
          audioSrc: audio.src
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    results.audioToggle = audioRes.result.value;
    console.log('Controle de Áudio:', audioRes.result.value);

    ws.close();
    console.log('--- Auditoria Funcional Concluída ---');
    console.log('Erros de Console:', results.consoleErrors);
    console.log('Requisições com Falha:', results.failedRequests);
  } finally {
    chrome.kill();
    vite.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
