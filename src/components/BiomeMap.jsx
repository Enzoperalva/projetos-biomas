import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BIOMES, BIOME_MAP_SOURCE } from '../data/biomeData';

/**
 * Componente do Mapa dos Biomas Brasileiros.
 * Carrega a base cartográfica oficial do IBGE 2025 diretamente de
 * public/assets/biomes/biomas_brasil_ibge_2025.svg sem modificar
 * geometria, coordenadas ou limites geográficos originais.
 * Fornece interações de foco, hover suave, suporte a teclado e toque.
 */
function BiomeMap({
  selectedBiome,
  hoveredBiome,
  onSelectBiome,
  onHoverBiome,
  onLeaveBiome
}) {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // O bioma exibido ativamente é o que está em hover ou o atualmente selecionado
  const activeBiome = hoveredBiome || selectedBiome;

  // Carrega o arquivo SVG oficial do IBGE 2025
  useEffect(() => {
    let isMounted = true;
    const svgUrl = `${import.meta.env.BASE_URL}${BIOME_MAP_SOURCE}`;

    setLoading(true);
    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Falha ao carregar o mapa: HTTP ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
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
  }, []);

  // Sincroniza classes e atributos de acessibilidade nos elementos do SVG
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const biomePaths = container.querySelectorAll('[data-bioma], path[id]');
    biomePaths.forEach((path) => {
      const isSelected = selectedBiome && path.id === selectedBiome;
      const isHovered = hoveredBiome && path.id === hoveredBiome;
      const isCurrent = isSelected || isHovered;
      const isOther = activeBiome && path.id !== activeBiome;

      path.classList.toggle('destacado', Boolean(isCurrent));
      path.classList.toggle('is-selected', Boolean(isSelected));
      path.classList.toggle('is-hovered', Boolean(isHovered));
      path.classList.toggle('is-dimmed', Boolean(isOther));

      path.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      
      const biomeInfo = BIOMES.find((b) => b.id === path.id);
      if (biomeInfo) {
        path.setAttribute('aria-label', `Bioma ${biomeInfo.name}${isSelected ? ' (selecionado)' : ''}`);
      }
    });
  }, [selectedBiome, hoveredBiome, activeBiome, svgContent]);

  // Delegação eficiente de eventos de interação sobre os biomas do SVG
  const handlePointerMove = useCallback(
    (e) => {
      const target = e.target.closest('[data-bioma], path[id]');
      if (target && target.id) {
        if (hoveredBiome !== target.id) {
          onHoverBiome(target.id);
        }
      } else {
        if (hoveredBiome) {
          onLeaveBiome();
        }
      }
    },
    [hoveredBiome, onHoverBiome, onLeaveBiome]
  );

  const handlePointerLeave = useCallback(() => {
    if (hoveredBiome) {
      onLeaveBiome();
    }
  }, [hoveredBiome, onLeaveBiome]);

  const handleFocus = useCallback(
    (e) => {
      const target = e.target.closest('[data-bioma], path[id]');
      if (target && target.id) {
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
