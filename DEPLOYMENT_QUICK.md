# 🚀 Deploy BeeTrack - Easiest Methods

Choose your deployment method below. All are **extremely easy** and take 5-10 minutes.

---

## Method 1: Railway (Recommended - Easiest!)

**Time:** 5 minutes | **Cost:** Free tier available

### One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/beetrack)

OR

### Automated Script
```bash
chmod +x scripts/deploy-railway.sh
./scripts/deploy-railway.sh
```

**What it does:**
- ✅ Creates backend service
- ✅ Adds PostgreSQL database
- ✅ Adds Redis cache
- ✅ Configures environment variables
- ✅ Sets up automatic deployments
- ✅ Provides HTTPS URLs

**After deployment:**
1. Your backend will be at: `https://beetrack-backend-xxx.up.railway.app`
2. View API docs at: `https://beetrack-backend-xxx.up.railway.app/api/docs`
3. Add optional integrations (Twilio, Slack) in Railway dashboard

**Full Guide:** [docs/DEPLOY_RAILWAY.md](./docs/DEPLOY_RAILWAY.md)

---

## Method 2: Render (Alternative - Also Easy!)

**Time:** 5 minutes | **Cost:** Free tier available

### One-Click Deploy
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/scottdatablocks/beetrack)

**What happens:**
- Render reads `render.yaml` and sets up everything automatically
- Backend, database, Redis all configured
- HTTPS enabled by default

---

## Method 3: Docker (Self-Hosted)

**Time:** 10 minutes | **Cost:** Your own server

```bash
# On your server (DigitalOcean, AWS, etc.)
git clone https://github.com/scottdatablocks/beetrack.git
cd beetrack

# Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start everything
docker compose -f docker-compose.prod.yml up -d
```

**Requirements:**
- Server with Docker installed
- Domain name (optional but recommended)
- SSL certificate setup (use Certbot)

---

## Method 4: Vercel (Frontend) + Railway (Backend)

**Best for:** Separating frontend and backend hosting

### Deploy Frontend to Vercel (2 minutes)
```bash
cd frontend
npx vercel
# Follow prompts, set VITE_API_URL to your backend URL
```

### Deploy Backend to Railway (3 minutes)
Follow Railway instructions above

---

## 🎯 Which Should You Choose?

| Method | Best For | Ease | Cost |
|--------|----------|------|------|
| **Railway** | Quick deployments, all-in-one | ⭐⭐⭐⭐⭐ | $5-20/mo |
| **Render** | Similar to Railway, alternative | ⭐⭐⭐⭐⭐ | $7-25/mo |
| **Docker** | Self-hosting, full control | ⭐⭐⭐ | Server cost |
| **Vercel+Railway** | Best frontend performance | ⭐⭐⭐⭐ | $10-30/mo |

---

## 📦 What You Get After Deployment

- ✅ Live backend API with Swagger docs
- ✅ PostgreSQL database (managed)
- ✅ Redis cache (managed)
- ✅ HTTPS/SSL certificates (automatic)
- ✅ Automatic deployments on git push
- ✅ Health checks and monitoring
- ✅ Logs and metrics dashboard
- ✅ Custom domain support (optional)

---

## 🔧 Post-Deployment Setup

After deploying, configure integrations (optional):

### 1. Add Twilio SMS (5 minutes)
1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token
3. Buy a phone number ($1/month)
4. Add to environment variables:
   ```
   TWILIO_ACCOUNT_SID=ACxxxx
   TWILIO_AUTH_TOKEN=xxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### 2. Add Slack Notifications (3 minutes)
1. Create a Slack workspace (if needed)
2. Create incoming webhook: [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)
3. Add to environment variables:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
   ```

### 3. Test Your Deployment
```bash
# Test backend health
curl https://your-backend-url.com/health

# Test API
curl https://your-backend-url.com/api/alerts

# View API docs
open https://your-backend-url.com/api/docs
```

---

## 🚨 Troubleshooting

### Deployment Failed?
- Check logs in your platform's dashboard
- Ensure all environment variables are set
- Verify database connection string is correct

### Frontend Can't Reach Backend?
- Check CORS settings in backend
- Verify VITE_API_URL points to correct backend URL
- Ensure backend is running and healthy

### Database Migrations Not Running?
- Check start command includes: `npx prisma migrate deploy`
- View deployment logs for migration errors
- Manually run migrations if needed

---

## 💡 Need Help?

1. **Railway Issues:** [docs.railway.app](https://docs.railway.app)
2. **Render Issues:** [render.com/docs](https://render.com/docs)
3. **BeeTrack Issues:** [GitHub Issues](https://github.com/scottdatablocks/beetrack/issues)
4. **General Help:** See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed guides

---

**🎉 You're ready to deploy! Pick a method above and your app will be live in minutes.**
