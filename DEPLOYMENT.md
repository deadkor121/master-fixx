# Master-House Platform - Render Deployment Guide

## Prerequisites

- GitHub repository with the project code
- Render account (render.com)
- Neon PostgreSQL database (already configured)

## Step-by-Step Deployment

### 1. Repository Preparation

Your project is already configured with the correct build scripts:
- `build`: Builds both frontend (Vite) and backend (esbuild)
- `start`: Runs the production server from `dist/server/index.js`

### 2. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `master-house-platform`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `20.x`

### 3. Environment Variables

Set these environment variables in Render:

**Database (Already configured):**
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `PGHOST`: Database host
- `PGPORT`: Database port (usually 5432)
- `PGUSER`: Database username
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name

**Application:**
- `NODE_ENV`: `production`
- `JWT_SECRET`: Generate a strong secret key (use a password generator)

### 4. Build Process Verification

The build process will:
1. Install dependencies with `npm install`
2. Build frontend to `dist/public/`
3. Build backend to `dist/server/index.js`
4. Start server with `npm start`

### 5. Production Features

Your app is already configured with:
- ✅ CSP security headers (enabled in production)
- ✅ Rate limiting for API endpoints
- ✅ Helmet security middleware
- ✅ Static file serving
- ✅ Database connection pooling
- ✅ Error handling and logging

### 6. Database Migration

Your database schema is already set up. If you need to update the schema:

1. Make changes to `shared/schema.ts`
2. Run `npm run db:push` locally to test
3. Deploy to Render (schema changes will be applied automatically)

### 7. Monitoring

After deployment, monitor:
- Render deployment logs
- Application performance
- Database connection status
- Error rates

## Troubleshooting

**Common Issues:**

1. **Build fails**: Check Node.js version compatibility
2. **Database connection fails**: Verify environment variables
3. **Static files not served**: Check build output in `dist/public/`
4. **CSP blocks resources**: Production CSP is restrictive by design

**Debug Commands:**
```bash
# Check build output
npm run build
ls -la dist/

# Test production locally
NODE_ENV=production npm start
```

## Post-Deployment

1. Test all application features
2. Verify database connections
3. Check security headers
4. Monitor performance metrics
5. Set up custom domain (optional)

## Security Considerations

- JWT secrets are properly configured
- Database connections use SSL
- CSP headers protect against XSS
- Rate limiting prevents abuse
- Environment variables are secure

Your Master-House platform is ready for production deployment on Render!