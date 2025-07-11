# Deploy Nex to Vercel

## Option 1: Serverless Functions (Recommended)

This project is configured to deploy to Vercel with the backend running as serverless functions.

### Steps to Deploy:

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from this directory**:
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - Go to your project in Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add these variables:
     - `OPENAI_API_KEY` (your OpenAI API key)
     - `STRIPE_SECRET_KEY` (your Stripe secret key)
     - `VITE_STRIPE_PUBLIC_KEY` (your Stripe publishable key)

### Important Notes:

- **Database**: Currently using in-memory storage which will reset with each serverless function cold start
- **For Production**: You'll need to connect to a persistent database like:
  - Neon PostgreSQL (recommended)
  - PlanetScale MySQL
  - Vercel Postgres
  - Supabase

## Option 2: Split Deployment (Alternative)

If you prefer to separate frontend and backend:

### Frontend (Static Site):
1. Build the frontend:
   ```bash
   cd client && npm run build
   ```
2. Deploy the `dist` folder to Vercel as a static site

### Backend (Separate Vercel Project):
1. Create a separate project for the backend
2. Deploy just the `server` folder as Vercel functions

## Database Setup for Production

For a production deployment, you'll need to:

1. **Set up Neon PostgreSQL**:
   - Go to https://neon.tech
   - Create a free account
   - Create a new database
   - Get the connection string

2. **Update the storage**:
   - Replace the in-memory storage with actual database queries
   - Use the DATABASE_URL environment variable

3. **Run migrations**:
   ```bash
   npm run db:push
   ```

## Vercel Configuration

The `vercel.json` file is already configured with:
- Node.js runtime for the backend
- Static build for the frontend  
- API routes mapping
- Function timeout settings

## Cost Considerations

- **Vercel Free Tier**: 100GB bandwidth, 100 serverless function executions per day
- **Hobby Plan**: $20/month for unlimited personal projects
- **Pro Plan**: $20/month per user for team features

Your app should work fine on the free tier for development and small-scale testing!