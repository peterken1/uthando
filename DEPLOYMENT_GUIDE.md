# Uthando - Vercel Deployment Guide

This guide will help you deploy the Uthando app to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get one from [platform.openai.com](https://platform.openai.com)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing your Uthando app

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (if app is in root)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     Name: OPENAI_API_KEY
    
     ```
   - Make sure it's available for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd /path/to/uthando
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `uthando` (or your preferred name)
   - In which directory is your code located? `./`

5. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Enter your OpenAI API key when prompted.

6. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Environment Variables Management
- Production: Set in Vercel dashboard under "Settings" → "Environment Variables"
- Preview: Automatically inherits from production unless overridden
- Development: Use `.env.local` file locally

### Monitoring and Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and usage
- Set up error tracking if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript types are correct
   - Verify API routes are properly structured

2. **Environment Variables Not Working**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding new variables
   - Check variable names match exactly

3. **API Routes Failing**
   - Verify OpenAI API key is valid and has credits
   - Check API route file structure (`app/api/*/route.ts`)
   - Review function exports (must export named functions like `POST`, `GET`)

4. **PWA Not Installing**
   - Ensure `manifest.json` is accessible
   - Check service worker registration
   - Verify HTTPS is enabled (automatic on Vercel)

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component for better performance
   - Optimize icon files if needed

2. **Bundle Analysis**
   ```bash
   npm run build
   npx @next/bundle-analyzer
   ```

3. **Caching**
   - Vercel automatically handles caching
   - Configure custom cache headers if needed

## Security Considerations

1. **Environment Variables**
   - Never commit API keys to repository
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **API Rate Limiting**
   - Consider implementing rate limiting for API routes
   - Monitor OpenAI API usage

3. **CORS**
   - Configure CORS if needed for external integrations
   - Current setup works for same-origin requests

## Maintenance

### Updates
1. Push changes to your Git repository
2. Vercel automatically deploys from main/master branch
3. Preview deployments created for pull requests

### Monitoring
- Check Vercel dashboard for deployment status
- Monitor OpenAI API usage and costs
- Review error logs in Vercel Functions tab

### Backup
- Code is backed up in Git repository
- Environment variables should be documented securely
- Consider exporting Vercel project settings

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **OpenAI API Documentation**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

Your Uthando app should now be successfully deployed and accessible worldwide! 🚀

