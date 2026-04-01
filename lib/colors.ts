export interface CarColor {
  name: string;
  hex: string;
  description: string;
}

export const CAR_COLORS: CarColor[] = [
  { name: "Midnight Black", hex: "#0a0a0a", description: "Deep jet black with subtle depth" },
  { name: "Pearl White", hex: "#f5f5f0", description: "Lustrous white with pearl finish" },
  { name: "Racing Red", hex: "#cc0000", description: "Bold, vibrant red" },
  { name: "Deep Blue", hex: "#1a237e", description: "Rich, deep navy blue" },
  { name: "Forest Green", hex: "#2d5a27", description: "Natural deep forest green" },
  { name: "Silver Metallic", hex: "#a8a9ad", description: "Classic metallic silver" },
  { name: "Burgundy", hex: "#800020", description: "Deep wine red" },
  { name: "Champagne Gold", hex: "#c5a028", description: "Warm champagne gold" },
  { name: "Matte Gray", hex: "#6b6b6b", description: "Flat matte gray finish" },
  { name: "Electric Blue", hex: "#0066ff", description: "Vivid electric blue" },
  { name: "Sunset Orange", hex: "#ff6600", description: "Warm sunset orange" },
  { name: "British Racing Green", hex: "#004225", description: "Classic British Racing Green" },
];
