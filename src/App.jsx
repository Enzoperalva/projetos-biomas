import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import BiomeMap from './components/BiomeMap';
import BiomeLegend from './components/BiomeLegend';
import './App.css';

/**
 * Interface principal do Atlas Biomas do Brasil.
 * Experiência diurna com vídeo da floresta amazônica de fundo em loop,
 * áudio ambiente independente e mapa vetorial interativo em destaque.
 */
export default function App() {
  const [activeBiome, setActiveBiome] = useState(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleHoverBiome = (id) => {
    setActiveBiome(id);
  };

  const handleLeaveBiome = () => {
    setActiveBiome(null);
  };

  useEffect(() => {
    // 1. Controle do vídeo de fundo (respeitando prefers-reduced-motion)
    const video = videoRef.current;
    let motionCleanup = null;

    if (video) {
      video.muted = true;

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleMotionPreference = (e) => {
        if (e.matches) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      };

      if (motionQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }

      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', handleMotionPreference);
        motionCleanup = () => motionQuery.removeEventListener('change', handleMotionPreference);
      }
    }

    // 2. Controle do áudio ambiente independente com loop contínuo
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;

      const removeInteractionListeners = () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('pointerdown', handleUserInteraction);
      };

      const handleUserInteraction = () => {
        const promise = audio.play();
        if (promise !== undefined) {
          promise
            .then(removeInteractionListeners)
            .catch(() => {});
        }
      };

      // Tenta reprodução inicial automática
      const initialPromise = audio.play();
      if (initialPromise !== undefined) {
        initialPromise
          .then(removeInteractionListeners)
          .catch(() => {
            // Autoplay com som bloqueado pelo navegador; aguarda primeira interação
          });
      }

      window.addEventListener('click', handleUserInteraction, { passive: true });
      window.addEventListener('keydown', handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { passive: true });
      window.addEventListener('pointerdown', handleUserInteraction, { passive: true });

      // Fallback para garantir reinício sem interrupções
      const handleAudioEnded = () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      };
      audio.addEventListener('ended', handleAudioEnded);

      return () => {
        if (motionCleanup) motionCleanup();
        removeInteractionListeners();
        audio.removeEventListener('ended', handleAudioEnded);
        audio.pause();
      };
    }

    return () => {
      if (motionCleanup) motionCleanup();
    };
  }, []);

  return (
    <div className="app-layout">
      {/* Camada do vídeo de fundo com desfoque moderado e reprodução contínua */}
      <video
        ref={videoRef}
        className="forest-background"
        src={`${import.meta.env.BASE_URL}assets/biomes/videoFlorestaDia.mp4`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Áudio ambiente independente em loop contínuo */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}assets/audio/audioFlorestaDia.mp3`}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Camada de atmosfera de luz natural suave (sem escurecer ou simular noite) */}
      <div className="daylight-overlay" aria-hidden="true" />

      {/* Conteúdo principal nítido sobre o fundo */}
      <div className="app-content">
        <Header />

        <main className="main-stage">
          <div className="map-area">
            <BiomeMap
              activeBiome={activeBiome}
              onHoverBiome={handleHoverBiome}
              onLeaveBiome={handleLeaveBiome}
            />
          </div>

          <div className="legend-area">
            <BiomeLegend
              activeBiome={activeBiome}
              onHoverBiome={handleHoverBiome}
              onLeaveBiome={handleLeaveBiome}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
