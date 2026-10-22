import React, { useState } from 'react';

/**
 * Cores temáticas para as categorias oficiais de conservação (ICMBio / IUCN).
 */
const CONSERVATION_COLORS = {
  CR: { bg: 'rgba(220, 38, 38, 0.28)', border: '#ef4444', text: '#ffffff', badgeBg: 'rgba(185, 28, 28, 0.9)' },
  EN: { bg: 'rgba(234, 88, 12, 0.32)', border: '#f97316', text: '#ffffff', badgeBg: 'rgba(194, 65, 12, 0.9)' },
  VU: { bg: 'rgba(217, 119, 6, 0.32)', border: '#f59e0b', text: '#ffffff', badgeBg: 'rgba(180, 83, 9, 0.9)' },
  NT: { bg: 'rgba(2, 132, 199, 0.28)', border: '#38bdf8', text: '#ffffff', badgeBg: 'rgba(3, 105, 161, 0.9)' },
  LC: { bg: 'rgba(22, 163, 74, 0.28)', border: '#4ade80', text: '#ffffff', badgeBg: 'rgba(21, 128, 61, 0.9)' }
};

/**
 * Card individual de apresentação de uma espécie da fauna do bioma.
 * Fornece foto em alta definição, nomes popular e científico, status de conservação oficial,
 * hábitos de atividade (diurno/noturno) e curiosidade ecológica de destaque.
 */
function AnimalCard({ animal, isNightMode }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const statusStyle = CONSERVATION_COLORS[animal.conservationStatus] || CONSERVATION_COLORS.LC;

  return (
    <article
      className={`animal-card ${isNightMode ? 'night-card' : 'day-card'}`}
      aria-label={`${animal.name} (${animal.scientificName})`}
    >
      {/* Imagem do animal com efeito de revelação suave e fallback */}
      <div className="animal-card-media">
        {!imageLoaded && !imageError && (
          <div className="media-placeholder" aria-hidden="true">
            <span className="media-spinner" />
          </div>
        )}

        {imageError ? (
          <div className="media-fallback" role="img" aria-label={`Ilustração representativa de ${animal.name}`}>
            <span className="fallback-icon">🌿</span>
            <span className="fallback-label">{animal.name}</span>
          </div>
        ) : (
          <img
            src={animal.image}
            alt={`Fotografia de ${animal.name} (${animal.scientificName}) em seu habitat natural`}
            className={`animal-image ${imageLoaded ? 'loaded' : ''}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Badges superiores flutuantes */}
        <div className="media-badges">
          {/* Badge de Hábito de Atividade */}
          <span
            className="badge-habit"
            title={`Hábito: ${animal.activityHabit}`}
          >
            <span className="badge-icon" aria-hidden="true">
              {animal.activityPeriods.includes('noturno') ? '🌙' : '☀️'}
            </span>
            <span>{animal.activityHabit}</span>
          </span>

          {/* Badge de Categoria de Conservação */}
          <span
            className="badge-conservation"
            style={{
              backgroundColor: statusStyle.badgeBg,
              borderColor: statusStyle.border,
              color: statusStyle.text
            }}
            title={`Status de conservação: ${animal.conservationLabel} (${animal.conservationStatus})`}
          >
            <span className="badge-code">{animal.conservationStatus}</span>
            <span className="badge-status-label">{animal.conservationLabel}</span>
          </span>
        </div>
      </div>

      {/* Conteúdo textual informativo */}
      <div className="animal-card-body">
        <header className="animal-header">
          <h3 className="animal-name">{animal.name}</h3>
          <em className="animal-scientific">{animal.scientificName}</em>
        </header>

        <p className="animal-description">{animal.description}</p>

        {/* Caixa de curiosidade biológica destacada */}
        <div className="animal-curiosity">
          <div className="curiosity-label">
            <span className="curiosity-icon" aria-hidden="true">💡</span>
            <span>Curiosidade</span>
          </div>
          <p className="curiosity-text">{animal.curiosity}</p>
        </div>

        {/* Rodapé com citação da fonte de conservação */}
        <footer className="animal-footer">
          <span className="source-label">
            Fonte: <strong>{animal.source}</strong>
          </span>
        </footer>
      </div>
    </article>
  );
}

export default React.memo(AnimalCard);
