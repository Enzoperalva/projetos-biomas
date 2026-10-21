import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const RESOLUTIONS = [
  { name: 'celular-compacto', width: 320, height: 568 },
  { name: 'celular-comum', width: 375, height: 667 },
  { name: 'celular-moderno', width: 390, height: 844 },
  { name: 'celular-grande', width: 430, height: 932 },
  { name: 'tablet-retrato', width: 768, height: 1024 },
  { name: 'tablet-notebook-compacto', width: 1024, height: 768 },
  { name: 'notebook', width: 1280, height: 720 },
  { name: 'desktop-comum', width: 1366, height: 768 },
  { name: 'desktop-grande', width: 1440, height: 900 },
  { name: 'monitor-full-hd', width: 1920, height: 1080 },
  { name: 'monitor-qhd', width: 2560, height: 1440 },
  { name: 'televisor-4k', width: 3840, height: 2160 },
];

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
  const targetDir = process.argv[2] || 'test-screenshots/baseline';
  mkdirSync(targetDir, { recursive: true });

  // 1. Iniciar Vite dev server
  console.log('Iniciando Vite dev server...');
  const vite = spawn('npx', ['vite', '--port', '5173'], { stdio: 'pipe' });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 2. Iniciar Chrome Headless
  console.log('Iniciando Chrome...');
  const chrome = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars'
  ]);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    let pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) {
      const newPageRes = await fetch('http://127.0.0.1:9222/json/new?http://localhost:5173/');
      pageTarget = await newPageRes.json();
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'DOM.enable');
    await sendCdp(ws, 'Runtime.enable');

    // Navegar para localhost
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Capturando ${RESOLUTIONS.length} resoluções em ${targetDir}...`);

    for (const res of RESOLUTIONS) {
      console.log(`-> Testando ${res.name} (${res.width}x${res.height})...`);
      await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
        width: res.width,
        height: res.height,
        deviceScaleFactor: 1,
        mobile: res.width <= 768
      });

      await sendCdp(ws, 'Emulation.setVisibleSize', {
        width: res.width,
        height: res.height
      });

      await new Promise((r) => setTimeout(r, 600));

      // Capturar métricas de layout
      const layoutEval = await sendCdp(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const doc = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          const clientWidth = doc.clientWidth;
          const hasHorizontalOverflow = scrollWidth > clientWidth;
          const mainStage = document.querySelector('.main-stage');
          const mapFrame = document.querySelector('.map-frame');
          const legend = document.querySelector('.biome-legend');
          const gallery = document.querySelector('.animal-gallery-panel');
          const header = document.querySelector('.app-header');
          
          const mapRect = mapFrame ? mapFrame.getBoundingClientRect() : null;
          const legendRect = legend ? legend.getBoundingClientRect() : null;
          const galleryRect = gallery ? gallery.getBoundingClientRect() : null;
          const headerRect = header ? header.getBoundingClientRect() : null;
          
          let legendOverlapsMap = false;
          if (mapRect && legendRect) {
            legendOverlapsMap = !(
              legendRect.right < mapRect.left ||
              legendRect.left > mapRect.right ||
              legendRect.bottom < mapRect.top ||
              legendRect.top > mapRect.bottom
            );
          }

          return {
            hasHorizontalOverflow,
            scrollWidth,
            clientWidth,
            legendOverlapsMap,
            headerRect: headerRect ? { y: headerRect.y, h: headerRect.height } : null,
            mapRect: mapRect ? { x: Math.round(mapRect.x), y: Math.round(mapRect.y), w: Math.round(mapRect.width), h: Math.round(mapRect.height) } : null,
            legendRect: legendRect ? { x: Math.round(legendRect.x), y: Math.round(legendRect.y), w: Math.round(legendRect.width), h: Math.round(legendRect.height) } : null,
            galleryRect: galleryRect ? { x: Math.round(galleryRect.x), y: Math.round(galleryRect.y), w: Math.round(galleryRect.width), h: Math.round(galleryRect.height) } : null
          };
        })()`,
        returnByValue: true
      });

      console.log(`   Layout check:`, layoutEval.result.value);

      const shot = await sendCdp(ws, 'Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });

      const buffer = Buffer.from(shot.data, 'base64');
      const outPath = join(targetDir, `${res.name}-${res.width}x${res.height}.png`);
      writeFileSync(outPath, buffer);
    }

    ws.close();
    console.log('Testes e capturas finalizados com sucesso.');
  } finally {
    chrome.kill();
    vite.kill();
  }
}

run().catch((err) => {
  console.error('Falha na execução dos testes:', err);
  process.exit(1);
});
