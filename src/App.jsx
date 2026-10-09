import React, { useState } from 'react';
import Header from './components/Header';
import BiomeMap from './components/BiomeMap';
import BiomeLegend from './components/BiomeLegend';
import './App.css';

/**
 * Interface principal do Atlas Biomas do Brasil.
 * Experiência diurna com fotografia da floresta amazônica de fundo
 * e mapa vetorial interativo em destaque.
 */
export default function App() {
  const [activeBiome, setActiveBiome] = useState(null);

  const handleHoverBiome = (id) => {
    setActiveBiome(id);
  };

  const handleLeaveBiome = () => {
    setActiveBiome(null);
  };

  return (
    <div className="app-layout">
      {/* Camada da fotografia de fundo com desfoque moderado e luminosidade diurna preservada */}
      <div
        className="forest-background"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}assets/biomes/floresta-amazonica-dia.jpg')` }}
        aria-hidden="true"
      />

      {/* Camada de atmosfera de luz natural suave (sem escurecer ou simular noite) */}
      <div className="daylight-overlay" aria-hidden="true" />

      {/* Conteúdo principal nítido sobre o fundo */}
      <div className="app-content">
        <Header />

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
