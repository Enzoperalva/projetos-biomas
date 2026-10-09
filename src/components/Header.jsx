import React from 'react';

/**
 * Cabeçalho principal com identificação visual do atlas
 * e botão indicador da futura alternância para fauna noturna.
 */
export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-subtitle">ATLAS NATURAL · BRASIL</span>
        <h1 className="header-title">BIOMAS DO BRASIL</h1>
      </div>

      <div className="header-actions">
        <div className="action-wrapper">
          <button
            type="button"
            className="btn-fauna-toggle"
            disabled
            aria-disabled="true"
            title="Funcionalidade em desenvolvimento"
          >
            <span className="btn-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
            <span className="btn-text">Alterar fauna</span>
          </button>
          <span className="badge-upcoming">Modo noturno em breve</span>
        </div>
      </div>
    </header>
  );
}
