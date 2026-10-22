import React, { useState, useCallback } from 'react';
import BiomeMap from './BiomeMap';
import BiomeLegend from './BiomeLegend';

/**
 * Coluna do Mapa e Legenda dos Biomas.
 * Isola o estado de hover (foco/destaque) no escopo da coluna do mapa,
 * impedindo que o movimento do mouse sobre os polígonos provoque
 * renderizações em cascata no componente raiz (App) e na galeria de animais.
 */
function MapColumn({
  selectedBiome,
  onSelectBiome
}) {
  const [hoveredBiome, setHoveredBiome] = useState(null);

  const handleHoverBiome = useCallback((id) => {
    setHoveredBiome(id);
  }, []);

  const handleLeaveBiome = useCallback(() => {
    setHoveredBiome(null);
  }, []);

  return (
    <div className="map-column">
      <div className="map-area">
        <BiomeMap
          selectedBiome={selectedBiome}
          hoveredBiome={hoveredBiome}
          onSelectBiome={onSelectBiome}
          onHoverBiome={handleHoverBiome}
          onLeaveBiome={handleLeaveBiome}
        />
      </div>

      <div className="legend-area">
        <BiomeLegend
          selectedBiome={selectedBiome}
          hoveredBiome={hoveredBiome}
          onSelectBiome={onSelectBiome}
          onHoverBiome={handleHoverBiome}
          onLeaveBiome={handleLeaveBiome}
        />
      </div>
    </div>
  );
}

export default React.memo(MapColumn);
