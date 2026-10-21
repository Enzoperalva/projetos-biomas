/**
 * Definições dos seis biomas brasileiros e dados de identificação
 * correspondentes à base cartográfica oficial do IBGE 2025
 * (public/assets/biomes/biomas_brasil_ibge_2025.svg).
 * Inclui configurações ambientais visuais (cores, gradientes e identidade de atmosfera)
 * e caminhos dos sons ambientes dedicados para cada região.
 */

export const BIOMES = [
  {
    id: 'amazonia',
    name: 'Amazônia',
    color: '#24553D',
    accentColor: '#34d399',
    description: 'Maior floresta tropical úmida do planeta e maior bacia hidrográfica.',
    message: 'Observe a fauna da Amazônia',
    audioSrc: 'assets/audio/amazonia.mp3',
    atmosphereDay: {
      accent: '#24553D',
      badgeColor: 'rgba(36, 85, 61, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(36, 85, 61, 0.38) 0%, rgba(16, 48, 33, 0.65) 60%, rgba(10, 32, 22, 0.85) 100%)',
      subtitle: 'Floresta tropical densa e atmosfera úmida'
    },
    atmosphereNight: {
      accent: '#34d399',
      badgeColor: 'rgba(20, 60, 42, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(16, 52, 35, 0.6) 0%, rgba(7, 24, 16, 0.88) 60%, rgba(3, 12, 8, 0.96) 100%)',
      subtitle: 'Noite misteriosa na copa amazônica'
    }
  },
  {
    id: 'cerrado',
    name: 'Cerrado',
    color: '#C29A4B',
    accentColor: '#fbbf24',
    description: 'Savana de alta biodiversidade e berço das principais bacias hídricas.',
    message: 'Observe a fauna do Cerrado',
    audioSrc: 'assets/audio/cerrado.mp3',
    atmosphereDay: {
      accent: '#C29A4B',
      badgeColor: 'rgba(163, 123, 44, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(194, 154, 75, 0.35) 0%, rgba(135, 100, 36, 0.6) 60%, rgba(68, 48, 14, 0.85) 100%)',
      subtitle: 'Tons terrosos, vegetação de savana e céu aberto'
    },
    atmosphereNight: {
      accent: '#fbbf24',
      badgeColor: 'rgba(92, 68, 22, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(74, 52, 17, 0.6) 0%, rgba(28, 20, 8, 0.88) 60%, rgba(10, 8, 4, 0.96) 100%)',
      subtitle: 'Noite estrelada sobre as chapadas do cerrado'
    }
  },
  {
    id: 'caatinga',
    name: 'Caatinga',
    color: '#DEC27D',
    accentColor: '#fde047',
    description: 'Bioma exclusivamente brasileiro com espécies adaptadas ao clima semiárido.',
    message: 'Observe a fauna da Caatinga',
    audioSrc: 'assets/audio/caatinga.mp3',
    atmosphereDay: {
      accent: '#DEC27D',
      badgeColor: 'rgba(189, 158, 88, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(222, 194, 125, 0.38) 0%, rgba(175, 142, 73, 0.6) 60%, rgba(85, 62, 18, 0.85) 100%)',
      subtitle: 'Tons ocres e vegetação adaptada à seca'
    },
    atmosphereNight: {
      accent: '#fde047',
      badgeColor: 'rgba(102, 79, 31, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(82, 62, 23, 0.58) 0%, rgba(32, 24, 10, 0.88) 60%, rgba(12, 10, 6, 0.96) 100%)',
      subtitle: 'Noite fresca e serena no sertão semiárido'
    }
  },
  {
    id: 'mata-atlantica',
    name: 'Mata Atlântica',
    color: '#278568',
    accentColor: '#2dd4bf',
    description: 'Riquíssima em endemismo, estendendo-se ao longo da faixa litorânea.',
    message: 'Observe a fauna da Mata Atlântica',
    audioSrc: 'assets/audio/mata-atlantica.mp3',
    atmosphereDay: {
      accent: '#278568',
      badgeColor: 'rgba(39, 133, 104, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(39, 133, 104, 0.38) 0%, rgba(22, 90, 69, 0.65) 60%, rgba(10, 48, 36, 0.85) 100%)',
      subtitle: 'Verdes intensos e vegetação exuberante de encosta'
    },
    atmosphereNight: {
      accent: '#2dd4bf',
      badgeColor: 'rgba(20, 75, 58, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(18, 65, 50, 0.6) 0%, rgba(8, 32, 24, 0.88) 60%, rgba(3, 15, 11, 0.96) 100%)',
      subtitle: 'Bruma noturna e orvalho nas florestas da serra'
    }
  },
  {
    id: 'pantanal',
    name: 'Pantanal',
    color: '#4F8C88',
    accentColor: '#38bdf8',
    description: 'Maior planície inundável contínua do mundo com concentração expressiva de fauna.',
    message: 'Observe a fauna do Pantanal',
    audioSrc: 'assets/audio/pantanal.mp3',
    atmosphereDay: {
      accent: '#4F8C88',
      badgeColor: 'rgba(65, 126, 122, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(79, 140, 136, 0.4) 0%, rgba(42, 95, 92, 0.65) 60%, rgba(18, 54, 52, 0.85) 100%)',
      subtitle: 'Tons naturais de água, reflexos e várzeas alagadas'
    },
    atmosphereNight: {
      accent: '#38bdf8',
      badgeColor: 'rgba(28, 70, 68, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(26, 75, 78, 0.6) 0%, rgba(9, 36, 40, 0.88) 60%, rgba(4, 16, 20, 0.96) 100%)',
      subtitle: 'Águas noturnas sob o luar das lagoas pantaneiras'
    }
  },
  {
    id: 'pampa',
    name: 'Pampa',
    color: '#91A68A',
    accentColor: '#a3e635',
    description: 'Campos naturais e vegetação campestre característica do sul do país.',
    message: 'Observe a fauna do Pampa',
    audioSrc: 'assets/audio/pampa.mp3',
    atmosphereDay: {
      accent: '#91A68A',
      badgeColor: 'rgba(125, 148, 118, 0.92)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(145, 166, 138, 0.38) 0%, rgba(98, 120, 92, 0.6) 60%, rgba(45, 60, 42, 0.85) 100%)',
      subtitle: 'Campos abertos, gramíneas e horizontes suaves'
    },
    atmosphereNight: {
      accent: '#a3e635',
      badgeColor: 'rgba(60, 78, 56, 0.95)',
      ambientGradient: 'radial-gradient(circle at 50% 25%, rgba(46, 62, 43, 0.58) 0%, rgba(19, 28, 18, 0.88) 60%, rgba(8, 14, 8, 0.96) 100%)',
      subtitle: 'Vasto céu estrelado sobre as coxilhas do sul'
    }
  }
];

export const BIOME_MAP_SOURCE = 'assets/biomes/biomas_brasil_ibge_2025.svg';
