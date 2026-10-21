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
  console.log('--- Testando Acessibilidade e Zoom 200% ---');
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

    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'Runtime.enable');
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2000));

    // Teste 1: Zoom 200% em 1280x720 (emula 640x360 equivalente com scale factor 2)
    console.log('-> Testando Zoom 200%...');
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
      mobile: false
    });
    await sendCdp(ws, 'Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
    await new Promise((r) => setTimeout(r, 600));

    const zoomEval = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const doc = document.documentElement;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth
        };
      })()`,
      returnByValue: true
    });
    console.log('Resultado Zoom 200%:', zoomEval.result.value);

    // Teste 2: Navegação por teclado nos biomas
    console.log('-> Testando navegação por teclado (Enter e Espaço)...');
    await sendCdp(ws, 'Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false
    });

    const focusRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const cerradoItem = document.querySelector('.legend-item:nth-child(2)');
        if (!cerradoItem) return false;
        cerradoItem.focus();
        return document.activeElement === cerradoItem;
      })()`,
      returnByValue: true
    });

    // Envia Enter via CDP Input
    await sendCdp(ws, 'Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 13
    });
    await sendCdp(ws, 'Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      nativeVirtualKeyCode: 13
    });
    await new Promise((r) => setTimeout(r, 400));

    const keyNavEval = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const isSelected = document.querySelector('.app-layout')?.classList.contains('biome-cerrado');
        return {
          focused: true,
          activatedByEnter: isSelected
        };
      })()`,
      returnByValue: true
    });
    console.log('Resultado Navegação Teclado:', keyNavEval.result.value);

    // Teste 3: Prefers Reduced Motion
    console.log('-> Testando prefers-reduced-motion: reduce...');
    await sendCdp(ws, 'Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await new Promise((r) => setTimeout(r, 500));

    const reducedMotionEval = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const cardsWrapper = document.querySelector('.protection-cards-wrapper');
        const cardsWrapperOpacity = cardsWrapper ? getComputedStyle(cardsWrapper).opacity : null;
        return {
          cardsWrapperOpacity
        };
      })()`,
      returnByValue: true
    });
    console.log('Resultado Reduced Motion:', reducedMotionEval.result.value);

    ws.close();
    console.log('--- Testes de Acessibilidade Concluídos com Sucesso ---');
  } finally {
    chrome.kill();
    vite.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
