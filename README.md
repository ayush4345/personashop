# PersonaShop 🛍️

**An AI Shopping Copilot that deeply learns your tastes and constraints over time, then scouts the web to build you the best, personalized shopping options with full explanations and comparisons.**

![PersonaShop Banner](https://img.shields.io/badge/AI-Shopping_Copilot-purple?style=for-the-badge) ![Raindrop MCP](https://img.shields.io/badge/Powered_by-Raindrop_MCP-blue?style=for-the-badge) ![Vultr](https://img.shields.io/badge/Hosted_on-Vultr-blueviolet?style=for-the-badge)

---

## 🎯 One-Liner

PersonaShop is an AI shopping copilot that deeply learns your tastes and constraints over time, then scouts the web to build you the best, personalized shopping options with full explanations and comparisons.

---

## ✨ Key Features

### For Shoppers
- **🧠 Smart Persona Creation**: Quick quiz captures your budget, priorities, and style
- **💡 Implicit Learning**: System learns from your feedback ("I hate subscriptions", "too expensive")
- **🎯 Personalized Recommendations**: Not just generic popularity - ranked for YOU
- **📊 Bundle Comparisons**: Get 2-3 options with detailed tradeoff explanations
- **🔄 Interactive Refinement**: Like/dislike feedback instantly updates your persona
- **💾 Persistent Memory**: Returns weeks later and remembers your preferences

### For Merchants
- **🔌 Easy Integration**: Widget or API integration in minutes
- **📈 Higher Conversion**: Deep personalization reduces decision fatigue
- **💰 Increased AOV**: Smart bundling and upsells based on customer preferences
- **🧪 No AI Infrastructure Needed**: White-label solution, fully managed
- **📊 Behavioral Insights**: Understand why customers pick certain bundles

---

## 🏗️ Architecture

PersonaShop leverages best-in-class technology partners:

### **🧠 Raindrop MCP** (AI Engine)
- **SmartSQL**: Structured data storage (users, personas, products, sessions, feedback)
- **SmartMemory**: Natural language persona summaries that evolve over time
- **SmartBuckets**: Product catalog storage and management
- **SmartInference**: Multi-step AI agent logic for parsing, ranking, and learning

### **🌩️ Vultr** (Infrastructure)
- Backend API hosting with reliable, scalable cloud infrastructure
- Background jobs for product feed ingestion and updates
- Low-latency global deployment

### **⚡ Cloudflare** (Frontend CDN)
- Global edge network for instant page loads
- DDoS protection and security
- Fast static asset delivery

### **💳 Stripe** (Business Model)
- Simulated merchant revenue calculations
- Affiliate commission tracking
- Payment processing for premium features

### **🔍 Searchable.com** (Content Intelligence)
- Index long-form product reviews
- AI-powered pros/cons summarization
- Semantic search across product content

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ayush4345/personashop.git
cd personashop
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Raindrop credentials (optional for demo)
npm run dev
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## 🎮 How to Use

### 1. Create Your Persona
- Enter your name and email
- Select your budget comfort zone (Budget/Moderate/Premium)
- Choose priorities (Price, Quality, Brand, Sustainability, Shipping)
- Describe your style (optional)

### 2. Start Shopping
- Enter what you're looking for in natural language
  - Example: "I want a quiet mechanical keyboard under $100 for work"
- Get 3 personalized recommendations with explanations

### 3. Provide Feedback
- 👍 Love it / 💰 Too expensive / 😕 Don't like the look
- 🏷️ Love this brand / 🌱 Eco-friendly
- Watch your persona learn and adapt in real-time!

### 4. Return Anytime
- Your preferences are saved
- Each session improves recommendations
- System remembers what you like and don't like

---

## 💼 Business Model

PersonaShop is designed as a viable business with multiple revenue streams:

### 1. **Affiliate/Referral Commissions** (Short-term)
- Earn commission when users purchase through partner stores
- Differentiation: Deep persona + cross-store bundles
- Not just "cheapest" but "best for your values & constraints"

### 2. **White-Label B2B for Merchants** (Medium-term)
- Merchants embed PersonaShop as a widget on their sites
- Increases conversion and AOV
- Subscription-based pricing ($99-$299/mo + Enterprise)

### 3. **Premium Subscription** (Long-term)
- Basic persona + results free
- Paid tier: More sources, price-drop tracking, ethical filters
- Target: Power shoppers, parents, streamers, resellers

### 4. **Data Asset** (Strategic)
- Aggregated, anonymized preference patterns
- Understanding *why* shoppers pick certain bundles
- Far more valuable than simple clickstream analytics

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages (production)

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **AI Engine**: Raindrop MCP
- **Deployment**: Vultr Cloud (production)

### Data & AI
- **Structured Data**: Raindrop SmartSQL
- **Persona Memory**: Raindrop SmartMemory
- **Product Catalogs**: Raindrop SmartBuckets
- **Agent Logic**: Raindrop SmartInference

---

## 📁 Project Structure

```
personashop/
├── backend/
│   ├── src/
│   │   ├── data/           # Product catalogs (JSON)
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   │   ├── raindropService.ts    # Raindrop MCP integration
│   │   │   └── databaseService.ts    # Data layer (SmartSQL)
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Persona creation (homepage)
│   │   ├── shop/
│   │   │   └── page.tsx    # Shopping interface
│   │   └── merchant/
│   │       └── page.tsx    # Merchant landing page
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

---

## 🔌 API Endpoints

### Persona Management
- `POST /api/persona/init` - Create user persona from quiz
- `GET /api/persona/:userId` - Get user persona information

### Shopping
- `POST /api/shop` - Start shopping session, get recommendations
- `POST /api/shop/feedback` - Submit feedback, update persona

### Merchant Information
- `GET /api/merchant/info` - B2B integration details

### Health
- `GET /health` - API health check

---

## 🎯 Hackathon Alignment

### Best Agentic Retail Experience ✅
- **Multi-step agent behavior**: Parse → Query → Rank → Explain → Learn
- **Feedback loop**: Continuously adapts to user input
- **Memory**: Persists preferences across sessions

### Audience Favourite Potential ✅
- **Universal appeal**: Everyone shops online
- **Visual polish**: Modern, attractive UI
- **"Wow" moment**: Watch it learn your taste in real-time

### Best Overall ✅
- **Clear business model**: Multiple revenue streams
- **Path to revenue**: Affiliate → B2B → Premium
- **Defensibility**: Persistent personas + cross-store optimization
- **Market validation**: Addresses real pain points

---

## 🔮 Future Enhancements

### Short-term (Next Sprint)
- [ ] Real product API integrations (Amazon, Walmart)
- [ ] Price drop tracking and alerts
- [ ] Email notifications for recommendations
- [ ] Social sharing of curated lists

### Medium-term
- [ ] Mobile app (React Native)
- [ ] Voice shopping with natural language
- [ ] Product comparison views
- [ ] Wishlist and saved searches

### Long-term
- [ ] AR try-before-buy integrations
- [ ] Group shopping (family personas)
- [ ] Sustainable/ethical product scoring
- [ ] Local business integration

---

## 🤝 Contributing

This is a hackathon project, but we welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

Built with cutting-edge technology partners:
- **Raindrop MCP** for AI-powered personalization
- **Vultr** for reliable cloud infrastructure  
- **Cloudflare** for global content delivery
- **Stripe** for payment processing
- **Searchable.com** for content intelligence

---

## 📞 Contact

- **Project Repository**: https://github.com/ayush4345/personashop
- **Demo Video**: [Link to be added]
- **Pitch Deck**: [Link to be added]

---

<div align="center">

**Made with ❤️ for shoppers who deserve better recommendations**

[![Raindrop MCP](https://img.shields.io/badge/AI-Raindrop_MCP-blue)](https://raindrop.com)
[![Vultr](https://img.shields.io/badge/Hosted-Vultr-blueviolet)](https://vultr.com)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](https://typescriptlang.org)

</div>
