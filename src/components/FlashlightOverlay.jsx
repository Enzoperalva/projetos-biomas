import React, { useEffect, useRef } from 'react';

/**
 * Efeito visual de lanterna digital (spotlight) para o Modo Noturno.
 * Revela suavemente o ambiente ao redor do cursor no desktop e responde ao toque
 * em celulares/tablets sem nunca bloquear cliques, toques ou rolagem de página (pointer-events: none).
 * Altamente otimizado: atualiza o background diretamente pelo ref do DOM durante o RAF,
 * eliminando dezenas de re-renderizações por segundo no ciclo do React.
 * Respeita preferências de movimento reduzido (prefers-reduced-motion).
 */
function FlashlightOverlay({ isNightMode }) {
  const overlayRef = useRef(null);
  const rafRef = useRef(null);
  const targetCoords = useRef({ x: -1000, y: -1000 });
  const currentCoords = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!isNightMode) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      // Em modo de movimento reduzido, iluminação estática sutil centralizada
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      overlay.style.background = `radial-gradient(circle 320px at ${cx}px ${cy}px, rgba(255, 255, 255, 0.05) 0%, rgba(18, 55, 38, 0.28) 42%, rgba(4, 18, 12, 0.65) 80%, rgba(2, 10, 6, 0.78) 100%)`;
      overlay.style.opacity = '1';
      return;
    }

    // Inicializa posição inicial centralizada suavemente
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight * 0.45;
    targetCoords.current = { x: initX, y: initY };
    currentCoords.current = { x: initX, y: initY };

    overlay.style.background = `radial-gradient(circle 320px at ${initX}px ${initY}px, rgba(255, 255, 255, 0.05) 0%, rgba(18, 55, 38, 0.28) 42%, rgba(4, 18, 12, 0.65) 80%, rgba(2, 10, 6, 0.78) 100%)`;
    overlay.style.opacity = '1';

    let isMoving = false;

    const renderGradient = (x, y) => {
      if (overlayRef.current) {
        overlayRef.current.style.background = `radial-gradient(circle 320px at ${x.toFixed(1)}px ${y.toFixed(1)}px, rgba(255, 255, 255, 0.05) 0%, rgba(18, 55, 38, 0.28) 42%, rgba(4, 18, 12, 0.65) 80%, rgba(2, 10, 6, 0.78) 100%)`;
      }
    };

    const animate = () => {
      const dx = targetCoords.current.x - currentCoords.current.x;
      const dy = targetCoords.current.y - currentCoords.current.y;

      // Interpolação suave (lerp)
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        currentCoords.current.x = targetCoords.current.x;
        currentCoords.current.y = targetCoords.current.y;
        renderGradient(currentCoords.current.x, currentCoords.current.y);
        isMoving = false;
        return;
      }

      currentCoords.current.x += dx * 0.18;
      currentCoords.current.y += dy * 0.18;
      renderGradient(currentCoords.current.x, currentCoords.current.y);

      if (isMoving) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (e) => {
      targetCoords.current = { x: e.clientX, y: e.clientY };

      if (!isMoving) {
        isMoving = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePointerLeave = () => {
      targetCoords.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.45
      };
      if (!isMoving) {
        isMoving = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isNightMode]);

  if (!isNightMode) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="night-flashlight-overlay"
      aria-hidden="true"
    />
  );
}

export default React.memo(FlashlightOverlay);
