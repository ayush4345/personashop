import { Router, Request, Response } from 'express';
import databaseService from '../services/databaseService';
import raindropService from '../services/raindropService';

const router = Router();

/**
 * POST /api/persona/init
 * Initialize user persona from quiz
 */
router.post('/init', async (req: Request, res: Response) => {
  try {
    const { email, name, budgetComfort, priorities, styleDescription } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user exists
    let user = await databaseService.getUserByEmail(email);
    if (!user) {
      user = await databaseService.createUser(email, name);
    }

    // Map quiz inputs to persona preferences
    const priceSensitivity = budgetComfort === 'low' ? 'high' : 
                             budgetComfort === 'high' ? 'low' : 'medium';

    const styleTags = styleDescription ? 
      styleDescription.toLowerCase().split(/[,\s]+/).filter((s: string) => s.length > 0) : 
      [];

    const preferences = await databaseService.createPersonaPreferences(user.id, {
      priceSensitivity,
      brandLoyalty: priorities?.includes('brand') ? 0.7 : 0.3,
      qualityPriority: priorities?.includes('quality') ? 0.8 : 0.5,
      sustainabilityPriority: priorities?.includes('sustainability') ? 0.8 : 0.3,
      shippingSpeedPriority: priorities?.includes('shipping') ? 0.8 : 0.5,
      styleTags
    });

    // Generate initial persona summary and store in SmartMemory
    const summary = generateInitialSummary(preferences);
    await raindropService.storePersonaMemory(user.id, summary);

    res.json({
      user,
      preferences,
      summary
    });
  } catch (error) {
    console.error('Error initializing persona:', error);
    res.status(500).json({ error: 'Failed to initialize persona' });
  }
});

/**
 * GET /api/persona/:userId
 * Get user persona information
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = await databaseService.getPersonaPreferences(userId);
    const summary = await raindropService.getPersonaMemory(userId);

    res.json({
      user,
      preferences,
      summary
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(500).json({ error: 'Failed to fetch persona' });
  }
});

function generateInitialSummary(preferences: any): string {
  const parts: string[] = [];

  if (preferences.priceSensitivity === 'high') {
    parts.push('budget-conscious');
  } else if (preferences.priceSensitivity === 'low') {
    parts.push('quality-focused');
  }

  if (preferences.sustainabilityPriority > 0.7) {
    parts.push('eco-conscious');
  }

  if (preferences.styleTags.length > 0) {
    parts.push(`prefers ${preferences.styleTags.join(', ')} aesthetic`);
  }

  return `User is ${parts.join(', ')}.`;
}

export default router;
