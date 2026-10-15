import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import BiomeMap from './components/BiomeMap';
import BiomeLegend from './components/BiomeLegend';
import './App.css';

const BASE_VOLUME = 0.55;

/**
 * Interface principal do Atlas Biomas do Brasil.
 * Experiência imersiva diurna com vídeo da floresta amazônica de fundo em loop,
 * áudio ambiente contínuo com fallback inteligente de reprodução,
 * mapa vetorial oficial do IBGE 2025 interativo em destaque centralizado,
 * e transição contínua e reversível controlada pela rolagem para a nova seção de proteção dos biomas.
 */
export default function App() {
  const [activeBiome, setActiveBiome] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const heroTrackRef = useRef(null);

  // Controle de intenção explícita do usuário vs pausa provocada pela transição
  const userWantsAudioRef = useRef(false);
  const pausedByTransitionRef = useRef(false);

  const handleHoverBiome = useCallback((id) => {
    setActiveBiome(id);
  }, []);

  const handleLeaveBiome = useCallback(() => {
    setActiveBiome(null);
  }, []);

  // Alterna a reprodução do áudio ambiente respeitando a decisão explícita do usuário
  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userWantsAudioRef.current = true;
      pausedByTransitionRef.current = false;

      // Se desmutado durante a transição, define o volume atenuado correto antes de reproduzir
      const track = heroTrackRef.current;
      if (track) {
        const trackRect = track.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const transitionDistance = track.offsetHeight - viewportHeight;
        let progress = 0;
        if (transitionDistance > 0) {
          progress = Math.max(0, Math.min(1, -trackRect.top / transitionDistance));
        } else if (track.offsetHeight > 0) {
          progress = Math.max(0, Math.min(1, -trackRect.top / track.offsetHeight));
        }

        if (progress >= 0.995) {
          userWantsAudioRef.current = true;
          pausedByTransitionRef.current = true;
          audio.volume = 0;
          audio.pause();
          setIsAudioPlaying(false);
          return;
        }

        audio.volume = Math.max(0, Math.min(1, BASE_VOLUME * (1 - progress)));
      } else {
        audio.volume = BASE_VOLUME;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsAudioPlaying(true))
          .catch((err) => {
            console.debug('Reprodução de áudio aguardando interação:', err);
          });
      }
    } else {
      userWantsAudioRef.current = false;
      pausedByTransitionRef.current = false;
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

    // 2. Controle do áudio ambiente independente com loop contínuo e sincronização com a rolagem
    const audio = audioRef.current;
    let audioCleanup = null;

    if (audio) {
      audio.loop = true;
      audio.volume = BASE_VOLUME;

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
        if (audio.paused && !pausedByTransitionRef.current) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                userWantsAudioRef.current = true;
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
            userWantsAudioRef.current = true;
            setIsAudioPlaying(true);
          })
          .catch(() => {
            // Autoplay com som bloqueado pela política do navegador:
            // Configura ouvintes para a primeira interação do usuário
            userWantsAudioRef.current = false;
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

      // 3. Sincronização progressiva do áudio com o avanço da transição de rolagem
      let rafId = null;

      const updateScrollAudio = () => {
        const track = heroTrackRef.current;
        if (!track || !audio) return;

        const trackRect = track.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const transitionDistance = track.offsetHeight - viewportHeight;

        let progress = 0;
        if (transitionDistance > 0) {
          const currentScroll = -trackRect.top;
          progress = Math.max(0, Math.min(1, currentScroll / transitionDistance));
        } else if (track.offsetHeight > 0) {
          progress = Math.max(0, Math.min(1, -trackRect.top / track.offsetHeight));
        }

        if (progress >= 0.995) {
          // Cobertura completa atingida: volume zerado e áudio pausado
          audio.volume = 0;
          if (!audio.paused) {
            pausedByTransitionRef.current = true;
            audio.pause();
          }
        } else {
          // Volume atenua suavemente proporcional ao progresso da cobertura
          const currentVolume = BASE_VOLUME * (1 - progress);
          audio.volume = Math.max(0, Math.min(1, currentVolume));

          // Retoma suavemente se foi pausado pela transição e o usuário não o mutou manualmente
          if (pausedByTransitionRef.current && userWantsAudioRef.current) {
            pausedByTransitionRef.current = false;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.debug('Retomada do áudio na reversão da transição:', err);
              });
            }
          }
        }
      };

      const handleScrollOrResize = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          updateScrollAudio();
        });
      };

      window.addEventListener('scroll', handleScrollOrResize, { passive: true });
      window.addEventListener('resize', handleScrollOrResize, { passive: true });

      // Verificação inicial caso a página recarregue com posição de rolagem prévia
      updateScrollAudio();

      audioCleanup = () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
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

      {/* Trilha de rolagem da transição para a página principal */}
      <div ref={heroTrackRef} className="hero-scroll-container">
        <div className="hero-sticky-frame">
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
      </div>

      {/* Nova seção com fundo verde-escuro opaco (#06402b) e título semântico */}
      <section className="protection-section" aria-label="Proteção dos Biomas">
        <div className="protection-content">
          <h2 className="protection-title">
            O que podemos fazer para proteger os biomas brasileiros?
          </h2>
        </div>
      </section>
    </div>
  );
}
