# 🚀 Deployment Guide

## Pre-Deploy Checklist

### 1. GitHub Repository Setup
- [ ] Push code to GitHub repository
- [ ] Ensure `main` branch is protected
- [ ] Set up branch protection rules

### 2. Vercel Dashboard Configuration

#### Required Secrets (GitHub Repository Settings > Secrets and Variables > Actions):
```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here  
VERCEL_PROJECT_ID=your_project_id_here
```

#### Vercel Environment Variables:
**Production:**
```bash
VITE_APP_URL=https://keygensecrets.com
VITE_NODE_ENV=production
VITE_ANALYTICS_ENABLED=true
```

**Preview:**
```bash
VITE_APP_URL=https://keygensecrets-preview.vercel.app
VITE_NODE_ENV=staging
VITE_ANALYTICS_ENABLED=false
```

**Development:**
```bash
VITE_APP_URL=http://localhost:8080
VITE_NODE_ENV=development
VITE_ANALYTICS_ENABLED=false
```

### 3. Domain Configuration
- [ ] Add custom domain in Vercel dashboard
- [ ] Configure DNS settings
- [ ] Enable SSL certificate
- [ ] Set up domain redirects (www to non-www)

### 4. Analytics Setup
- [ ] Create Plausible Analytics account
- [ ] Add domain to Plausible
- [ ] Verify tracking is working

### 5. Monitoring Setup (Optional)
- [ ] Set up Sentry for error tracking
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

## Getting Vercel Tokens

### 1. VERCEL_TOKEN
1. Go to https://vercel.com/account/tokens
2. Create new token with deployment permissions
3. Add to GitHub secrets

### 2. VERCEL_ORG_ID & VERCEL_PROJECT_ID
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel link` in project directory
3. Copy IDs from `.vercel/project.json`

## Deploy Commands

### Manual Deploy
```bash
# Production
npm run build:prod
vercel --prod

# Preview
npm run build:staging  
vercel
```

### Automatic Deploy
- Push to `main` branch → Production deployment
- Create Pull Request → Preview deployment

## Post-Deploy Verification

### 1. Functionality Test
- [ ] All tools work correctly
- [ ] Copy buttons function
- [ ] Navigation works
- [ ] Responsive design works

### 2. Performance Test
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Load time < 3 seconds

### 3. Security Test
- [ ] Security headers present
- [ ] CSP works correctly
- [ ] No mixed content warnings

### 4. SEO Test
- [ ] Meta tags correct
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] Open Graph images work

## Troubleshooting

### Build Fails
- Check environment variables
- Verify Node.js version (18+)
- Check dependency conflicts

### Analytics Not Working
- Verify domain configuration
- Check Plausible account settings
- Test in production environment only

### Performance Issues
- Check bundle size with `npm run build`
- Review chunk splitting
- Optimize images and assets