import React from 'react';
import AnimalCard from './AnimalCard';
import { filterAnimals } from '../data/animalsData';

/**
 * Painel da Galeria de Animais do Bioma selecionado.
 * Permite explorar a fauna diurna/noturna e aplicar o filtro de espécies ameaçadas de extinção.
 */
function AnimalGallery({
  biome,
  isNightMode,
  onlyThreatened,
  onToggleThreatened,
  onCloseGallery
}) {
  if (!biome) return null;

  const filteredAnimals = filterAnimals({
    biomeId: biome.id,
    isNightMode,
    onlyThreatened
  });

  const atmosphere = isNightMode ? biome.atmosphereNight : biome.atmosphereDay;

  return (
    <section
      className={`animal-gallery-panel ${isNightMode ? 'night-gallery' : 'day-gallery'}`}
      aria-label={`Galeria de animais do bioma ${biome.name}`}
    >
      {/* Cabeçalho da Galeria */}
      <header className="gallery-header">
        <div className="gallery-header-info">
          <div className="gallery-biome-tag">
            <span
              className="gallery-biome-dot"
              style={{ backgroundColor: biome.color }}
              aria-hidden="true"
            />
            <span className="gallery-biome-name">{biome.name}</span>
            <span className="gallery-count-badge">
              {filteredAnimals.length} {filteredAnimals.length === 1 ? 'espécie' : 'espécies'}
            </span>
          </div>
          <h2 className="gallery-title">Fauna {isNightMode ? 'Noturna' : 'Diurna'}</h2>
          <p className="gallery-subtitle">{atmosphere?.subtitle || biome.description}</p>
        </div>

        {/* Controles da Galeria */}
        <div className="gallery-controls">
          <button
            type="button"
            className={`btn-threatened-toggle ${onlyThreatened ? 'active' : ''}`}
            onClick={onToggleThreatened}
            aria-pressed={onlyThreatened}
            title={onlyThreatened ? 'Mostrar todas as espécies' : 'Filtrar somente espécies ameaçadas de extinção (CR, EN, VU)'}
          >
            <span className="toggle-indicator" aria-hidden="true">
              <span className="toggle-bullet" />
            </span>
            <span className="toggle-label">Ameaçados de extinção</span>
            {onlyThreatened && <span className="active-pill" aria-hidden="true">Ativo</span>}
          </button>

          {onCloseGallery && (
            <button
              type="button"
              className="btn-gallery-close"
              onClick={onCloseGallery}
              aria-label="Fechar galeria de animais"
              title="Fechar painel de animais"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Grade de Cards de Animais */}
      <div className="gallery-content">
        {filteredAnimals.length > 0 ? (
          <div className="animal-cards-grid">
            {filteredAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isNightMode={isNightMode}
              />
            ))}
          </div>
        ) : (
          /* Estado Vazio Amigável */
          <div className="gallery-empty-state" role="status">
            <div className="empty-state-icon" aria-hidden="true">🌿</div>
            <h3 className="empty-state-title">Nenhuma espécie encontrada</h3>
            <p className="empty-state-text">
              Não encontramos animais {isNightMode ? 'noturnos' : 'diurnos'}
              {onlyThreatened ? ' classificados como ameaçados de extinção' : ''} para o bioma <strong>{biome.name}</strong> com os filtros atuais.
            </p>
            {onlyThreatened && (
              <button
                type="button"
                className="btn-reset-filter"
                onClick={onToggleThreatened}
              >
                Desativar filtro de ameaçados
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default React.memo(AnimalGallery);
