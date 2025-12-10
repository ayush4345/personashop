import { Router, Request, Response } from 'express';
import databaseService from '../services/databaseService';
import raindropService from '../services/raindropService';

const router = Router();

/**
 * POST /api/shop
 * Start a shopping session
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, queryText } = req.body;

    if (!userId || !queryText) {
      return res.status(400).json({ error: 'userId and queryText are required' });
    }

    // Get user and persona
    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const personaPreferences = await databaseService.getPersonaPreferences(userId);
    if (!personaPreferences) {
      return res.status(404).json({ error: 'Persona not found. Please complete the quiz first.' });
    }

    // Create session
    const session = await databaseService.createSession(userId, queryText);

    // Get persona memory
    const personaSummary = await raindropService.getPersonaMemory(userId);

    // Parse request using Raindrop SmartInference
    const parsedRequest = await raindropService.parseShoppingRequest(
      queryText,
      personaPreferences,
      personaSummary || undefined
    );

    // Get candidate products
    const candidates = await databaseService.searchProducts({
      category: parsedRequest.category,
      maxPrice: parsedRequest.constraints.maxPrice
    });

    if (candidates.length === 0) {
      return res.json({
        sessionId: session.id,
        recommendations: [],
        message: 'No products found matching your criteria. Try adjusting your search.'
      });
    }

    // Rank products using Raindrop SmartInference
    const rankedProducts = await raindropService.rankProducts(
      candidates,
      personaPreferences,
      parsedRequest,
      personaSummary || undefined
    );

    // Return top 3 recommendations
    const recommendations = rankedProducts.slice(0, 3);

    // Generate persona context message
    const recentFeedback = await databaseService.getFeedbackByUser(userId, 5);
    let contextMessage = '';
    if (recentFeedback.length > 0) {
      contextMessage = generateContextMessage(personaPreferences, recentFeedback);
    }

    res.json({
      sessionId: session.id,
      recommendations,
      contextMessage
    });
  } catch (error) {
    console.error('Error in shop route:', error);
    res.status(500).json({ error: 'Failed to process shopping request' });
  }
});

/**
 * POST /api/shop/feedback
 * Submit feedback on product recommendations
 */
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { sessionId, userId, productId, likeDislike, reasonTag } = req.body;

    if (!sessionId || !userId || !productId || likeDislike === undefined || !reasonTag) {
      return res.status(400).json({ 
        error: 'sessionId, userId, productId, likeDislike, and reasonTag are required' 
      });
    }

    // Validate session
    const session = await databaseService.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create feedback
    await databaseService.createFeedback(sessionId, userId, productId, likeDislike, reasonTag);

    // Get all feedback for this session
    const sessionFeedback = await databaseService.getFeedbackBySession(sessionId);

    // Get products for feedback items
    const feedbackWithProducts = await Promise.all(
      sessionFeedback.map(async (fb) => {
        const product = await databaseService.getProductById(fb.productId);
        return {
          product: product!,
          likeDislike: fb.likeDislike,
          reasonTag: fb.reasonTag
        };
      })
    );

    // Get current persona
    const currentPersona = await databaseService.getPersonaPreferences(userId);
    if (!currentPersona) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    // Update persona using Raindrop SmartInference
    const { preferences: updatedPreferences, summary: updatedSummary } = 
      await raindropService.updatePersonaFromFeedback(currentPersona, feedbackWithProducts);

    // Save updated persona
    await databaseService.updatePersonaPreferences(userId, updatedPreferences);
    await raindropService.storePersonaMemory(userId, updatedSummary);

    // Get fresh recommendations
    const parsedRequest = await raindropService.parseShoppingRequest(
      session.queryText,
      updatedPreferences,
      updatedSummary
    );

    const candidates = await databaseService.searchProducts({
      category: parsedRequest.category,
      maxPrice: parsedRequest.constraints.maxPrice
    });

    const rankedProducts = await raindropService.rankProducts(
      candidates,
      updatedPreferences,
      parsedRequest,
      updatedSummary
    );

    const recommendations = rankedProducts.slice(0, 3);

    res.json({
      learningMessage: `Got it! ${updatedSummary.split('.').pop()}`,
      recommendations,
      updatedPreferences
    });
  } catch (error) {
    console.error('Error in feedback route:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

function generateContextMessage(preferences: any, recentFeedback: any[]): string {
  const messages: string[] = [];

  if (preferences.priceSensitivity === 'high') {
    messages.push('prioritizing budget-friendly options');
  }

  if (preferences.sustainabilityPriority > 0.7) {
    messages.push('favoring eco-friendly products');
  }

  if (recentFeedback.length > 0) {
    messages.push('learning from your past choices');
  }

  return messages.length > 0 
    ? `Based on your preferences, I'm ${messages.join(' and ')}.`
    : '';
}

export default router;
