# Technology Partners & Sponsors

PersonaShop is built with cutting-edge technology from industry-leading partners.

---

## 🧠 Raindrop (LiquidMetal.ai) - AI Engine

**Role**: Core AI personalization and data management

### What We Use

#### 1. SmartSQL
- **Purpose**: Structured database for users, personas, products, sessions, feedback
- **Documentation**: https://docs.liquidmetal.ai/reference/smartsql/
- **Why**: Managed PostgreSQL-compatible database with AI-optimized queries
- **Usage in PersonaShop**:
  - User account management
  - Persona preference storage
  - Product catalog
  - Session tracking
  - Feedback history

#### 2. SmartMemory
- **Purpose**: Natural language memory storage for evolving user personas
- **Documentation**: https://docs.liquidmetal.ai/reference/smartmemory/
- **Why**: Persistent, searchable memory that grows with user interactions
- **Usage in PersonaShop**:
  - Store persona summaries ("User is budget-conscious, prefers minimalist style")
  - Retrieve context for future sessions
  - Track preference evolution over time

#### 3. SmartBucket
- **Purpose**: File storage for product catalogs and media
- **Documentation**: https://docs.liquidmetal.ai/reference/smartbucket/
- **Why**: Scalable object storage integrated with AI workflows
- **Usage in PersonaShop**:
  - Product catalog JSON files
  - Product images and media
  - Batch data imports

#### 4. SmartInference (Planned)
- **Purpose**: AI agent orchestration for complex reasoning
- **Why**: Multi-step agent workflows with tool usage
- **Planned Usage**:
  - Parse natural language shopping requests
  - Rank products using persona context
  - Generate personalized explanations
  - Learn from user feedback

### Integration Status
- ✅ **Current**: Fully functional simulated integration
- 🔄 **Next**: Connect to actual Raindrop SmartSQL, SmartMemory, SmartBucket APIs
- 📋 **Future**: Leverage SmartInference for advanced AI workflows

See `RAINDROP_INTEGRATION.md` for detailed integration guide.

---

## 🌩️ Vultr - Cloud Infrastructure

**Role**: Backend hosting and compute

### What We Use
- **Compute Instances**: Backend API servers running Node.js/Express
- **Why Vultr**:
  - Cost-effective pricing
  - Global data centers
  - Simple deployment
  - Reliable uptime

### Our Configuration
- **Development**: 2 vCPU, 4GB RAM, Ubuntu 22.04
- **Production**: 4 vCPU, 8GB RAM, Ubuntu 22.04
- **Estimated Cost**: $24-96/month depending on scale

### Services Used
- Compute instances for API
- Block storage for persistent data
- Networking/firewall
- Monitoring dashboard

### Integration
- API runs on Vultr instances
- Connects to Raindrop for data/AI
- Serves requests from Cloudflare-hosted frontend

---

## ⚡ Cloudflare - Frontend CDN

**Role**: Frontend hosting and content delivery

### What We Use
- **Cloudflare Pages**: Next.js app hosting with automatic deployments
- **Why Cloudflare**:
  - Global edge network
  - Instant cache invalidation
  - Built-in DDoS protection
  - Zero-config SSL

### Features Used
- Static site hosting (Next.js)
- Git integration (auto-deploy on push)
- Custom domains
- Analytics
- Web Application Firewall (WAF)

### Integration
- Frontend built with Next.js
- Deployed to Cloudflare Pages
- Makes API calls to Vultr-hosted backend
- Serves globally with low latency

---

## 💳 Stripe - Payment Processing

**Role**: Merchant billing and affiliate tracking

### What We Use
- **Checkout**: Merchant subscription payments
- **Why Stripe**:
  - Developer-friendly API
  - Comprehensive documentation
  - Supports subscriptions
  - Global payment methods

### Features Used (Planned)
- Subscription billing for merchant tiers
- Webhook notifications
- Customer portal
- Revenue analytics

