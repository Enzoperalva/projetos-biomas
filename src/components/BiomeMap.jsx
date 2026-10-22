import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BIOMES, BIOME_MAP_SOURCE } from '../data/biomeData';

// Cache do SVG oficial em memória de módulo para evitar re-fetches e parsing repetido
let cachedSvgContent = null;

/**
 * Componente do Mapa dos Biomas Brasileiros.
 * Carrega a base cartográfica oficial do IBGE 2025 diretamente de
 * public/assets/biomes/biomas_brasil_ibge_2025.svg sem modificar
 * geometria, coordenadas ou limites geográficos originais.
 * Altamente otimizado com cache de nós DOM, delegação estabilizada de ponteiro
 * e sincronização de atributos sem seletores repetitivos.
 */
function BiomeMap({
  selectedBiome,
  hoveredBiome,
  onSelectBiome,
  onHoverBiome,
  onLeaveBiome
}) {
  const [svgContent, setSvgContent] = useState(() => cachedSvgContent || '');
  const [loading, setLoading] = useState(() => !cachedSvgContent);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const pathsMapRef = useRef(null);
  const prevSelectedRef = useRef(null);
  const hoveredRef = useRef(hoveredBiome);
  hoveredRef.current = hoveredBiome;

  // O bioma exibido ativamente é o que está sob foco/hover ou o selecionado
  const activeBiome = hoveredBiome || selectedBiome;

  // Carrega o arquivo SVG oficial do IBGE 2025 com cache em memória
  useEffect(() => {
    if (cachedSvgContent) {
      if (svgContent !== cachedSvgContent) {
        setSvgContent(cachedSvgContent);
        setLoading(false);
      }
      return;
    }

    let isMounted = true;
    const svgUrl = `${import.meta.env.BASE_URL}${BIOME_MAP_SOURCE}`;

    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Falha ao carregar o mapa: HTTP ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        cachedSvgContent = text;
        if (isMounted) {
          setSvgContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Erro no carregamento do SVG dos biomas:', err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [svgContent]);

  // Indexação inicial única dos elementos dos biomas após inserção do SVG
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgContent) return;

    const paths = container.querySelectorAll('[data-bioma], path[id]');
    const map = {};

    paths.forEach((path) => {
      map[path.id] = path;
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');

      const isSelected = selectedBiome && path.id === selectedBiome;
      const biomeInfo = BIOMES.find((b) => b.id === path.id);
      if (biomeInfo) {
        path.setAttribute(
          'aria-label',
          `Bioma ${biomeInfo.name}${isSelected ? ' (selecionado)' : ''}`
        );
      }
      path.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    pathsMapRef.current = map;
  }, [svgContent]);

  // Sincronização direta e ultrarrápida das classes e acessibilidade dos 6 biomas
  useEffect(() => {
    const pathsMap = pathsMapRef.current;
    if (!pathsMap) return;

    for (const id in pathsMap) {
      const path = pathsMap[id];
      const isSelected = selectedBiome === id;
      const isHovered = hoveredBiome === id;
      const isCurrent = isSelected || isHovered;
      const isOther = activeBiome && id !== activeBiome;

      path.classList.toggle('destacado', isCurrent);
      path.classList.toggle('is-selected', isSelected);
      path.classList.toggle('is-hovered', isHovered);
      path.classList.toggle('is-dimmed', isOther);

      path.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

      // Atualiza aria-label somente se o estado de seleção mudou
      if (prevSelectedRef.current !== selectedBiome) {
        const biomeInfo = BIOMES.find((b) => b.id === id);
        if (biomeInfo) {
          path.setAttribute(
            'aria-label',
            `Bioma ${biomeInfo.name}${isSelected ? ' (selecionado)' : ''}`
          );
        }
      }
    }

    prevSelectedRef.current = selectedBiome;
  }, [selectedBiome, hoveredBiome, activeBiome]);

  // Manipulador de ponteiro estabilizado com curto-circuito para movimentos internos
  const handlePointerMove = useCallback(
    (e) => {
      const target = e.target.closest('[data-bioma], path[id]');
      const targetId = target ? target.id : null;

      // Se o cursor estiver se movendo dentro do mesmo bioma, retorna imediatamente
      if (hoveredRef.current === targetId) return;

      if (targetId) {
        onHoverBiome(targetId);
      } else if (hoveredRef.current) {
        onLeaveBiome();
      }
    },
    [onHoverBiome, onLeaveBiome]
  );

  const handlePointerLeave = useCallback(() => {
    if (hoveredRef.current) {
      onLeaveBiome();
    }
  }, [onLeaveBiome]);

  const handleFocus = useCallback(
    (e) => {
      const target = e.target.closest('[data-bioma], path[id]');
      if (target && target.id && hoveredRef.current !== target.id) {
        onHoverBiome(target.id);
      }
    },
    [onHoverBiome]
  );

  const handleBlur = useCallback(
    (e) => {
      if (!containerRef.current || !containerRef.current.contains(e.relatedTarget)) {
        onLeaveBiome();
      }
    },
    [onLeaveBiome]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-bioma], path[id]');
        if (target && target.id) {
          e.preventDefault();
          onSelectBiome(target.id);
        }
      }
    },
    [onSelectBiome]
  );

  const handleClick = useCallback(
    (e) => {
      const target = e.target.closest('[data-bioma], path[id]');
      if (target && target.id) {
        onSelectBiome(target.id);
      }
    },
    [onSelectBiome]
  );

  const activeBiomeData = BIOMES.find((b) => b.id === activeBiome);

  return (
    <section className="biome-map-container" aria-label="Mapa interativo dos biomas brasileiros">
      {/* Mensagem dinâmica de interação ao passar o cursor ou focar */}
      <div className="map-message-wrapper" aria-live="polite">
        <div
          className={`map-message-badge ${activeBiomeData ? 'visible' : ''}`}
          role="status"
        >
          {activeBiomeData && (
            <>
              <span
                className="badge-dot"
                style={{ backgroundColor: activeBiomeData.color }}
                aria-hidden="true"
              />
              <span className="badge-text">{activeBiomeData.message}</span>
            </>
          )}
        </div>
      </div>

      {/* Painel translúcido centralizado contendo o SVG cartográfico oficial */}
      <div
        className={`map-frame ${activeBiome ? 'has-active-biome' : ''}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {loading && (
          <div className="map-loading-indicator" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <span className="loading-label">Carregando cartografia oficial do IBGE...</span>
          </div>
        )}

        {error && (
          <div className="map-error-indicator" role="alert">
            <p>Não foi possível carregar os dados cartográficos.</p>
          </div>
        )}

        {!loading && !error && (
          <div
            ref={containerRef}
            className="map-svg-viewport"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
    </section>
  );
}

export default React.memo(BiomeMap);
