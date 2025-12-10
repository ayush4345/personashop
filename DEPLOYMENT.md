# PersonaShop Deployment Guide

This guide explains how to deploy PersonaShop to production using our technology partners.

---

## 🌩️ Backend Deployment (Vultr)

### Prerequisites
- Vultr account
- Raindrop MCP credentials
- Node.js 18+ runtime

### Steps

1. **Create a Vultr Compute Instance**
```bash
# Choose Ubuntu 22.04 LTS
# Minimum: 2 vCPU, 4GB RAM
# Recommended: 4 vCPU, 8GB RAM for production
```

2. **SSH into your instance**
```bash
ssh root@your-vultr-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone and setup**
```bash
git clone https://github.com/ayush4345/personashop.git
cd personashop/backend
npm install
```

5. **Configure environment**
```bash
cp .env.example .env
nano .env
# Add your Raindrop MCP credentials
# PORT=3001
# RAINDROP_API_KEY=your_key
# RAINDROP_PROJECT_ID=your_project
```

6. **Build and start**
```bash
npm run build
npm start
# Or use PM2 for process management:
npm install -g pm2
pm2 start dist/index.js --name personashop-api
pm2 save
pm2 startup
```

7. **Setup firewall**
```bash
sudo ufw allow 3001/tcp
sudo ufw enable
```

8. **Configure Nginx reverse proxy** (optional but recommended)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/personashop
```

```nginx
server {
    listen 80;
    server_name api.personashop.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/personashop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ⚡ Frontend Deployment (Cloudflare Pages)

### Prerequisites
- Cloudflare account
- GitHub repository access

### Steps

1. **Update API endpoint in frontend**
```typescript
// frontend/app/page.tsx and frontend/app/shop/page.tsx
// Change: http://localhost:3001
// To: https://api.personashop.com (or your Vultr backend URL)
```

2. **Push to GitHub**
```bash
git add .
git commit -m "Update API endpoint for production"
git push origin main
```

3. **Connect to Cloudflare Pages**
- Go to Cloudflare Dashboard
- Navigate to Pages
- Click "Create a project"
- Connect your GitHub repository

4. **Configure build settings**
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: frontend
Node version: 18
```

5. **Set environment variables**
```
NEXT_PUBLIC_API_URL=https://api.personashop.com
```

6. **Deploy**
- Click "Save and Deploy"
- Wait for build to complete
- Your site will be available at: https://personashop.pages.dev

7. **Custom domain** (optional)
- Add your custom domain in Cloudflare Pages settings
- Update DNS records as instructed

---

## 🧠 Raindrop MCP Setup

### 1. Create Raindrop Project
```bash
# Visit https://liquidmetal.ai
# Create new project: "personashop"
# Note your API key and project ID
# Documentation: https://docs.liquidmetal.ai/reference/smartsql/
```

### 2. Initialize SmartSQL Schema
```sql
-- Run this in Raindrop SmartSQL console
-- Documentation: https://docs.liquidmetal.ai/reference/smartsql/

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE persona_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    price_sensitivity VARCHAR(10),
    brand_loyalty FLOAT,
    quality_priority FLOAT,
    sustainability_priority FLOAT,
    shipping_speed_priority FLOAT,
    style_tags TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10, 2),
    image_url TEXT,
    attributes_json JSONB,
    source_store VARCHAR(100),
    url TEXT
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    query_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feedback (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    like_dislike SMALLINT,
    reason_tag VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Upload Product Catalog to SmartBuckets
```bash
# Use Raindrop CLI or dashboard
# Documentation: https://docs.liquidmetal.ai/reference/smartbucket/
raindrop buckets upload backend/src/data/products.json personashop-products
```

### 4. Configure SmartInference
```bash
# Create inference flows in Raindrop dashboard:
# - Flow 1: Parse shopping requests
# - Flow 2: Rank products
# - Flow 3: Update personas from feedback
```

---

## 💳 Stripe Integration (Optional)

### For Merchant Billing

1. **Create Stripe account**
2. **Get API keys**
```bash
# Add to backend .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

3. **Create products in Stripe**
```bash
# Starter Plan: $99/mo
# Professional Plan: $299/mo
# Enterprise Plan: Custom
```

4. **Implement checkout flow**
```typescript
// backend/src/routes/merchantRoutes.ts
// Add Stripe checkout endpoints
```

---

## 🔍 Searchable.com Integration (Optional)

### For Product Review Indexing

1. **Create Searchable account**
2. **Index product reviews**
```bash
# Add to backend .env
SEARCHABLE_API_KEY=your_key
```

3. **Implement search**
```typescript
// backend/src/services/searchableService.ts
// Query indexed reviews during product ranking
```

---

## 🔒 Security Checklist

- [ ] Enable HTTPS (Let's Encrypt on Vultr)
- [ ] Set secure CORS origins in backend
- [ ] Use environment variables for all secrets
- [ ] Enable Cloudflare WAF
- [ ] Set rate limiting on API endpoints
- [ ] Regular security updates on Vultr instance
- [ ] Enable Vultr firewall rules
- [ ] Use Cloudflare DDoS protection

---

## 📊 Monitoring

### Vultr Monitoring
- Enable Vultr monitoring dashboard
- Set up alerts for:
  - CPU usage > 80%
  - Memory usage > 85%
  - Disk usage > 90%

### Application Monitoring
```bash
# Install monitoring tools
npm install @sentry/node
# Configure in backend/src/index.ts
```

### Logs
```bash
# View logs on Vultr
pm2 logs personashop-api

# Or use log aggregation:
# - Datadog
# - Logtail
# - Better Stack
```

---

## 🔄 CI/CD (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy PersonaShop

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vultr
        run: |
          # SSH into Vultr and pull latest code
          # Restart PM2 process

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloudflare
        run: |
          # Cloudflare Pages auto-deploys on push
```

---

## 💰 Cost Estimates

### Monthly Operating Costs

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vultr Compute | 4 vCPU, 8GB RAM | ~$24 |
| Cloudflare Pages | Free tier | $0 |
| Raindrop MCP | Starter | $49 |
| Domain | .com | ~$12/year |
| **Total** | | **~$74/mo** |

### At Scale (10K users)
- Vultr: $96/mo (8 vCPU, 16GB)
- Raindrop MCP: $199/mo
- Cloudflare: $20/mo (Pro plan)
- **Total: ~$315/mo**

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs personashop-api

# Check environment variables
cat .env

# Test manually
npm run dev
```

### Frontend build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database connection errors
```bash
# Verify Raindrop credentials
# Check network connectivity
# Review Raindrop dashboard for API status
```

---

## 📞 Support

For deployment issues:
- Check GitHub Issues
- Review Vultr documentation
- Contact Raindrop support
- Join Cloudflare community

---

**Ready to deploy? Follow the steps above and your PersonaShop instance will be live in under an hour!** 🚀
