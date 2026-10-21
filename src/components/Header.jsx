import React from 'react';

/**
 * Cabeçalho principal com identificação visual do atlas,
 * controle do som ambiente com status em tempo real,
 * alternância entre Modo Dia e Modo Noite e filtro de espécies ameaçadas.
 */
function Header({
  isAudioPlaying,
  onToggleAudio,
  isNightMode,
  onToggleNightMode,
  onlyThreatened,
  onToggleThreatened
}) {
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

          {/* Alternância interativa de Modo Dia / Modo Noite */}
          <button
            type="button"
            className={`btn-fauna-toggle ${isNightMode ? 'night-active' : 'day-active'}`}
            onClick={onToggleNightMode}
            aria-pressed={isNightMode}
            aria-label={isNightMode ? 'Alternar para Modo Dia' : 'Alternar para Modo Noite'}
            title={isNightMode ? 'Modo Noite ativo (clique para voltar ao Modo Dia)' : 'Ativar Modo Noite (explorar fauna noturna com lanterna)'}
          >
            <span className="btn-icon" aria-hidden="true">
              {isNightMode ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </span>
            <span className="btn-text">
              {isNightMode ? 'Modo Noite' : 'Modo Dia'}
            </span>
          </button>

          {/* Filtro extra: Ameaçados de extinção */}
          <button
            type="button"
            className={`btn-threatened-header ${onlyThreatened ? 'active' : ''}`}
            onClick={onToggleThreatened}
            aria-pressed={onlyThreatened}
            aria-label="Filtrar espécies ameaçadas de extinção"
            title={onlyThreatened ? 'Filtro ativo: exibindo apenas espécies ameaçadas (CR, EN, VU)' : 'Filtrar somente espécies ameaçadas de extinção'}
          >
            <span className="threatened-icon" aria-hidden="true">⚠️</span>
            <span className="btn-text">Ameaçados</span>
            {onlyThreatened && <span className="threatened-dot" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);
