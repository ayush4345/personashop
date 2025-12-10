# Raindrop (LiquidMetal.ai) Integration Guide

This guide explains how to integrate PersonaShop with Raindrop's actual MCP services.

**Official Documentation**:
- SmartSQL: https://docs.liquidmetal.ai/reference/smartsql/
- SmartMemory: https://docs.liquidmetal.ai/reference/smartmemory/
- SmartBucket: https://docs.liquidmetal.ai/reference/smartbucket/

---

## 🧠 Overview

PersonaShop currently includes a **simulated Raindrop integration** that demonstrates the architecture and data flow. To use actual Raindrop MCP services, follow this guide.

### Raindrop Components Used

1. **SmartSQL** - Structured data storage for users, personas, products, sessions, feedback
2. **SmartMemory** - Natural language persona summaries that evolve over time
3. **SmartBuckets** - Product catalog storage and file management
4. **SmartInference** - AI agent logic for parsing requests, ranking products, learning from feedback

---

## 🔧 Current Implementation Status

### ✅ What's Built (Simulated)

The current codebase includes a **complete simulation** of Raindrop MCP integration:

- **File**: `backend/src/services/raindropService.ts`
- **Features**:
  - Request parsing (extract category, price, features from natural language)
  - Product ranking with persona-based scoring
  - Feedback processing and persona updates
  - Memory summary generation

- **File**: `backend/src/services/databaseService.ts`
- **Features**:
  - In-memory storage simulating SmartSQL tables
  - CRUD operations for users, personas, products, sessions, feedback
  - Product search and filtering

### 🔄 What Needs Real Integration

To connect to actual Raindrop MCP services:

1. Replace in-memory storage with SmartSQL API calls
2. Connect SmartMemory for persona summaries
3. Use SmartBuckets for product catalog management
4. Leverage SmartInference for AI-powered operations

---

## 🚀 Integration Steps

### Step 1: Get Raindrop Credentials

1. Visit https://liquidmetal.ai
2. Create an account or log in
3. Create a new project: "PersonaShop"
4. Get your API credentials:
   - API Key
   - Project ID
   - Endpoint URL

5. Add to `backend/.env`:
```bash
RAINDROP_API_KEY=your_api_key_here
RAINDROP_PROJECT_ID=your_project_id_here
RAINDROP_ENDPOINT=https://api.liquidmetal.ai
```

---

### Step 2: Initialize SmartSQL Database

Use Raindrop's SQL interface to create the schema:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Persona preferences
CREATE TABLE IF NOT EXISTS persona_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    price_sensitivity VARCHAR(10) NOT NULL,
    brand_loyalty FLOAT NOT NULL DEFAULT 0.5,
    quality_priority FLOAT NOT NULL DEFAULT 0.5,
    sustainability_priority FLOAT NOT NULL DEFAULT 0.5,
    shipping_speed_priority FLOAT NOT NULL DEFAULT 0.5,
    style_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    attributes_json JSONB,
    source_store VARCHAR(100),
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    like_dislike SMALLINT NOT NULL CHECK (like_dislike IN (-1, 1)),
    reason_tag VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_persona_user ON persona_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_session ON feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
```

---

### Step 3: Install Raindrop SDK

```bash
cd backend
npm install @liquidmetal/sdk
# Or the actual package name from Raindrop docs
```

---

### Step 4: Replace Database Service

Update `backend/src/services/databaseService.ts` to use Raindrop SmartSQL:

```typescript
import { RaindropClient } from '@liquidmetal/sdk';

class DatabaseService {
  private client: RaindropClient;

  constructor() {
    this.client = new RaindropClient({
      apiKey: process.env.RAINDROP_API_KEY!,
      projectId: process.env.RAINDROP_PROJECT_ID!,
      endpoint: process.env.RAINDROP_ENDPOINT!
    });
  }

