export const WHATSAPP_NUMBER = "5561995818169";

export const SIZES = ["PP", "P", "M", "G", "GG", "XG", "XGG", "2XL", "3XL", "4XL"] as const;

export function getSizeSurcharge(size: string): number {
  if (size === "2XL") return 10;
  if (size === "3XL") return 16;
  if (size === "4XL") return 20;
  return 0;
}

export const PERSONALIZATION_PRICE = 20;
export const SPONSORS_PRICE = 35;

export const CATEGORIES = [
  "BRASILEIRAO", "NBA", "NFL", "FÓRMULA 1", "SELEÇÕES",
  "SHORTS", "ACESSÓRIOS", "INFANTIL", "TREINO",
  "ACADEMIA", "COMPRESSÃO", "CAMPEONATOS"
];

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Camisa Seleção Brasileira I 24/25",
    category: "BRASILEIRAO",
    description: "Camisa amarela oficial da seleção brasileira versão torcedor.",
    imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&q=80",
    basePrice: 150,
    price3: 145,
    price5: 140,
    allowPersonalization: true,
    active: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Camisa Real Madrid I 24/25",
    category: "BRASILEIRAO",
    description: "Camisa branca oficial do Real Madrid versão jogador (Heat.RDY).",
    imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    basePrice: 180,
    price3: null,
    price5: null,
    allowPersonalization: true,
    active: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Camisa Flamengo I 81 Retrô",
    category: "BRASILEIRAO",
    description: "Manto sagrado de 81, época de ouro do Mengão.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    basePrice: 180,
    price3: null,
    price5: null,
    allowPersonalization: true,
    active: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Shorts Manchester City I 24/25",
    category: "SHORTS",
    description: "Shorts oficial do Manchester City azul celeste.",
    imageUrl: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80",
    basePrice: 150,
    price3: 145,
    price5: 140,
    allowPersonalization: false,
    active: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Kit Infantil Barcelona I 24/25",
    category: "INFANTIL",
    description: "Conjunto camisa e shorts para os pequenos craques.",
    imageUrl: "https://images.unsplash.com/photo-1518605368461-1e1252220a4c?w=800&q=80",
    basePrice: 180,
    price3: null,
    price5: null,
    allowPersonalization: true,
    active: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Regata Los Angeles Lakers",
    category: "NBA",
    description: "Regata amarela oficial LA Lakers.",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    basePrice: 185,
    price3: null,
    price5: null,
    allowPersonalization: true,
    active: true,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
];
