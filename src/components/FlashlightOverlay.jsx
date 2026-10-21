import React, { useEffect, useState, useRef } from 'react';

/**
 * Efeito visual de lanterna digital (spotlight) para o Modo Noturno.
 * Revela suavemente o ambiente ao redor do cursor no desktop e responde ao toque
 * em celulares/tablets sem nunca bloquear cliques, toques ou rolagem de página (pointer-events: none).
 * Respeita preferências de movimento reduzido (prefers-reduced-motion).
 */
function FlashlightOverlay({ isNightMode }) {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);
  const targetCoords = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!isNightMode) {
      setIsVisible(false);
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      // Em modo de movimento reduzido, iluminação estática sutil centralizada
      setCoords({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setIsVisible(true);
      return;
    }

    // Inicializa posição inicial centralizada suavemente
    targetCoords.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45
    };
    setCoords(targetCoords.current);
    setIsVisible(true);

    let isMoving = false;

    const animate = () => {
      setCoords((prev) => {
        const dx = targetCoords.current.x - prev.x;
        const dy = targetCoords.current.y - prev.y;

        // Interpolação suave (lerp)
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
          isMoving = false;
          return targetCoords.current;
        }

        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18
        };
      });

      if (isMoving) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (e) => {
      targetCoords.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

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
      }
    };
  }, [isNightMode]);

  if (!isNightMode || !isVisible) {
    return null;
  }

  return (
    <div
      className="night-flashlight-overlay"
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle 320px at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.05) 0%, rgba(18, 55, 38, 0.28) 42%, rgba(4, 18, 12, 0.65) 80%, rgba(2, 10, 6, 0.78) 100%)`
      }}
    />
  );
}

export default React.memo(FlashlightOverlay);
