/**
 * Raindrop MCP Integration Service
 * 
 * This service integrates with Raindrop's SmartComponents:
 * - SmartSQL: Structured data storage (users, personas, products, sessions, feedback)
 * - SmartMemory: Natural language persona summaries
 * - SmartBuckets: Product catalog storage
 * - SmartInference: AI agent logic for parsing, ranking, and updates
 */

import { PersonaPreferences, PersonaMemory, Product, ParsedRequest, RecommendationResult } from '../types';

class RaindropService {
  private apiKey: string;
  private projectId: string;

  constructor() {
    this.apiKey = process.env.RAINDROP_API_KEY || 'demo_key';
    this.projectId = process.env.RAINDROP_PROJECT_ID || 'demo_project';
  }

  /**
   * SmartMemory: Store/retrieve user persona summary
   */
  async storePersonaMemory(userId: string, summary: string): Promise<void> {
    console.log(`[Raindrop SmartMemory] Storing persona for user ${userId}`);
    // In production, this would call Raindrop SmartMemory API
    // For demo, we're simulating the storage
    const memory: PersonaMemory = {
      userId,
      summary,
      updatedAt: new Date()
    };
    // TODO: Implement actual Raindrop SmartMemory API call
    console.log(`Stored memory: ${summary}`);
  }

  async getPersonaMemory(userId: string): Promise<string | null> {
    console.log(`[Raindrop SmartMemory] Retrieving persona for user ${userId}`);
    // In production, this would call Raindrop SmartMemory API
    // For demo, we return a default
    return null;
  }

  /**
   * SmartInference: Parse shopping request
   * Flow 1: Extract structured requirements from natural language
   */
  async parseShoppingRequest(
    queryText: string,
    personaPreferences: PersonaPreferences,
    personaSummary?: string
  ): Promise<ParsedRequest> {
    console.log(`[Raindrop SmartInference] Parsing request: "${queryText}"`);
    
    // Simulate AI parsing (in production, this would use Raindrop SmartInference)
    const parsed: ParsedRequest = {
      category: this.extractCategory(queryText),
      constraints: {
        maxPrice: this.extractPrice(queryText),
        features: this.extractFeatures(queryText)
      },
      implicitPreferences: {
        noiseLevel: queryText.toLowerCase().includes('quiet') ? 'low' : undefined,
        wireless: queryText.toLowerCase().includes('wireless') ? true : undefined,
        useCase: queryText.toLowerCase().includes('work') || queryText.toLowerCase().includes('office') ? 'office' : undefined
      }
    };

    console.log(`[Raindrop SmartInference] Parsed:`, JSON.stringify(parsed, null, 2));
    return parsed;
  }

  /**
   * SmartInference: Rank products based on persona
   * Flow 2: Score and explain recommendations
   */
  async rankProducts(
    products: Product[],
    personaPreferences: PersonaPreferences,
    parsedRequest: ParsedRequest,
    personaSummary?: string
  ): Promise<RecommendationResult[]> {
    console.log(`[Raindrop SmartInference] Ranking ${products.length} products`);

    const scoredProducts = products.map(product => {
      let score = 100;
      const reasons: string[] = [];
      
      // Price scoring
      if (personaPreferences.priceSensitivity === 'high') {
        score -= (product.price / 10); // Penalize higher prices
        if (product.price < 100) {
          reasons.push('budget-friendly');
        }
      } else if (personaPreferences.priceSensitivity === 'low') {
        score += (product.price / 20); // Reward quality indicators
      }

      // Constraint matching
      if (parsedRequest.constraints.maxPrice && product.price > parsedRequest.constraints.maxPrice) {
        score -= 50;
        reasons.push('exceeds budget');
      }

      // Feature matching
      if (parsedRequest.implicitPreferences.noiseLevel === 'low') {
        if (product.attributes.noise_level === 'very-quiet') {
          score += 20;
          reasons.push('very quiet');
        } else if (product.attributes.noise_level === 'medium-quiet') {
          score += 10;
          reasons.push('reasonably quiet');
        }
      }

      if (parsedRequest.implicitPreferences.wireless && product.attributes.wireless) {
        score += 15;
        reasons.push('wireless');
      }

      // Sustainability preference
      if (personaPreferences.sustainabilityPriority > 0.7 && product.attributes.eco_score > 0.7) {
        score += 15;
        reasons.push('eco-friendly');
      }

      // Style matching
      const styleMatch = personaPreferences.styleTags.some(tag => 
        product.attributes.style?.toLowerCase().includes(tag.toLowerCase())
      );
      if (styleMatch) {
        score += 10;
        reasons.push('matches your style');
      }

      // Generate explanation
      const explanation = this.generateExplanation(product, reasons, personaPreferences);
      const whyForYou = this.generateWhyForYou(product, personaPreferences, reasons);

      return {
        product,
        score,
        explanation,
        whyForYou
      };
    });

    // Sort by score and return top results
    const ranked = scoredProducts.sort((a, b) => b.score - a.score);
    console.log(`[Raindrop SmartInference] Top product: ${ranked[0]?.product.name} (score: ${ranked[0]?.score})`);
    
    return ranked;
  }