  async createUser(email: string, name: string): Promise<User> {
    const result = await this.client.sql.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    return result.rows[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.client.sql.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // ... implement other methods similarly
}
```

---

### Step 5: Integrate SmartMemory

Update `backend/src/services/raindropService.ts` to use SmartMemory:

```typescript
import { RaindropClient } from '@liquidmetal/sdk';

class RaindropService {
  private client: RaindropClient;

  constructor() {
    this.client = new RaindropClient({
      apiKey: process.env.RAINDROP_API_KEY!,
      projectId: process.env.RAINDROP_PROJECT_ID!
    });
  }

  async storePersonaMemory(userId: string, summary: string): Promise<void> {
    await this.client.memory.store({
      key: `persona_${userId}`,
      content: summary,
      metadata: {
        userId,
        type: 'persona_summary',
        updatedAt: new Date().toISOString()
      }
    });
  }

  async getPersonaMemory(userId: string): Promise<string | null> {
    const memory = await this.client.memory.retrieve(`persona_${userId}`);
    return memory?.content || null;
  }
}
```

---

### Step 6: Upload Products to SmartBuckets

```typescript
// One-time setup script
import { RaindropClient } from '@liquidmetal/sdk';
import products from './data/products.json';

async function uploadProducts() {
  const client = new RaindropClient({
    apiKey: process.env.RAINDROP_API_KEY!,
    projectId: process.env.RAINDROP_PROJECT_ID!
  });

  // Upload to SmartBuckets
  await client.buckets.upload({
    bucket: 'product-catalog',
    path: 'products.json',
    content: JSON.stringify(products)
  });

  // Also insert into SmartSQL for querying
  for (const category in products) {
    for (const product of products[category]) {
      await client.sql.query(
        `INSERT INTO products (id, name, category, brand, price, image_url, attributes_json, source_store, url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         price = EXCLUDED.price`,
        [
          product.id,
          product.name,
          product.category,
          product.brand,
          product.price,
          product.image_url,
          JSON.stringify(product.attributes),
          product.source_store,
          product.url
        ]
      );
    }
  }
}
```

---

### Step 7: Use SmartInference for AI Operations

Leverage Raindrop's SmartInference for intelligent operations:

```typescript
async parseShoppingRequest(
  queryText: string,
  personaPreferences: PersonaPreferences,
  personaSummary?: string
): Promise<ParsedRequest> {
  const prompt = `
Parse this shopping request into structured data:
"${queryText}"

User persona: ${personaSummary || 'No history'}
Preferences: ${JSON.stringify(personaPreferences)}

Extract:
- category (keyboard, chair, monitor, etc.)
- max price
- features requested
- implicit preferences

Return JSON format.
`;

  const result = await this.client.inference.complete({
    prompt,
    model: 'gpt-4', // Or Raindrop's recommended model
    temperature: 0.3,
    maxTokens: 500,
    responseFormat: 'json'
  });

  return JSON.parse(result.content);
}
```

---

## 📊 Data Migration

To migrate from simulated to real Raindrop:

### 1. Export Current Demo Data
```bash
cd backend
node -e "
const db = require('./dist/services/databaseService').default;
// Export users, personas, etc.
"
```

### 2. Import to Raindrop SmartSQL
```typescript
// migration script
import { RaindropClient } from '@liquidmetal/sdk';

async function migrate() {
  const client = new RaindropClient({...});
  
  // Bulk insert users, personas, products
  // ...
}
```

---

## 🧪 Testing Integration

### Test Connection
```typescript
import { RaindropClient } from '@liquidmetal/sdk';

async function testConnection() {
  const client = new RaindropClient({
    apiKey: process.env.RAINDROP_API_KEY!,
    projectId: process.env.RAINDROP_PROJECT_ID!
  });

  // Test SmartSQL
  const sqlResult = await client.sql.query('SELECT 1 as test');
  console.log('SmartSQL:', sqlResult);

  // Test SmartMemory
  await client.memory.store({
    key: 'test',
    content: 'Hello Raindrop'
  });
  const memory = await client.memory.retrieve('test');
  console.log('SmartMemory:', memory);

  // Test SmartBuckets
  await client.buckets.upload({
    bucket: 'test',
    path: 'test.txt',
    content: 'Hello'
  });
  console.log('SmartBuckets: OK');
}
```

---

## 💡 Best Practices

### 1. Environment Configuration
- Never commit API keys
- Use different credentials for dev/staging/prod
- Rotate keys regularly

### 2. Error Handling
```typescript
try {
  await raindropClient.sql.query(...);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Implement exponential backoff
  } else if (error.code === 'AUTH_FAILED') {
    // Check credentials
  }
  // Log to monitoring service
}
```

### 3. Performance
- Use connection pooling
- Implement caching for frequently accessed data
- Batch operations when possible

### 4. Monitoring
```typescript
// Track Raindrop API usage
const metrics = {
  sqlQueries: 0,
  memoryOperations: 0,
  inferenceTokens: 0
};

// Log and alert on anomalies
```

---

## 🔄 Gradual Migration Strategy

You can migrate incrementally:

### Phase 1: SmartSQL Only
- Replace in-memory storage with SmartSQL
- Keep simulated SmartInference
- Test thoroughly

### Phase 2: Add SmartMemory
- Integrate persona memory storage
- Keep simulated inference

### Phase 3: Full SmartInference
- Replace all AI operations with Raindrop
- Fine-tune prompts and parameters

### Phase 4: SmartBuckets
- Move product catalogs to buckets
- Implement catalog sync

---

## 📚 Additional Resources

- **SmartSQL Docs**: https://docs.liquidmetal.ai/reference/smartsql/
- **SmartMemory Docs**: https://docs.liquidmetal.ai/reference/smartmemory/
- **SmartBucket Docs**: https://docs.liquidmetal.ai/reference/smartbucket/
- **Main Documentation**: https://docs.liquidmetal.ai/

---

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test API endpoint
curl -H "Authorization: Bearer $RAINDROP_API_KEY" \
  https://api.liquidmetal.ai/health
```

### SQL Query Errors
- Check table exists: `\dt` in SmartSQL console
- Verify column names match schema
- Check data types

### Memory Operations
- Ensure keys are unique
- Check memory quota limits
- Verify metadata format

---

## 📞 Support

For Raindrop-specific issues:
- Documentation: https://docs.liquidmetal.ai
- Support: support@liquidmetal.ai
- Discord Community: [Link from their website]

For PersonaShop integration help:
- GitHub Issues: https://github.com/ayush4345/personashop/issues
- Email: [your contact]

---

**Note**: The current PersonaShop implementation works fully with simulated Raindrop services. Integration with actual Raindrop MCP is optional but recommended for production deployment with advanced AI capabilities.
