/**
 * Database Service - Simulates Raindrop SmartSQL
 * 
 * In production, this would connect to Raindrop SmartSQL for:
 * - users table
 * - persona_preferences table
 * - products table
 * - sessions table
 * - feedback table
 */

import { v4 as uuidv4 } from 'uuid';
import { User, PersonaPreferences, Product, Session, Feedback } from '../types';
import productsData from '../data/products.json';

class DatabaseService {
  // In-memory storage (simulating Raindrop SmartSQL)
  private users: Map<string, User> = new Map();
  private personaPreferences: Map<string, PersonaPreferences> = new Map();
  private sessions: Map<string, Session> = new Map();
  private feedback: Map<string, Feedback> = new Map();
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    // Load products from JSON (simulating Raindrop SmartBuckets)
    this.products = [
      ...productsData.keyboards,
      ...productsData.chairs,
      ...productsData.monitors
    ];
    console.log(`[Raindrop SmartSQL] Loaded ${this.products.length} products`);
  }

  // User operations
  async createUser(email: string, name: string): Promise<User> {
    const id = uuidv4();
    const user: User = {
      id,
      email,
      name,
      createdAt: new Date()
    };
    this.users.set(id, user);
    console.log(`[Raindrop SmartSQL] Created user: ${email}`);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  // Persona operations
  async createPersonaPreferences(
    userId: string,
    preferences: Omit<PersonaPreferences, 'userId' | 'updatedAt'>
  ): Promise<PersonaPreferences> {
    const persona: PersonaPreferences = {
      userId,
      ...preferences,
      updatedAt: new Date()
    };
    this.personaPreferences.set(userId, persona);
    console.log(`[Raindrop SmartSQL] Created persona for user: ${userId}`);
    return persona;
  }

  async getPersonaPreferences(userId: string): Promise<PersonaPreferences | null> {
    return this.personaPreferences.get(userId) || null;
  }

  async updatePersonaPreferences(
    userId: string,
    updates: Partial<PersonaPreferences>
  ): Promise<PersonaPreferences | null> {
    const existing = this.personaPreferences.get(userId);
    if (!existing) return null;

    const updated: PersonaPreferences = {
      ...existing,
      ...updates,
      userId,
      updatedAt: new Date()
    };
    this.personaPreferences.set(userId, updated);
    console.log(`[Raindrop SmartSQL] Updated persona for user: ${userId}`);
    return updated;
  }

  // Product operations
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.products;
  }

  async searchProducts(filters: {
    category?: string;
    maxPrice?: number;
    minPrice?: number;
  }): Promise<Product[]> {
    let results = this.products;

    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice);
    }

    return results;
  }

  // Session operations
  async createSession(userId: string, queryText: string): Promise<Session> {
    const id = uuidv4();
    const session: Session = {
      id,
      userId,
      queryText,
      createdAt: new Date()
    };
    this.sessions.set(id, session);
    console.log(`[Raindrop SmartSQL] Created session: ${id}`);
    return session;
  }

  async getSessionById(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  // Feedback operations
  async createFeedback(
    sessionId: string,
    userId: string,
    productId: string,
    likeDislike: 1 | -1,
    reasonTag: string
  ): Promise<Feedback> {
    const id = uuidv4();
    const feedback: Feedback = {
      id,
      sessionId,
      userId,
      productId,
      likeDislike,
      reasonTag,
      createdAt: new Date()
    };
    this.feedback.set(id, feedback);
    console.log(`[Raindrop SmartSQL] Created feedback: ${id}`);
    return feedback;
  }

  async getFeedbackBySession(sessionId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter(
      f => f.sessionId === sessionId
    );
  }

  async getFeedbackByUser(userId: string, limit?: number): Promise<Feedback[]> {
    const userFeedback = Array.from(this.feedback.values())
      .filter(f => f.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userFeedback.slice(0, limit) : userFeedback;
  }
}

export default new DatabaseService();
