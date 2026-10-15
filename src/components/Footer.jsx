import React from 'react';

/**
 * Rodapé minimalista com design moderno, limpo e proporcional.
 * Fundo preto sólido (#000000) e fluxo normal de rolagem do navegador.
 */
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p className="footer-copyright">
          &copy; 2026 Enzo Peralva. Todos os direitos reservados.
        </p>

        <div className="footer-links">
          <a
            href="https://github.com/Enzoperalva"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Perfil do GitHub de Enzo Peralva (abre em nova aba)"
          >
            <svg
              className="footer-link-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>github.com/Enzoperalva</span>
          </a>

          <a
            href="mailto:contato.enzoperalva@gmail.com"
            className="footer-link"
            aria-label="E-mail de contato de Enzo Peralva"
          >
            <svg
              className="footer-link-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>contato.enzoperalva@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
