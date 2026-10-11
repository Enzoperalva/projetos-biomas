import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import BiomeMap from './components/BiomeMap';
import BiomeLegend from './components/BiomeLegend';
import './App.css';

/**
 * Interface principal do Atlas Biomas do Brasil.
 * Experiência imersiva diurna com vídeo da floresta amazônica de fundo em loop,
 * áudio ambiente contínuo com fallback inteligente de reprodução
 * e mapa vetorial oficial do IBGE 2025 interativo em destaque centralizado.
 */
export default function App() {
  const [activeBiome, setActiveBiome] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const handleHoverBiome = useCallback((id) => {
    setActiveBiome(id);
  }, []);

  const handleLeaveBiome = useCallback(() => {
    setActiveBiome(null);
  }, []);

  // Alterna a reprodução do áudio ambiente
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsAudioPlaying(true))
          .catch((err) => {
            console.debug('Reprodução de áudio aguardando interação:', err);
          });
      }
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  }, []);

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

    // 2. Controle do áudio ambiente independente com loop contínuo e tratamento de autoplay
    const audio = audioRef.current;
    let audioCleanup = null;

    if (audio) {
      audio.loop = true;
      audio.volume = 0.55;

      const syncPlayState = () => setIsAudioPlaying(true);
      const syncPauseState = () => setIsAudioPlaying(false);

      audio.addEventListener('play', syncPlayState);
      audio.addEventListener('pause', syncPauseState);

      const removeInteractionListeners = () => {
        window.removeEventListener('pointerdown', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };

      const handleUserInteraction = () => {
        if (audio.paused) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsAudioPlaying(true);
                removeInteractionListeners();
              })
              .catch(() => {});
          }
        } else {
          removeInteractionListeners();
        }
      };

      // Tenta reprodução inicial automática (tratando rejeição sem erro ruidoso)
      const initialPromise = audio.play();
      if (initialPromise !== undefined) {
        initialPromise
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch(() => {
            // Autoplay com som bloqueado pela política do navegador:
            // Configura ouvintes para a primeira interação do usuário
            setIsAudioPlaying(false);
            window.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: true });
            window.addEventListener('keydown', handleUserInteraction, { passive: true, once: true });
            window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
          });
      }

      // Fallback para garantir reinício sem interrupções se o loop nativo falhar
      const handleAudioEnded = () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      };
      audio.addEventListener('ended', handleAudioEnded);

      audioCleanup = () => {
        removeInteractionListeners();
        audio.removeEventListener('play', syncPlayState);
        audio.removeEventListener('pause', syncPauseState);
        audio.removeEventListener('ended', handleAudioEnded);
        audio.pause();
      };
    }

    return () => {
      if (motionCleanup) motionCleanup();
      if (audioCleanup) audioCleanup();
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

      {/* Camada de atmosfera de luz natural suave */}
      <div className="daylight-overlay" aria-hidden="true" />

      {/* Conteúdo principal nítido sobre o fundo */}
      <div className="app-content">
        <Header
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={toggleAudio}
        />

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
