import React from 'react';
import { PRESERVATION_CARDS } from '../data/preservationData';

/**
 * Seção de preservação dos biomas brasileiros com cards e animação de rolagem contínua.
 * Memoizada para isolar a estrutura DOM dos cards das re-renderizações da aplicação.
 */
const PreservationSection = React.forwardRef(function PreservationSection(
  {
    stickyRef,
    stageRef,
    headerRef,
    titleRef,
    cardsWrapperRef,
    cardsListRef
  },
  trackRef
) {
  return (
    <section
      ref={trackRef}
      className="protection-section"
      aria-label="Proteção dos Biomas"
    >
      <div ref={stickyRef} className="protection-sticky-frame">
        <div ref={stageRef} className="protection-stage">
          <header ref={headerRef} className="protection-header">
            <h2 ref={titleRef} className="protection-title">
              O que podemos fazer para proteger os biomas brasileiros?
            </h2>
          </header>

          <div ref={cardsWrapperRef} className="protection-cards-wrapper">
            <div className="protection-cards-grid">
              {PRESERVATION_CARDS.map((card, index) => (
                <article
                  key={card.id}
                  ref={(el) => {
                    cardsListRef.current[index] = el;
                  }}
                  className="protection-card"
                >
                  <div className="card-top-strip" aria-hidden="true" />
                  <div className="card-body">
                    <div className="card-icon-container">
                      <img
                        src={card.icon}
                        alt=""
                        className="card-icon-img"
                        loading="lazy"
                        decoding="async"
                        width="34"
                        height="34"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-description">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default React.memo(PreservationSection);
