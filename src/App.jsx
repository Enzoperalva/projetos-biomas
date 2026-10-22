import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Header from './components/Header';
import MapColumn from './components/MapColumn';
import AnimalGallery from './components/AnimalGallery';
import FlashlightOverlay from './components/FlashlightOverlay';
import PreservationSection from './components/PreservationSection';
import Footer from './components/Footer';
import { BIOMES } from './data/biomeData';
import './App.css';

const BASE_VOLUME = 0.55;

/**
 * Interface principal do Atlas Biomas do Brasil.
 * Experiência interativa e imersiva com seleção de biomas, galeria de fauna diurna e noturna,
 * áudio ambiente independente por bioma com transição suave, modo Dia/Noite com lanterna digital,
 * filtro de espécies ameaçadas de extinção e transição contínua para a seção de preservação.
 * Arquitetura de alto desempenho com isolamento de escopo para cliques e hovers.
 */
export default function App() {
  // Estado do bioma selecionado (padrão: Amazônia)
  const [selectedBiome, setSelectedBiome] = useState('amazonia');

  // Estados dos modos e filtros
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [onlyThreatened, setOnlyThreatened] = useState(false);

  // Referências de mídia e elementos de rolagem
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const heroTrackRef = useRef(null);

  // Referências para a seção de preservação dos biomas e animação dos cards
  const protectionTrackRef = useRef(null);
  const protectionStickyRef = useRef(null);
  const protectionStageRef = useRef(null);
  const protectionHeaderRef = useRef(null);
  const protectionTitleRef = useRef(null);
  const protectionCardsWrapperRef = useRef(null);
  const protectionCardsListRef = useRef([]);

  // Controle de intenção explícita do usuário vs pausa provocada pela transição
  const userWantsAudioRef = useRef(false);
  const pausedByTransitionRef = useRef(false);
  const currentTargetVolumeRef = useRef(BASE_VOLUME);
  const isFadingAudioRef = useRef(false);

  // Dados do bioma atualmente selecionado
  const selectedBiomeData = useMemo(() => {
    return BIOMES.find((b) => b.id === selectedBiome) || BIOMES[0];
  }, [selectedBiome]);

  // Transição suave de áudio (crossfade / fade-out e fade-in)
  const changeBiomeAudio = useCallback((newAudioSrc) => {
    const audio = audioRef.current;
    if (!audio) return;

    const fullSrc = `${import.meta.env.BASE_URL}${newAudioSrc}`;

    // Se o áudio estiver pausado ou mutado pelo usuário, apenas atualiza a fonte
    if (!userWantsAudioRef.current || audio.paused || pausedByTransitionRef.current) {
      audio.src = fullSrc;
      return;
    }

    // Evita múltiplos fades simultâneos
    if (isFadingAudioRef.current) {
      audio.src = fullSrc;
      audio.play().catch(() => {});
      return;
    }

    isFadingAudioRef.current = true;
    const initialVolume = audio.volume;
    const fadeOutDuration = 220;
    const startTime = performance.now();

    const fadeOutStep = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / fadeOutDuration);
      audio.volume = Math.max(0, initialVolume * (1 - progress));

      if (progress < 1) {
        requestAnimationFrame(fadeOutStep);
      } else {
        audio.pause();
        audio.src = fullSrc;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              const inStartTime = performance.now();
              const fadeInDuration = 280;
              const targetVol = currentTargetVolumeRef.current;

              const fadeInStep = (inNow) => {
                const inElapsed = inNow - inStartTime;
                const inProgress = Math.min(1, inElapsed / fadeInDuration);
                audio.volume = Math.min(targetVol, targetVol * inProgress);

                if (inProgress < 1 && !audio.paused) {
                  requestAnimationFrame(fadeInStep);
                } else {
                  isFadingAudioRef.current = false;
                }
              };

              requestAnimationFrame(fadeInStep);
            })
            .catch((err) => {
              isFadingAudioRef.current = false;
              console.debug('Transição de áudio aguardando interação:', err);
            });
        } else {
          isFadingAudioRef.current = false;
        }
      }
    };

    requestAnimationFrame(fadeOutStep);
  }, []);

  // Seleção de bioma
  const handleSelectBiome = useCallback(
    (id) => {
      if (!id) return;
      setSelectedBiome(id);
      const targetBiome = BIOMES.find((b) => b.id === id);
      if (targetBiome && targetBiome.audioSrc) {
        changeBiomeAudio(targetBiome.audioSrc);
      }
    },
    [changeBiomeAudio]
  );

  // Alterna Modo Dia / Modo Noite
  const handleToggleNightMode = useCallback(() => {
    setIsNightMode((prev) => !prev);
  }, []);

  // Alterna filtro de animais ameaçados de extinção
  const handleToggleThreatened = useCallback(() => {
    setOnlyThreatened((prev) => !prev);
  }, []);

  // Alterna a reprodução do áudio ambiente
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

        const vol = Math.max(0, Math.min(1, BASE_VOLUME * (1 - progress)));
        currentTargetVolumeRef.current = vol;
        audio.volume = vol;
      } else {
        currentTargetVolumeRef.current = BASE_VOLUME;
        audio.volume = BASE_VOLUME;
      }

      // Garante que a fonte do áudio atual seja a do bioma selecionado
      const expectedSrc = `${import.meta.env.BASE_URL}${selectedBiomeData.audioSrc}`;
      if (!audio.src || !audio.src.includes(selectedBiomeData.audioSrc)) {
        audio.src = expectedSrc;
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
  }, [selectedBiomeData]);

  // Efeito do vídeo de fundo e áudio
  useEffect(() => {
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
        if (audio.paused && !pausedByTransitionRef.current && userWantsAudioRef.current) {
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

      // Loop nativo seguro
      const handleAudioEnded = () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      };
      audio.addEventListener('ended', handleAudioEnded);

      // Sincronização progressiva do áudio com a rolagem
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
          audio.volume = 0;
          if (!audio.paused) {
            pausedByTransitionRef.current = true;
            audio.pause();
          }
        } else {
          const currentVolume = BASE_VOLUME * (1 - progress);
          currentTargetVolumeRef.current = currentVolume;
          if (!isFadingAudioRef.current) {
            audio.volume = Math.max(0, Math.min(1, currentVolume));
          }

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

      // Sincronização contínua e reversível da seção de preservação com memoização de limites
      let lastPreservationProgress = -1;

      const updatePreservationScroll = () => {
        const track = protectionTrackRef.current;
        const title = protectionTitleRef.current;
        const cardsWrapper = protectionCardsWrapperRef.current;
        const cardElements = protectionCardsListRef.current;

        if (!track || !title || !cardsWrapper) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 768) {
          if (lastPreservationProgress === -2) return;
          lastPreservationProgress = -2;
          title.style.transform = '';
          title.style.opacity = '1';
          cardsWrapper.style.opacity = '1';
          cardsWrapper.style.pointerEvents = 'auto';
          for (let i = 0; i < cardElements.length; i++) {
            const cardEl = cardElements[i];
            if (cardEl) {
              cardEl.style.opacity = '1';
              cardEl.style.transform = '';
            }
          }
          return;
        }

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

        // Se o progresso permaneceu no limite estático (fora da seção), evita mutações repetidas de DOM
        if (progress <= 0.0001 && lastPreservationProgress <= 0.0001 && lastPreservationProgress !== -1) return;
        if (progress >= 0.9999 && lastPreservationProgress >= 0.9999) return;
        lastPreservationProgress = progress;

        // Etapa 1: Apresentação suave do título (0 a 0.35)
        const rawTitleProgress = Math.min(1, Math.max(0, progress / 0.35));
        const smoothTitle = rawTitleProgress * rawTitleProgress * (3 - 2 * rawTitleProgress);

        if (smoothTitle >= 0.999) {
          title.style.opacity = '1';
          title.style.transform = '';
        } else {
          const titleY = (1 - smoothTitle) * 16;
          title.style.opacity = Math.max(0.15, smoothTitle).toFixed(3);
          title.style.transform = `translate3d(0, ${titleY.toFixed(2)}px, 0)`;
        }

        // Etapa 2: Aparição progressiva dos cards (0.35 a 0.85)
        const rawCardsProgress = Math.min(1, Math.max(0, (progress - 0.35) / 0.50));

        if (rawCardsProgress <= 0.001) {
          cardsWrapper.style.opacity = '0';
          cardsWrapper.style.pointerEvents = 'none';
          for (let i = 0; i < cardElements.length; i++) {
            const cardEl = cardElements[i];
            if (cardEl) {
              cardEl.style.opacity = '0';
              cardEl.style.transform = 'translate3d(0, 24px, 0)';
            }
          }
        } else {
          cardsWrapper.style.opacity = '1';
          cardsWrapper.style.pointerEvents = rawCardsProgress > 0.88 ? 'auto' : 'none';

          const cardStagger = 0.06;
          const cardDuration = 0.72;

          for (let i = 0; i < cardElements.length; i++) {
            const cardEl = cardElements[i];
            if (!cardEl) continue;

            const cardStart = i * cardStagger;
            const cardRaw = Math.min(1, Math.max(0, (rawCardsProgress - cardStart) / cardDuration));
            const cardP = cardRaw * cardRaw * (3 - 2 * cardRaw);

            if (cardP >= 0.999) {
              cardEl.style.opacity = '1';
              cardEl.style.transform = '';
            } else {
              cardEl.style.opacity = cardP.toFixed(3);
              cardEl.style.transform = `translate3d(0, ${((1 - cardP) * 24).toFixed(2)}px, 0)`;
            }
          }
        }
      };

      const handleScrollOrResize = () => {
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          updateScrollAudio();
          updatePreservationScroll();
        });
      };

      window.addEventListener('scroll', handleScrollOrResize, { passive: true });
      window.addEventListener('resize', handleScrollOrResize, { passive: true });

      updateScrollAudio();
      updatePreservationScroll();

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

  const atmosphere = isNightMode
    ? selectedBiomeData?.atmosphereNight
    : selectedBiomeData?.atmosphereDay;

  return (
    <div className={`app-layout ${isNightMode ? 'night-mode' : 'day-mode'} biome-${selectedBiome}`}>
      {/* Camada do vídeo de fundo com desfoque moderado e hardware-accelerated */}
      <video
        ref={videoRef}
        className="forest-background"
        src={`${import.meta.env.BASE_URL}assets/biomes/videoFlorestaDia.mp4`}
        poster={`${import.meta.env.BASE_URL}assets/biomes/floresta-amazonica-dia.jpg`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Camada dinâmica de atmosfera visual do bioma selecionado */}
      <div
        className="biome-ambient-overlay"
        aria-hidden="true"
        style={{
          background: atmosphere?.ambientGradient || undefined
        }}
      />

      {/* Camada de luz natural ou luar noturno */}
      <div className={`daylight-overlay ${isNightMode ? 'night-overlay' : ''}`} aria-hidden="true" />

      {/* Efeito de lanterna digital no modo noturno */}
      <FlashlightOverlay isNightMode={isNightMode} />

      {/* Áudio ambiente com som característico do bioma selecionado */}
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${selectedBiomeData.audioSrc}`}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Trilha de rolagem da transição para a página principal */}
      <div ref={heroTrackRef} className="hero-scroll-container">
        <div className="hero-sticky-frame">
          <div className="app-content">
            <Header
              isAudioPlaying={isAudioPlaying}
              onToggleAudio={toggleAudio}
              isNightMode={isNightMode}
              onToggleNightMode={handleToggleNightMode}
              onlyThreatened={onlyThreatened}
              onToggleThreatened={handleToggleThreatened}
            />

            <main className="main-stage">
              <div className="stage-workspace">
                {/* Coluna do Mapa e da Legenda com hover isolado */}
                <MapColumn
                  selectedBiome={selectedBiome}
                  onSelectBiome={handleSelectBiome}
                />

                {/* Coluna da Galeria de Animais */}
                <div className="gallery-column">
                  <AnimalGallery
                    biome={selectedBiomeData}
                    isNightMode={isNightMode}
                    onlyThreatened={onlyThreatened}
                    onToggleThreatened={handleToggleThreatened}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Seção de preservação dos biomas brasileiros com cards e animação de scroll */}
      <PreservationSection
        ref={protectionTrackRef}
        stickyRef={protectionStickyRef}
        stageRef={protectionStageRef}
        headerRef={protectionHeaderRef}
        titleRef={protectionTitleRef}
        cardsWrapperRef={protectionCardsWrapperRef}
        cardsListRef={protectionCardsListRef}
      />

      {/* Rodapé minimalista com links e créditos */}
      <Footer />
    </div>
  );
}
