# Deploy BeeTrack to Railway - 5 Minute Setup

Railway is the easiest way to deploy BeeTrack. Everything is automated and takes ~5 minutes.

## Prerequisites
- GitHub account (you already have the code pushed)
- Railway account (free tier available)

## Step-by-Step Deployment (5 minutes)

### 1. Sign up for Railway (1 minute)
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub

### 2. Deploy BeeTrack Backend (2 minutes)

#### Option A: One-Click Deploy (Recommended)
1. Click this button: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/scottdatablocks/beetrack)

#### Option B: Manual Deploy (if button doesn't work)
1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `scottdatablocks/beetrack`
4. Railway will auto-detect the backend

**Configure Backend:**
```bash
# Railway will prompt for these - set them in the Variables tab:
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-filled
REDIS_URL=${{Redis.REDIS_URL}}          # Auto-filled
NODE_ENV=production
PORT=3000

# Optional (for notifications):
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
SLACK_WEBHOOK_URL=your_webhook
```

### 3. Add Database & Redis (2 minutes)
1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Click "+ New" again
4. Select "Database" → "Add Redis"
5. Railway automatically links them to your backend!

### 4. Deploy Frontend (Optional - 1 minute)
1. Click "+ New" → "GitHub Repo"
2. Select the same repo
3. Set Root Directory: `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

### 5. Access Your App! 🎉
- Backend API: `https://your-backend.up.railway.app`
- Frontend: `https://your-frontend.up.railway.app`
- API Docs: `https://your-backend.up.railway.app/api/docs`

## That's It!

Railway handles:
- ✅ Automatic builds from your GitHub repo
- ✅ Database setup and connection
- ✅ Environment variables
- ✅ HTTPS/SSL certificates
- ✅ Automatic deployments on git push
- ✅ Health checks and monitoring

## Cost Estimate
- **Free Tier:** $5 credit/month (enough for development)
- **Paid:** ~$10-20/month for production use
  - Backend: ~$5/month
  - PostgreSQL: ~$5/month
  - Redis: ~$3/month
  - Frontend: ~$5/month

## Common Issues

### Database Migrations Failing?
Railway runs migrations automatically. If they fail:
1. Go to your backend service
2. Click "Settings" → "Deploy"
3. Ensure Start Command is: `npx prisma migrate deploy && npm run start`

### Frontend Can't Connect to Backend?
1. Check `VITE_API_URL` environment variable
2. Make sure it points to your backend's public URL
3. Redeploy frontend after changing variables

### Need to See Logs?
1. Click on any service in Railway
2. Go to "Deployments" tab
3. Click on the latest deployment
4. View real-time logs

## Alternative: Even Easier Setup Script

I can create a script that does everything automatically:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize and deploy (everything automatic!)
railway init
railway up
```

## Need Help?
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- BeeTrack Issues: https://github.com/scottdatablocks/beetrack/issues
