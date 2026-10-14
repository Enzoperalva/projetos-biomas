import React from 'react';
import { BIOMES } from '../data/biomeData';

/**
 * Painel informativo e legenda posicionado no canto inferior esquerdo.
 * Apresenta a relação dos seis biomas brasileiros e evidencia
 * visualmente a região sob foco com nome, cor e indicador de status.
 */
function BiomeLegend({ activeBiome, onHoverBiome, onLeaveBiome }) {
  const activeBiomeData = BIOMES.find((b) => b.id === activeBiome);

  return (
    <aside className="biome-legend" aria-label="Legenda e identificação dos biomas">
      <div className="legend-header">
        <h2 className="legend-title">Biomas</h2>
        {activeBiomeData ? (
          <div className="legend-active-badge" style={{ borderColor: `${activeBiomeData.color}66` }}>
            <span
              className="legend-active-dot"
              style={{ backgroundColor: activeBiomeData.color }}
              aria-hidden="true"
            />
            <span className="legend-active-text">{activeBiomeData.name}</span>
          </div>
        ) : (
          <span className="legend-hint">Explore o mapa</span>
        )}
      </div>

      <ul className="legend-list">
        {BIOMES.map((biome) => {
          const isActive = activeBiome === biome.id;
          return (
            <li
              key={biome.id}
              className={`legend-item ${isActive ? 'active' : ''}`}
              onMouseEnter={() => onHoverBiome(biome.id)}
              onMouseLeave={onLeaveBiome}
              onClick={() => (isActive ? onLeaveBiome() : onHoverBiome(biome.id))}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`Bioma ${biome.name}${isActive ? ' (selecionado)' : ''}`}
              onFocus={() => onHoverBiome(biome.id)}
              onBlur={onLeaveBiome}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isActive) {
                    onLeaveBiome();
                  } else {
                    onHoverBiome(biome.id);
                  }
                }
              }}
            >
              <span
                className="legend-color-dot"
                style={{ backgroundColor: biome.color }}
                aria-hidden="true"
              />
              <span className="legend-name">{biome.name}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default React.memo(BiomeLegend);
