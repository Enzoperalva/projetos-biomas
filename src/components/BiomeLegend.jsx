import React, { useCallback } from 'react';
import { BIOMES } from '../data/biomeData';

/**
 * Item individual da legenda dos biomas.
 * Memoizado para evitar re-criação de nós virtuais quando outros itens mudam.
 */
const LegendItem = React.memo(function LegendItem({
  biome,
  isSelected,
  isActive,
  onSelectBiome,
  onHoverBiome,
  onLeaveBiome
}) {
  const handleMouseEnter = useCallback(() => onHoverBiome(biome.id), [biome.id, onHoverBiome]);
  const handleClick = useCallback(() => onSelectBiome(biome.id), [biome.id, onSelectBiome]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectBiome(biome.id);
      }
    },
    [biome.id, onSelectBiome]
  );

  return (
    <li
      className={`legend-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeaveBiome}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Bioma ${biome.name}${isSelected ? ' (selecionado)' : ''}`}
      onFocus={handleMouseEnter}
      onBlur={onLeaveBiome}
      onKeyDown={handleKeyDown}
    >
      <span
        className="legend-color-dot"
        style={{ backgroundColor: biome.color }}
        aria-hidden="true"
      />
      <span className="legend-name">{biome.name}</span>
      {isSelected && <span className="legend-selected-indicator" aria-hidden="true">✓</span>}
    </li>
  );
});

/**
 * Painel informativo e legenda posicionado no canto inferior esquerdo.
 * Apresenta a relação dos seis biomas brasileiros e evidencia
 * visualmente a região sob foco ou selecionada com nome, cor e status.
 */
function BiomeLegend({
  selectedBiome,
  hoveredBiome,
  onSelectBiome,
  onHoverBiome,
  onLeaveBiome
}) {
  const activeId = hoveredBiome || selectedBiome;
  const activeBiomeData = BIOMES.find((b) => b.id === activeId);

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
          <span className="legend-hint">Clique para explorar</span>
        )}
      </div>

      <ul className="legend-list">
        {BIOMES.map((biome) => {
          const isSelected = selectedBiome === biome.id;
          const isHovered = hoveredBiome === biome.id;
          const isActive = isSelected || isHovered;

          return (
            <LegendItem
              key={biome.id}
              biome={biome}
              isSelected={isSelected}
              isActive={isActive}
              onSelectBiome={onSelectBiome}
              onHoverBiome={onHoverBiome}
              onLeaveBiome={onLeaveBiome}
            />
          );
        })}
      </ul>
    </aside>
  );
}

export default React.memo(BiomeLegend);
