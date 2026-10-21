# Requisitos — Atlas Biomas do Brasil 🌿

Documento de especificação técnica e funcional do Atlas Interativo dos Biomas do Brasil.

---

## 1. Visão Geral do Produto

O **Biomas do Brasil** é uma aplicação web imersiva e interativa que apresenta a cartografia oficial e a rica biodiversidade dos seis biomas brasileiros (Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal e Pampa).

---

## 2. Requisitos Funcionais (RF)

### RF01 — Seleção e Interação com Biomas
- O usuário pode selecionar qualquer um dos seis biomas através do mapa interativo oficial do IBGE 2025 ou através da legenda lateral.
- Ao clicar ou focar em um bioma:
  - O bioma é marcado como ativo/selecionado permanentemente até que outro seja escolhido.
  - A região correspondente no mapa recebe destaque vetorial contínuo (`.is-selected`) enquanto os demais biomas são sutilmente atenuados (`.is-dimmed`).
  - O painel superior/legenda atualiza o nome e indicadores do bioma.
  - O ambiente visual adapta sua paleta de cores, gradientes e iluminação para refletir a atmosfera daquele bioma.
  - A galeria de animais do bioma é atualizada imediatamente.
  - Se o som estiver ativado, o áudio ambiente realiza transição suave para o som característico do bioma selecionado.

### RF02 — Galeria de Fauna dos Biomas
- Exibe cards informativos dos animais nativos do bioma selecionado.
- Cada card contém:
  - Fotografia oficial do animal em habitat natural com texto alternativo descritivo (`alt`).
  - Nome popular e nome científico em itálico.
  - Badge com período de atividade (Diurno, Noturno ou Crepuscular).
  - Badge com categoria oficial de conservação (CR, EN, VU, NT, LC).
  - Descrição ecológica concisa e envolvente.
  - Curiosidade biológica de destaque.
  - Citação da fonte dos dados (ICMBio / Lista Vermelha IUCN).
- Se a combinação de filtros não retornar animais, exibe mensagem amigável de estado vazio sem quebrar o layout.

### RF03 — Paisagens Sonoras Ambientes dos Biomas
- Áudio ambiente imersivo e independente associado a cada bioma:
  - Amazônia: floresta densa com chuva e aves tropicais.
  - Cerrado: brisa campestre de savana com canto do Sabiá-laranjeira (*Turdus rufiventris*).
  - Caatinga: vento semiárido e cigarras (*Cicadidae*).
  - Mata Atlântica: riacho de encosta e canto da Corruíra (*Troglodytes musculus*).
  - Pantanal: ambiente aquático com anfíbios e respingos de várzea.
  - Pampa: vento constante sobre gramíneas e campos abertos.
- Controle de som no cabeçalho permite ativar e silenciar a qualquer momento.
- Transição suave (*crossfade* ou *fade-out* / *fade-in*) entre áudios ao trocar de bioma.
- Não sobrepõe múltiplas trilhas sonoras simultaneamente.
- Respeita políticas de autoplay de navegadores modernos aguardando interação válida do usuário.
- Ao rolar para a seção de preservação, atenua o áudio progressivamente até mutar.

### RF04 — Alternância Modo Dia e Modo Noite
- Controle interativo no cabeçalho com ícones e status em tempo real.
- **Modo Dia:**
  - Atmosfera iluminada, clara e natural.
  - Filtra preferencialmente espécies com hábitos diurnos (e catemerais).
- **Modo Noite:**
  - Atmosfera noturna profunda com tons escuros, contraste balanceado e realces bioluminescentes.
  - Filtra preferencialmente espécies com hábitos noturnos e crepusculares.
- A alternância preserva o bioma atualmente selecionado.

### RF05 — Efeito de Lanterna Digital (Spotlight)
- No Modo Noite, uma iluminação dinâmica suave ilumina a área explorada pelo usuário.
- No desktop: segue o movimento do cursor (`pointermove`) através de máscara/gradiente radial com transição fluida.
- Em dispositivos móveis/telas sensíveis ao toque: adapta-se suavemente ao toque sem bloquear eventos de clique ou rolagem (`pointer-events: none`).
- Respeita estritamente a preferência do sistema `prefers-reduced-motion`.

### RF06 — Filtro de Animais Ameaçados de Extinção
- Botão toggle no cabeçalho e na galeria ("Ameaçados de extinção").
- Filtra apenas espécies nas categorias de ameaça oficial: **CR** (Criticamente em perigo), **EN** (Em perigo) e **VU** (Vulnerável).
- Opera simultaneamente com o bioma selecionado e o modo Dia/Noite ativo.

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF01 — Performance:** Recursos otimizados (imagens < 300KB, áudios a 128kbps normalizados).
- **RNF02 — Acessibilidade:** Teclado (Tab, Enter, Espaço), atributos WAI-ARIA (`aria-pressed`, `aria-label`, `aria-live`), contraste legível em ambos os modos.
- **RNF03 — Responsividade:** Layout fluido de 320px a monitores 4K.
- **RNF04 — Resiliência:** Tratamento gracioso para falha de carregamento de imagens ou áudio sem quebrar a interface.
