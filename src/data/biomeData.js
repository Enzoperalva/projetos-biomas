/**
 * Definições dos seis biomas brasileiros e dados de identificação
 * correspondentes à base cartográfica oficial do IBGE 2025
 * (public/assets/biomes/biomas_brasil_ibge_2025.svg).
 */

export const BIOMES = [
  {
    id: 'amazonia',
    name: 'Amazônia',
    color: '#24553D',
    description: 'Maior floresta tropical úmida do planeta e maior bacia hidrográfica.',
    message: 'Observe a fauna da Amazônia'
  },
  {
    id: 'cerrado',
    name: 'Cerrado',
    color: '#C29A4B',
    description: 'Savana de alta biodiversidade e berço das principais bacias hídricas.',
    message: 'Observe a fauna do Cerrado'
  },
  {
    id: 'caatinga',
    name: 'Caatinga',
    color: '#DEC27D',
    description: 'Bioma exclusivamente brasileiro com espécies adaptadas ao clima semiárido.',
    message: 'Observe a fauna da Caatinga'
  },
  {
    id: 'mata-atlantica',
    name: 'Mata Atlântica',
    color: '#278568',
    description: 'Riquíssima em endemismo, estendendo-se ao longo da faixa litorânea.',
    message: 'Observe a fauna da Mata Atlântica'
  },
  {
    id: 'pantanal',
    name: 'Pantanal',
    color: '#4F8C88',
    description: 'Maior planície inundável contínua do mundo com concentração expressiva de fauna.',
    message: 'Observe a fauna do Pantanal'
  },
  {
    id: 'pampa',
    name: 'Pampa',
    color: '#91A68A',
    description: 'Campos naturais e vegetação campestre característica do sul do país.',
    message: 'Observe a fauna do Pampa'
  }
];

export const BIOME_MAP_SOURCE = 'assets/biomes/biomas_brasil_ibge_2025.svg';
