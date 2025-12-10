export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface PersonaPreferences {
  userId: string;
  priceSensitivity: 'low' | 'medium' | 'high'; // low = very price-sensitive
  brandLoyalty: number; // 0-1
  qualityPriority: number; // 0-1
  sustainabilityPriority: number; // 0-1
  shippingSpeedPriority: number; // 0-1
  styleTags: string[];
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image_url: string;
  attributes: Record<string, any>;
  source_store: string;
  url: string;
}

export interface Session {
  id: string;
  userId: string;
  queryText: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  sessionId: string;
  userId: string;
  productId: string;
  likeDislike: 1 | -1;
  reasonTag: string;
  createdAt: Date;
}

export interface RecommendationResult {
  product: Product;
  score: number;
  explanation: string;
  whyForYou: string;
}

export interface ParsedRequest {
  category: string;
  constraints: {
    maxPrice?: number;
    minPrice?: number;
    features: string[];
  };
  implicitPreferences: Record<string, any>;
}

// Raindrop SmartMemory structure
export interface PersonaMemory {
  userId: string;
  summary: string;
  updatedAt: Date;
}
