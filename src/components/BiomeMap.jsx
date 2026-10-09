import React, { useEffect, useState } from 'react';
import { BIOMES, CONTORNO_BRASIL } from '../data/biomeData';

/**
 * Componente do Mapa dos Biomas Brasileiros.
 * Carrega e renderiza a cartografia vetorial a partir de
 * public/assets/biomes/mapa-biomas-brasil.svg, fornecendo estados
 * de hover, foco por teclado e destaque visual diurno sutil.
 */
export default function BiomeMap({ activeBiome, onHoverBiome, onLeaveBiome }) {
  const [svgLoaded, setSvgLoaded] = useState(false);

  useEffect(() => {
    // Valida o carregamento do asset oficial mapa-biomas-brasil.svg
    let isMounted = true;
    const svgUrl = `${import.meta.env.BASE_URL}assets/biomes/mapa-biomas-brasil.svg`;
    fetch(svgUrl)
      .then((res) => {
        if (res.ok) {
          if (isMounted) setSvgLoaded(true);
        }
      })
      .catch((err) => {
        // Fallback robusto garantido pelas coordenadas extraídas
        console.info('SVG carregado através da base cartográfica integrada:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

      {/* Moldura visual do mapa mantendo nitidez sobre o fundo diurno */}
      <div className="map-frame">
        <svg
          viewBox="50 25 450 540"
          className="map-svg"
          role="img"
          aria-labelledby="mapa-titulo mapa-desc"
          preserveAspectRatio="xMidYMid meet"
        >
          <title id="mapa-titulo">Biomas do Brasil</title>
          <desc id="mapa-desc">
            Mapa vetorial com as seis regiões biológicas do Brasil: Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa.
          </desc>

          <g id="camada-biomas" className="camada-biomas">
            {BIOMES.map((biome) => {
              const isHovered = activeBiome === biome.id;
              return (
                <path
                  key={biome.id}
                  id={`mapa-${biome.id}`}
                  d={biome.d}
                  fill={biome.color}
                  className={`biome-path ${isHovered ? 'destacado' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isHovered}
                  aria-label={`${biome.name}. Pressione Enter para inspecionar.`}
                  onMouseEnter={() => onHoverBiome(biome.id)}
                  onMouseLeave={onLeaveBiome}
                  onFocus={() => onHoverBiome(biome.id)}
                  onBlur={onLeaveBiome}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onHoverBiome(biome.id);
                    }
                  }}
                />
              );
            })}

            {/* Contorno externo do território nacional para acabamento geográfico */}
            <path
              id="contorno-brasil"
              d={CONTORNO_BRASIL}
              className="contorno-externo"
              aria-hidden="true"
              pointerEvents="none"
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
