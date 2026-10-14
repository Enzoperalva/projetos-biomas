import React from 'react';

/**
 * Cabeçalho principal com identificação visual do atlas,
 * controle do som ambiente diurno e indicador do futuro modo noturno.
 */
function Header({ isAudioPlaying, onToggleAudio }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-subtitle">ATLAS NATURAL · BRASIL</span>
        <h1 className="header-title">BIOMAS DO BRASIL</h1>
      </div>

      <div className="header-actions">
        <div className="action-wrapper">
          {/* Controle do áudio ambiente com status em tempo real */}
          <button
            type="button"
            className={`btn-audio-toggle ${isAudioPlaying ? 'playing' : 'muted'}`}
            onClick={onToggleAudio}
            aria-label={isAudioPlaying ? 'Silenciar som ambiente' : 'Ativar som ambiente'}
            title={isAudioPlaying ? 'Som ambiente ativo (clique para silenciar)' : 'Ativar som ambiente (clique para reproduzir)'}
          >
            <span className="btn-icon" aria-hidden="true">
              {isAudioPlaying ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </span>
            <span className="btn-text">
              {isAudioPlaying ? 'Som ambiente' : 'Ativar som'}
            </span>
          </button>

          <button
            type="button"
            className="btn-fauna-toggle"
            disabled
            aria-disabled="true"
            title="Funcionalidade em desenvolvimento"
          >
            <span className="btn-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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

export default React.memo(Header);
