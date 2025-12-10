/**
 * PersonaShop Backend API
 * 
 * Hosted on Vultr for reliable, scalable infrastructure
 * Integrates with Raindrop SmartComponents for AI-powered personalization
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personaRoutes from './routes/personaRoutes';
import shopRoutes from './routes/shopRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    message: 'PersonaShop API is running',
    infrastructure: 'Hosted on Vultr',
    ai_powered_by: 'Raindrop MCP (SmartSQL, SmartMemory, SmartInference)'
  });
});

// Routes
app.use('/api/persona', personaRoutes);
app.use('/api/shop', shopRoutes);

// For Merchants - B2B information endpoint
app.get('/api/merchant/info', (req: Request, res: Response) => {
  res.json({
    title: 'PersonaShop for Merchants',
    description: 'White-label AI shopping assistant that increases conversion and AOV',
    features: [
      'Deep customer personalization',
      'Cross-product recommendations',
      'Learning from customer feedback',
      'Easy integration via API or widget'
    ],
    integration: {
      widget: 'Embed our shopping assistant widget on your site',
      api: 'Use our REST API for custom integrations',
      endpoints: [
        'POST /api/recommendations - Get personalized recommendations',
        'POST /api/feedback - Collect customer feedback',
        'GET /api/analytics - View conversion metrics'
      ]
    },
    pricing: 'Contact us for volume pricing and revenue sharing options',
    demo: 'Try our merchant demo at /merchant-demo'
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                     PersonaShop API                       ║
║═══════════════════════════════════════════════════════════║
║  Status: Running on port ${PORT}                           ║
║  Infrastructure: Vultr Cloud                              ║
║  AI Engine: Raindrop MCP                                  ║
║    - SmartSQL: User & product data                        ║
║    - SmartMemory: Persona summaries                       ║
║    - SmartInference: AI agent logic                       ║
║    - SmartBuckets: Product catalogs                       ║
║                                                           ║
║  Health check: http://localhost:${PORT}/health             ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
