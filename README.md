# Roblox Script Dev AI

AI-powered Roblox script development and refinement platform with support for both Executor environments and Roblox Studio.

## 🌟 Features

- **Dual Environment Support**: Toggle between Executor (testing/research) and Roblox Studio (development) modes
- **AI-Powered Generation**: Leverages Google Gemini AI for intelligent script creation
- **Multi-File Dependencies**: Upload up to 5 reference files with individual notes
- **Context-Aware**: AI uses your uploaded files as reference for generating scripts
- **Professional Dark UI**: Sleek, modern interface with glassmorphism effects
- **Fully Dockerized**: Ready for immediate deployment to any VPS or cloud platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ (for local development)
- Docker (for deployment)
- Google AI API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd script_dev_ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your GOOGLE_AI_API_KEY
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

#### Build and run locally:

```bash
# Build the image
docker build -t roblox-script-dev .

# Run the container
docker run -p 3000:3000 -e GOOGLE_AI_API_KEY=your_key_here roblox-script-dev
```

#### Using Docker Compose:

```bash
# Create .env file with your API key
echo "GOOGLE_AI_API_KEY=your_key_here" > .env

# Start the application
docker-compose up -d
```

## 📦 Deployment to Coolify VPS

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Configure Coolify

1. **Login to your Coolify dashboard**
2. **Click "New Resource" → "Application"**
3. **Select your GitHub repository**
4. **Configure the application:**
   - **Build Pack**: Dockerfile
   - **Port**: 3000
   - **Health Check Path**: `/` (optional)

### Step 3: Set Environment Variables

In Coolify, add the following environment variable:
- `GOOGLE_AI_API_KEY`: Your Google AI API key

### Step 4: Deploy

Click "Deploy" and Coolify will:
- Clone your repository
- Build the Docker image
- Deploy the container
- Set up automatic SSL/HTTPS

Your application will be live at your configured domain!

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | Yes | Google Generative AI API key |
| `PORT` | No | Port to run on (default: 3000) |
| `NODE_ENV` | No | Environment mode (default: production) |

### File Upload Limits

By default, the application supports:
- Maximum 5 files per request
- Up to 50MB per file
- Accepted formats: `.lua`, `.luau`, `.txt`

To adjust these limits:
1. Edit `next.config.js` - change `bodySizeLimit`
2. Edit `app/components/FileUploader.tsx` - change `maxFiles` prop

## 🎮 How to Use

1. **Select Environment**
   - Choose "Executor" for testing/research environments
   - Choose "Roblox Studio" for game development

2. **Upload Dependencies** (Optional)
   - Drag and drop up to 5 Lua files
   - Add notes for each file explaining its purpose
   - These files guide the AI in generating your script

3. **Write Your Instructions**
   - Describe what you want the script to do
   - Reference specific features or techniques
   - Mention how to use the uploaded files

4. **Generate**
   - Click "Generate Script" and wait for the AI
   - Copy the generated code
   - Use it in your environment!

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Vanilla CSS with modern design tokens
- **AI**: Google Generative AI (Gemini Pro)
- **Deployment**: Docker, Coolify-ready

## 📝 License

This project is open source and available for educational and research purposes.

## ⚠️ Disclaimer

This tool is designed for educational purposes, script development, and research. Users are responsible for ensuring their scripts comply with Roblox's Terms of Service and Community Guidelines.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📧 Support

For issues or questions, please open a GitHub issue.
