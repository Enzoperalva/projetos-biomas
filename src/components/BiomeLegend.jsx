import React from 'react';
import { BIOMES } from '../data/biomeData';

/**
 * Legenda compacta posicionada no canto inferior esquerdo,
 * apresentando os seis biomas com indicadores cromáticos.
 */
export default function BiomeLegend({ activeBiome, onHoverBiome, onLeaveBiome }) {
  return (
    <aside className="biome-legend" aria-label="Legenda dos biomas">
      <h2 className="legend-title">Biomas</h2>
      <ul className="legend-list">
        {BIOMES.map((biome) => {
          const isActive = activeBiome === biome.id;
          return (
            <li
              key={biome.id}
              className={`legend-item ${isActive ? 'active' : ''}`}
              onMouseEnter={() => onHoverBiome(biome.id)}
              onMouseLeave={onLeaveBiome}
              tabIndex={0}
              role="button"
              aria-label={`Bioma ${biome.name}`}
              onFocus={() => onHoverBiome(biome.id)}
              onBlur={onLeaveBiome}
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