  /**
   * SmartInference: Update persona from feedback
   * Flow 3: Learn from user feedback
   */
  async updatePersonaFromFeedback(
    personaPreferences: PersonaPreferences,
    feedbackItems: Array<{
      product: Product;
      likeDislike: 1 | -1;
      reasonTag: string;
    }>
  ): Promise<{ preferences: PersonaPreferences; summary: string }> {
    console.log(`[Raindrop SmartInference] Updating persona from ${feedbackItems.length} feedback items`);

    const updatedPreferences = { ...personaPreferences };
    const learnings: string[] = [];

    feedbackItems.forEach(item => {
      const { product, likeDislike, reasonTag } = item;

      if (reasonTag === 'too_expensive' && likeDislike === -1) {
        if (updatedPreferences.priceSensitivity === 'medium') {
          updatedPreferences.priceSensitivity = 'high';
          learnings.push('I\'ll prioritize more budget-friendly options');
        }
      }

      if (reasonTag === 'ugly' || reasonTag === 'dont_like_look') {
        if (product.attributes.style && likeDislike === -1) {
          const styleToAvoid = product.attributes.style;
          learnings.push(`I'll avoid ${styleToAvoid} styles`);
        }
      }

      if (reasonTag === 'brand_preference') {
        if (likeDislike === 1) {
          updatedPreferences.brandLoyalty = Math.min(1, updatedPreferences.brandLoyalty + 0.1);
          learnings.push(`I've noted you prefer ${product.brand}`);
        }
      }

      if (reasonTag === 'love_sustainability' && likeDislike === 1) {
        updatedPreferences.sustainabilityPriority = Math.min(1, updatedPreferences.sustainabilityPriority + 0.2);
        learnings.push('I\'ll prioritize eco-friendly products');
      }

      if (reasonTag === 'too_loud' && likeDislike === -1) {
        learnings.push('I\'ll focus on quieter options');
      }
    });

    // Generate updated summary
    const summary = this.generatePersonaSummary(updatedPreferences, learnings);

    console.log(`[Raindrop SmartInference] Updated persona summary: ${summary}`);
    return { preferences: updatedPreferences, summary };
  }

  // Helper methods
  private extractCategory(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('keyboard')) return 'keyboards';
    if (lowerQuery.includes('chair')) return 'chairs';
    if (lowerQuery.includes('monitor') || lowerQuery.includes('screen')) return 'monitors';
    if (lowerQuery.includes('desk')) return 'desks';
    if (lowerQuery.includes('mouse')) return 'mice';
    return 'general';
  }

  private extractPrice(query: string): number | undefined {
    const match = query.match(/under\s+\$?(\d+)/i);
    if (match) return parseInt(match[1]);
    
    const match2 = query.match(/\$?(\d+)\s+or\s+less/i);
    if (match2) return parseInt(match2[1]);
    
    return undefined;
  }

  private extractFeatures(query: string): string[] {
    const features: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('quiet')) features.push('quiet');
    if (lowerQuery.includes('wireless')) features.push('wireless');
    if (lowerQuery.includes('mechanical')) features.push('mechanical');
    if (lowerQuery.includes('ergonomic')) features.push('ergonomic');
    if (lowerQuery.includes('rgb')) features.push('rgb');
    if (lowerQuery.includes('compact')) features.push('compact');
    
    return features;
  }

  private generateExplanation(product: Product, reasons: string[], preferences: PersonaPreferences): string {
    const pros: string[] = [];
    const cons: string[] = [];

    // Build pros
    if (reasons.includes('budget-friendly')) pros.push('Great value for money');
    if (reasons.includes('very quiet')) pros.push('Extremely quiet for office use');
    if (reasons.includes('reasonably quiet')) pros.push('Quiet enough for shared spaces');
    if (reasons.includes('wireless')) pros.push('Wireless freedom');
    if (reasons.includes('eco-friendly')) pros.push('Environmentally responsible');
    if (reasons.includes('matches your style')) pros.push('Fits your aesthetic preferences');

    // Build cons
    if (reasons.includes('exceeds budget')) cons.push('Above your stated budget');
    if (!product.attributes.wireless && preferences.styleTags.includes('wireless')) {
      cons.push('Wired connection required');
    }

    let explanation = '';
    if (pros.length > 0) {
      explanation += `**Pros:** ${pros.join(', ')}. `;
    }
    if (cons.length > 0) {
      explanation += `**Cons:** ${cons.join(', ')}.`;
    }

    return explanation || 'Solid option for your needs.';
  }

  private generateWhyForYou(product: Product, preferences: PersonaPreferences, reasons: string[]): string {
    const personalizations: string[] = [];

    if (preferences.priceSensitivity === 'high' && product.price < 100) {
      personalizations.push('fits your budget-conscious approach');
    }

    if (preferences.sustainabilityPriority > 0.7 && product.attributes.eco_score > 0.7) {
      personalizations.push('matches your sustainability values');
    }

    if (preferences.styleTags.some(tag => product.attributes.style?.includes(tag))) {
      personalizations.push(`aligns with your ${preferences.styleTags.join(', ')} style`);
    }

    if (preferences.qualityPriority > 0.7 && product.price > 200) {
      personalizations.push('emphasizes quality over price');
    }

    return personalizations.length > 0
      ? `This ${personalizations.join(' and ')}.`
      : 'Based on your preferences, this is a solid match.';
  }

  private generatePersonaSummary(preferences: PersonaPreferences, learnings: string[]): string {
    const parts: string[] = [];

    if (preferences.priceSensitivity === 'high') {
      parts.push('highly price-sensitive');
    } else if (preferences.priceSensitivity === 'low') {
      parts.push('willing to invest in quality');
    }

    if (preferences.sustainabilityPriority > 0.7) {
      parts.push('prioritizes eco-friendly options');
    }

    if (preferences.styleTags.length > 0) {
      parts.push(`prefers ${preferences.styleTags.join(', ')} style`);
    }

    if (preferences.qualityPriority > 0.7) {
      parts.push('values quality over price');
    }

    let summary = `User is ${parts.join(', ')}.`;
    
    if (learnings.length > 0) {
      summary += ` Recent learnings: ${learnings.join('; ')}.`;
    }

    return summary;
  }
}

export default new RaindropService();