### Pricing Tiers
- **Starter**: $99/month
- **Professional**: $299/month
- **Enterprise**: Custom pricing

### Integration Status
- 📋 **Current**: Mockup in merchant page UI
- 🔄 **Next**: Implement actual Stripe checkout
- 📋 **Future**: Revenue sharing calculations

---

## 🔍 Searchable.com - Product Intelligence

**Role**: Product review indexing and search

### What We Use (Planned)
- **Search API**: Index and search product reviews
- **Why Searchable**:
  - AI-powered semantic search
  - Easy integration
  - Scales with content

### Planned Features
- Index product reviews and descriptions
- Semantic search across reviews
- Extract pros/cons from reviews
- Sentiment analysis

### Integration Status
- 📋 **Planned**: Future enhancement
- Use case: Enhance product recommendations with review insights

---

## 🎨 Additional Technologies

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **UUID**: Unique identifiers

### Development
- **Git/GitHub**: Version control
- **npm**: Package management
- **nodemon**: Development hot-reload
- **ts-node**: TypeScript execution

---

## 📊 Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓ HTTPS
┌─────────────────────┐
│  Cloudflare Pages   │  (Frontend)
│   - Next.js App     │
│   - Static Assets   │
└──────┬──────────────┘
       │
       ↓ API Calls
┌─────────────────────┐
│  Vultr Compute      │  (Backend)
│   - Express API     │
│   - Business Logic  │
└──────┬──────────────┘
       │
       ↓ Data/AI Calls
┌─────────────────────┐
│  Raindrop MCP       │  (Data & AI)
│   - SmartSQL        │
│   - SmartMemory     │
│   - SmartBucket     │
│   - SmartInference  │
└─────────────────────┘
```

---

## 💰 Cost Breakdown

### Monthly Operating Costs (Estimated)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Raindrop MCP | Starter | $49 |
| Vultr Compute | 4 vCPU, 8GB | $24 |
| Cloudflare Pages | Free | $0 |
| Domain | .com | $1 (annual/12) |
| **Total** | | **~$74/mo** |

### At Scale (10K+ users)
| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Raindrop MCP | Professional | $199 |
| Vultr Compute | 8 vCPU, 16GB | $96 |
| Cloudflare Pages | Pro | $20 |
| Stripe | (2.9% + $0.30) | Variable |
| **Total** | | **~$315/mo + txn fees** |

---

## 🔗 Quick Links

### Documentation
- **Raindrop SmartSQL**: https://docs.liquidmetal.ai/reference/smartsql/
- **Raindrop SmartMemory**: https://docs.liquidmetal.ai/reference/smartmemory/
- **Raindrop SmartBucket**: https://docs.liquidmetal.ai/reference/smartbucket/
- **Vultr Docs**: https://www.vultr.com/docs/
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Stripe API**: https://stripe.com/docs/api

### Dashboards
- **Raindrop**: https://liquidmetal.ai/dashboard
- **Vultr**: https://my.vultr.com/
- **Cloudflare**: https://dash.cloudflare.com/
- **Stripe**: https://dashboard.stripe.com/

---

## 🙏 Acknowledgments

Special thanks to all our technology partners for providing the infrastructure and tools that make PersonaShop possible:

- **Raindrop Team** for innovative AI infrastructure
- **Vultr** for reliable cloud hosting
- **Cloudflare** for global content delivery
- **Stripe** for payment processing
- **Searchable.com** for content intelligence

---

## 📞 Partner Support

### Raindrop
- Documentation: https://docs.liquidmetal.ai/
- Support: Check their website for contact

### Vultr
- Support: https://www.vultr.com/support/
- Community: https://www.vultr.com/community/

### Cloudflare
- Support: https://support.cloudflare.com/
- Community: https://community.cloudflare.com/

### Stripe
- Support: https://support.stripe.com/
- Documentation: https://stripe.com/docs

---

**PersonaShop** - Powered by the best technology partners in the industry.
