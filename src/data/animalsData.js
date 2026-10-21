/**
 * Base de dados oficial da fauna brasileira para os seis biomas continentais.
 * Classificações de conservação segundo o Livro Vermelho do ICMBio e Lista Vermelha da IUCN.
 * Períodos de atividade categorizados para suportar filtros combinados de Dia/Noite e Ameaça.
 */

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';

export const ANIMALS = [
  // ==================== AMAZÔNIA ====================
  {
    id: 'gaviao-real',
    name: 'Gavião-real (Harpia)',
    scientificName: 'Harpia harpyja',
    biomeId: 'amazonia',
    image: `${BASE_URL}assets/animals/gaviao-real.jpg`,
    description: 'Uma das maiores e mais poderosas aves de rapina do mundo, habita a copa densa e alta da floresta tropical úmida.',
    curiosity: 'Suas garras traseiras medem até 7 cm — maiores que as de um urso-pardo —, capazes de erguer presas pesadas como preguiças e macacos.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'boto-cor-de-rosa',
    name: 'Boto-cor-de-rosa',
    scientificName: 'Inia geoffrensis',
    biomeId: 'amazonia',
    image: `${BASE_URL}assets/animals/boto-cor-de-rosa.jpg`,
    description: 'O maior golfinho de água doce do planeta, perfeitamente adaptado para nadar entre raízes e copas submersas nos igapós.',
    curiosity: 'Possui vértebras cervicais não fundidas que lhe permitem girar o pescoço em até 90 graus, facilitando manobras na floresta inundada.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'EN',
    conservationLabel: 'Em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'onca-pintada',
    name: 'Onça-pintada',
    scientificName: 'Panthera onca',
    biomeId: 'amazonia',
    image: `${BASE_URL}assets/animals/onca-pintada.jpg`,
    description: 'O maior felino das Américas e predador de topo, com papel ecológico vital na manutenção do equilíbrio da floresta.',
    curiosity: 'Possui a mordida mais potente entre todos os felinos proporcional ao tamanho corporal, capaz de perfurar facilmente o casco de tartarugas.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'urutau',
    name: 'Urutau (Pássaro-fantasma)',
    scientificName: 'Nyctibius griseus',
    biomeId: 'amazonia',
    image: `${BASE_URL}assets/animals/urutau.jpg`,
    description: 'Ave noturna de camuflagem lendária que passa o dia estática sobre tocos secos, confundindo-se perfeitamente com a madeira.',
    curiosity: 'Apresenta fendas minúsculas nas pálpebras superiores que lhe permitem vigiar predadores e presas mesmo estando de olhos fechados.',
    activityHabit: 'Noturno',
    activityPeriods: ['noturno'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },

  // ==================== CERRADO ====================
  {
    id: 'tamandua-bandeira',
    name: 'Tamanduá-bandeira',
    scientificName: 'Myrmecophaga tridactyla',
    biomeId: 'cerrado',
    image: `${BASE_URL}assets/animals/tamandua-bandeira.jpg`,
    description: 'Mamífero emblemático da savana brasileira com cauda plumosa inconfundível, especializado em forragear nos campos abertos.',
    curiosity: 'Sua língua extensível pode ultrapassar 60 cm e mover-se até 160 vezes por minuto para capturar milhares de cupins e formigas.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'ema',
    name: 'Ema',
    scientificName: 'Rhea americana',
    biomeId: 'cerrado',
    image: `${BASE_URL}assets/animals/ema.jpg`,
    description: 'A maior ave nativa da América do Sul, com pernas velozes e fortes perfeitamente adaptadas aos campos limpos e chapadas do Cerrado.',
    curiosity: 'O macho é quem choca pacientemente os ovos postos por várias fêmeas no ninho e cuida sozinho com extrema dedicação de todos os filhotes.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'NT',
    conservationLabel: 'Quase ameaçada',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'lobo-guara',
    name: 'Lobo-guará',
    scientificName: 'Chrysocyon brachyurus',
    biomeId: 'cerrado',
    image: `${BASE_URL}assets/animals/lobo-guara.jpg`,
    description: 'O maior canídeo silvestre sul-americano, com pernas compridas e pelagem rubra que o ajudam a enxergar acima do capim alto.',
    curiosity: 'É o principal dispersor da lobeira (*Solanum lycocarpum*), fruto que constitui grande parte de sua dieta e previne parasitas renais.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'tatu-canastra',
    name: 'Tatu-canastra',
    scientificName: 'Priodontes maximus',
    biomeId: 'cerrado',
    image: `${BASE_URL}assets/animals/tatu-canastra.jpg`,
    description: 'O maior tatu do planeta, chegando a 50 kg; suas tocas profundas servem de refúgio térmico para mais de 20 outras espécies de animais.',
    curiosity: 'Sua terceira garra dianteira mede até 20 cm e funciona como uma pá mecânica capaz de arrebentar cupinzeiros extremamente duros.',
    activityHabit: 'Noturno',
    activityPeriods: ['noturno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },

  // ==================== CAATINGA ====================
  {
    id: 'ararinha-azul',
    name: 'Ararinha-azul',
    scientificName: 'Cyanopsitta spixii',
    biomeId: 'caatinga',
    image: `${BASE_URL}assets/animals/ararinha-azul.jpg`,
    description: 'Ave histórica e exclusiva da Caatinga do nordeste brasileiro, centro de um pioneiro programa de conservação e reintrodução à natureza.',
    curiosity: 'Depende das matas ciliares de caraibeiras ao longo dos riachos temporários para obter sementes nutritivas e ocos seguros para seus ninhos.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'CR',
    conservationLabel: 'Criticamente em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'moco',
    name: 'Mocó',
    scientificName: 'Kerodon rupestris',
    biomeId: 'caatinga',
    image: `${BASE_URL}assets/animals/moco.jpg`,
    description: 'Roedor endêmico da Caatinga brasileira, especialista em saltar com destreza nas encostas rochosas e lajedos aquecidos pelo sol.',
    curiosity: 'Suas patas possuem almofadas emborrachadas especiais que não escorregam nem se queimam sobre pedras íngremes do semiárido.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'tatu-bola',
    name: 'Tatu-bola-da-caatinga',
    scientificName: 'Tolypeutes tricinctus',
    biomeId: 'caatinga',
    image: `${BASE_URL}assets/animals/tatu-bola.jpg`,
    description: 'Mamífero 100% brasileiro adaptado à vegetação hiperxerófila da Caatinga e à escassez hídrica prolongada.',
    curiosity: 'Ao contrário de outros tatus que fogem cavando, ele fecha sua carapaça em uma esfera rígida perfeita e impenetrável contra predadores.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'EN',
    conservationLabel: 'Em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'gato-do-mato',
    name: 'Gato-do-mato-pintado',
    scientificName: 'Leopardus tigrinus',
    biomeId: 'caatinga',
    image: `${BASE_URL}assets/animals/gato-do-mato.jpg`,
    description: 'Pequeno felino arisco e solitário com pelagem manchada de camuflagem refinada para emboscadas noturnas na mata seca.',
    curiosity: 'Excelente saltador e escalador, consegue descer de árvores de cabeça para baixo graças à flexibilidade de suas articulações posteriores.',
    activityHabit: 'Noturno',
    activityPeriods: ['noturno'],
    conservationStatus: 'EN',
    conservationLabel: 'Em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },

  // ==================== MATA ATLÂNTICA ====================
  {
    id: 'mico-leao-dourado',
    name: 'Mico-leão-dourado',
    scientificName: 'Leontopithecus rosalia',
    biomeId: 'mata-atlantica',
    image: `${BASE_URL}assets/animals/mico-leao-dourado.jpg`,
    description: 'Primata carismático de pelagem alaranjada viva, símbolo internacional da luta pela preservação e restauração da Mata Atlântica.',
    curiosity: 'Utiliza seus dedos esguios para vasculhar o interior de bromélias e fendas de cascas em busca de insetos, sapos e pequenos frutos.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'EN',
    conservationLabel: 'Em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'tucano-de-bico-preto',
    name: 'Tucano-de-bico-preto',
    scientificName: 'Ramphastos vitellinus',
    biomeId: 'mata-atlantica',
    image: `${BASE_URL}assets/animals/tucano-de-bico-preto.jpg`,
    description: 'Ave exuberante das florestas costeiras com bico escuro e garganta contrastante, fundamental na regeneração vegetal por dispersar sementes.',
    curiosity: 'Seu bico longo é leve como favo de mel e contém rica rede de vasos sanguíneos que expandem ou contraem para resfriar o corpo do pássaro.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'jaguatirica',
    name: 'Jaguatirica',
    scientificName: 'Leopardus pardalis',
    biomeId: 'mata-atlantica',
    image: `${BASE_URL}assets/animals/jaguatirica.jpg`,
    description: 'Felino de porte médio com pelagem desenhada em rosetas alongadas, caçador noturno habilidoso na floresta subtropical e serrana.',
    curiosity: 'Nada com destreza atravessando rios largos e escala árvores com firmeza em perseguição de aves, roedores e preguiças à noite.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'suindara',
    name: 'Suindara (Coruja-da-igreja)',
    scientificName: 'Tyto furcata',
    biomeId: 'mata-atlantica',
    image: `${BASE_URL}assets/animals/suindara.jpg`,
    description: 'Rapinante noturna de voo totalmente silencioso, reconhecida pelo disco facial em coração que capta sons inaudíveis ao ouvido humano.',
    curiosity: 'A borda dentada de suas penas primárias quebra o fluxo de ar, permitindo planar sem produzir qualquer ruído de bater de asas.',
    activityHabit: 'Noturno',
    activityPeriods: ['noturno'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },

  // ==================== PANTANAL ====================
  {
    id: 'tuiuiu',
    name: 'Tuiuiú (Jaburu)',
    scientificName: 'Jabiru mycteria',
    biomeId: 'pantanal',
    image: `${BASE_URL}assets/animals/tuiuiu.jpg`,
    description: 'A ave-símbolo do Pantanal, pernalta monumental de até 1,40 m de altura e impressionante envergadura de asas de até 2,80 metros.',
    curiosity: 'Constrói os maiores ninhos arbóreos da América do Sul, que podem resistir por décadas e são constantemente reparados pelo casal ano a ano.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'arara-azul',
    name: 'Arara-azul-grande',
    scientificName: 'Anodorhynchus hyacinthinus',
    biomeId: 'pantanal',
    image: `${BASE_URL}assets/animals/arara-azul.jpg`,
    description: 'A maior espécie de arara do mundo, com plumagem azul-cobalto intensa e anéis amarelos ao redor dos olhos e mandíbula.',
    curiosity: 'Possui mandíbula extraordinariamente forte que quebra as nozes mais duras de palmeiras nativas como o acuri e a bocaiúva.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'jacare-do-pantanal',
    name: 'Jacaré-do-pantanal',
    scientificName: 'Caiman yacare',
    biomeId: 'pantanal',
    image: `${BASE_URL}assets/animals/jacare-do-pantanal.jpg`,
    description: 'Réptil clássico das bacias pantaneiras, com papel regulador indispensável nas baías e corixos de águas calmas.',
    curiosity: 'À noite, seus olhos reluzem um vermelho vivo quando iluminados por lanternas devido à camada reflexiva interna (*tapetum lucidum*).',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'cervo-do-pantanal',
    name: 'Cervo-do-pantanal',
    scientificName: 'Blastocerus dichotomus',
    biomeId: 'pantanal',
    image: `${BASE_URL}assets/animals/cervo-do-pantanal.jpg`,
    description: 'O maior cervídeo da América do Sul, com pelagem avermelhada e galhadas vistosas que habita as áreas alagadiças e campos úmidos.',
    curiosity: 'Seus cascos possuem membranas interdigitais extensíveis que se abrem na pisada, evitando que o cervo afunde no lodo das várzeas.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },

  // ==================== PAMPA ====================
  {
    id: 'veado-campeiro',
    name: 'Veado-campeiro',
    scientificName: 'Ozotoceros bezoarticus',
    biomeId: 'pampa',
    image: `${BASE_URL}assets/animals/veado-campeiro.jpg`,
    description: 'Cervídeo gracioso característico dos campos limpos e coxilhas abertas do Pampa sul-rio-grandense.',
    curiosity: 'Apresenta visão panorâmica periférica excepcional para detectar predadores à grande distância no horizonte descampado dos pampas.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'VU',
    conservationLabel: 'Vulnerável',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'cardeal-amarelo',
    name: 'Cardeal-amarelo',
    scientificName: 'Gubernatrix cristata',
    biomeId: 'pampa',
    image: `${BASE_URL}assets/animals/cardeal-amarelo.jpg`,
    description: 'Ave campestre com crista escura pontiaguda e plumagem amarela e oliva, uma das espécies mais raras e ameaçadas do sul do país.',
    curiosity: 'Muito visado no passado pelo canto melodioso, hoje conta com planos intensivos de proteção de seus últimos ninhos no Pampa.',
    activityHabit: 'Diurno',
    activityPeriods: ['diurno'],
    conservationStatus: 'CR',
    conservationLabel: 'Criticamente em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'graxaim-do-campo',
    name: 'Graxaim-do-campo',
    scientificName: 'Lycalopex gymnocercus',
    biomeId: 'pampa',
    image: `${BASE_URL}assets/animals/graxaim-do-campo.jpg`,
    description: 'Pequeno canídeo ágil e adaptável de pelagem cinzenta espessa, onívoro que percorre grandes distâncias nas noites do Pampa.',
    curiosity: 'Quando encurralado sem chance de fuga, pode fingir-se de morto (tanatose), permanecendo imóvel até que o perigo se afaste.',
    activityHabit: 'Crepuscular e Noturno',
    activityPeriods: ['noturno', 'crepuscular'],
    conservationStatus: 'LC',
    conservationLabel: 'Pouco preocupante',
    isThreatened: false,
    source: 'ICMBio / Lista Vermelha IUCN'
  },
  {
    id: 'gato-palheiro',
    name: 'Gato-palheiro (Gato-dos-pampas)',
    scientificName: 'Leopardus munoai',
    biomeId: 'pampa',
    image: `${BASE_URL}assets/animals/gato-palheiro.jpg`,
    description: 'Um dos felinos mais raros e ameaçados do mundo, com pelagem longa e densa adapted às noites frias dos campos de gramíneas sulinos.',
    curiosity: 'Ao se sentir ameaçado, arrepia os pelos dorsais compridos para duplicar sua silhueta visual e afugentar invasores territoriais.',
    activityHabit: 'Noturno',
    activityPeriods: ['noturno'],
    conservationStatus: 'CR',
    conservationLabel: 'Criticamente em perigo',
    isThreatened: true,
    source: 'ICMBio / Lista Vermelha IUCN'
  }
];

/**
 * Função utilitária para filtrar animais de acordo com os critérios ativos:
 * - biomeId: string do bioma selecionado
 * - isNightMode: boolean indicando se o modo noturno está ativado
 * - onlyThreatened: boolean indicando se o filtro de animais ameaçados está ativado
 */
export function filterAnimals({ biomeId, isNightMode, onlyThreatened }) {
  if (!biomeId) return [];

  return ANIMALS.filter((animal) => {
    // 1. Filtro por bioma selecionado
    if (animal.biomeId !== biomeId) {
      return false;
    }

    // 2. Filtro por período de atividade (Dia vs Noite)
    if (isNightMode) {
      // Modo noturno: mostra animais com hábitos noturnos ou crepusculares
      const matchesNight = animal.activityPeriods.some(
        (p) => p === 'noturno' || p === 'crepuscular'
      );
      if (!matchesNight) return false;
    } else {
      // Modo diurno: mostra animais com hábitos diurnos (ou crepusculares com atividade diurna)
      const matchesDay = animal.activityPeriods.some(
        (p) => p === 'diurno'
      );
      if (!matchesDay) return false;
    }

    // 3. Filtro por ameaça de extinção (CR, EN, VU)
    if (onlyThreatened && !animal.isThreatened) {
      return false;
    }

    return true;
  });
}
