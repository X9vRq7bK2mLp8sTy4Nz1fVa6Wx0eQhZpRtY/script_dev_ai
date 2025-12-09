# Deploying to Coolify VPS

This guide provides step-by-step instructions for deploying the Roblox Script Dev AI application to your Coolify VPS.

## Prerequisites

- A Coolify instance running on your VPS
- A GitHub account
- Google AI API Key ([Get one here](https://makersuite.google.com/app/apikey))
- (Optional) A custom domain

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

If you haven't already:

```bash
cd /Users/joshuawessels/Desktop/script_dev_ai

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Roblox Script Dev AI"

# Create main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Repository

Make sure your repository contains:
- ✅ `Dockerfile`
- ✅ `package.json`
- ✅ `.dockerignore`
- ✅ All application files

## Step 2: Configure Coolify

### 2.1 Create New Application

1. Login to your Coolify dashboard (usually at `https://your-vps-ip:8000`)
2. Navigate to your project or create a new one
3. Click **"+ New Resource"**
4. Select **"Application"**

### 2.2 Connect GitHub Repository

1. Select **"GitHub"** as the source
2. Choose your repository from the list
3. Select the **main** branch

### 2.3 Configure Build Settings

Set the following:

- **Build Pack**: `Dockerfile`
- **Dockerfile Location**: `Dockerfile` (default)
- **Port**: `3000`
- **Health Check Path**: `/` (optional but recommended)

### 2.4 Set Environment Variables

Click on **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `GOOGLE_AI_API_KEY` | `your_google_ai_api_key_here` |
| `NODE_ENV` | `production` |

**Important**: Replace `your_google_ai_api_key_here` with your actual Google AI API key.

### 2.5 Configure Domain (Optional)

If you have a custom domain:

1. Go to **"Domains"** section
2. Add your domain (e.g., `roblox-script-dev.yourdomain.com`)
3. Coolify will automatically set up SSL/HTTPS via Let's Encrypt

If you don't have a domain, Coolify will provide a default URL.

## Step 3: Deploy

### 3.1 Start Deployment

1. Review all settings
2. Click **"Deploy"** or **"Save & Deploy"**

### 3.2 Monitor Build

Coolify will:
- Clone your repository
- Build the Docker image (this may take 5-10 minutes)
- Start the container
- Set up networking and SSL

You can monitor the build logs in real-time.

### 3.3 Verify Deployment

Once deployed, you should see:
- ✅ Status: **Running**
- ✅ Health Check: **Passing**
- 🌐 URL: Your application URL

## Step 4: Access Your Application

Visit your application at:
- Custom domain: `https://your-domain.com`
- Or Coolify provided URL

You should see the Roblox Script Dev AI interface!

## Troubleshooting

### Build Fails

**Issue**: Docker build fails

**Solution**:
- Check the build logs in Coolify
- Ensure `Dockerfile` is in the root directory
- Verify `package.json` has all dependencies

### Application Won't Start

**Issue**: Container starts but application is unreachable

**Solution**:
- Verify port 3000 is configured correctly
- Check that `GOOGLE_AI_API_KEY` environment variable is set
- Review container logs in Coolify

### API Key Error

**Issue**: "Google AI API key is not configured" error

**Solution**:
- Double-check the environment variable name is exactly `GOOGLE_AI_API_KEY`
- Ensure the key is valid and active
- Redeploy the application after setting the variable

### Memory Issues

**Issue**: Container crashes due to memory

**Solution**:
- Increase container memory limit in Coolify settings
- Recommended: At least 512MB RAM

### File Upload Issues

**Issue**: Large file uploads fail

**Solution**:
- Check your VPS has enough disk space
- Increase Nginx/Traefik upload size limits if needed
- Default limit is 50MB per file

## Updating Your Application

When you make changes:

```bash
# Commit your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

Then in Coolify:
1. Go to your application
2. Click **"Redeploy"** or wait for auto-deploy (if enabled)

## Advanced Configuration

### Custom Port

To use a different port:
1. Update `Dockerfile` - change `EXPOSE` directive
2. Update environment variable `PORT` in Coolify
3. Update Coolify application port setting

### Auto-Deploy on Push

Enable automatic deployments:
1. In Coolify, go to application settings
2. Enable **"Auto Deploy"**
3. Every push to main branch will trigger a deployment

### Health Checks

For better monitoring:
1. Set health check path to `/`
2. Configure check interval (default: 30s)
3. Set retries and timeout as needed

## Security Recommendations

1. **Protect Your API Key**
   - Never commit `.env` files
   - Use Coolify's environment variable system
   - Rotate keys periodically

2. **Use HTTPS**
   - Always use a custom domain with SSL
   - Coolify handles this automatically

3. **Firewall**
   - Ensure only necessary ports are open
   - Coolify manages this for you

4. **Backups**
   - Keep your GitHub repository updated
   - Coolify can backup configurations

## Monitoring

### Check Application Status

In Coolify:
- View resource usage (CPU, Memory)
- Check container logs
- Monitor health checks

### Logs

To view application logs:
1. Go to your application in Coolify
2. Click **"Logs"**
3. View real-time or historical logs

## Cost Optimization

### Google AI API Costs

- Gemini Pro has a free tier
- Monitor usage in Google AI Studio
- Set up billing alerts

### VPS Resources

- Monitor memory and CPU usage
- Scale resources as needed
- Consider using Coolify's built-in monitoring

## Getting Help

- **Coolify Docs**: [https://coolify.io/docs](https://coolify.io/docs)
- **Google AI Docs**: [https://ai.google.dev](https://ai.google.dev)
- **Project Issues**: Open a GitHub issue in your repository

---

## Quick Reference

| Action | Command/Location |
|--------|------------------|
| View Logs | Coolify → Your App → Logs |
| Restart App | Coolify → Your App → Restart |
| Update Code | `git push origin main` |
| Change Env Vars | Coolify → Your App → Environment |
| Scale Resources | Coolify → Your App → Resources |

---

**🎉 Congratulations!** Your Roblox Script Dev AI is now live and ready to use!
