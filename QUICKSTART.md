# EduAssist Quick Start Guide 🚀

Get EduAssist running in under 10 minutes!

## Prerequisites Checklist ✅

- [ ] Node.js 18+ installed
- [ ] Google Cloud account created
- [ ] Billing enabled on Google Cloud (required for APIs)

## Step 1: Google Cloud Setup (5 minutes)

### 1.1 Create Project and Enable APIs
```bash
# Login to Google Cloud
gcloud auth login

# Create project
gcloud projects create eduassist-$(date +%s) --name="EduAssist"

# Set project (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID

# Enable APIs (all at once)
gcloud services enable \
  texttospeech.googleapis.com \
  speech.googleapis.com \
  videointelligence.googleapis.com \
  translate.googleapis.com
```

### 1.2 Create Service Account
```bash
# Create service account
gcloud iam service-accounts create eduassist-sa \
  --display-name="EduAssist Service Account"

# Add roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:eduassist-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudtranslate.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:eduassist-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/speech.client"

# Create key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=eduassist-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 2: Project Setup (3 minutes)

### 2.1 Clone and Install
```bash
# If you have git
git clone <repository-url>
cd eduassist

# Or if starting fresh
npm install

# Create environment file
cp .env.example .env.local
```

### 2.2 Configure Environment
Edit `.env.local`:
```bash
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

## Step 3: Run the Application (1 minute)

```bash
# Start development server
npm run dev
```

🎉 **Success!** Visit http://localhost:3000

## Quick Test Checklist ✅

### Test Text-to-Speech
1. Go to `/tts`
2. Enter text: "Welcome to EduAssist!"
3. Click "Generate Speech"
4. Should hear audio

### Test Voice Commands
1. Click the microphone icon (🎤)
2. Say: "Help"
3. Should hear available commands

### Test Accessibility
1. Press `Tab` to navigate
2. Should see focus indicators
3. Try keyboard navigation

## Troubleshooting 🔧

### Common Issues

**❌ Google Cloud Authentication Error**
```bash
# Check your service account key
cat service-account-key.json | jq .type
# Should output: "service_account"
```

**❌ API Not Enabled**
```bash
# List enabled APIs
gcloud services list --enabled
```

**❌ Microphone Permission Denied**
- Use HTTPS in production
- Allow microphone access in browser

**❌ Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps 📚

1. **Customize Voices**: Edit voice options in `/src/app/tts/page.tsx`
2. **Add Languages**: Update language codes in components
3. **Style Changes**: Modify `tailwind.config.js`
4. **Deploy**: Use `vercel` or your preferred platform

## Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Folder Quick Reference

```
src/
├── app/
│   ├── api/          # API endpoints
│   ├── tts/          # Text-to-Speech page
│   └── page.tsx      # Home page
├── components/
│   ├── features/     # Feature components
│   └── layout/       # Layout components
└── types/            # TypeScript types
```

## Need Help? 🆘

- **Documentation**: Check `README.md`
- **Issues**: GitHub Issues page
- **Discord**: [Community Link]
- **Email**: support@eduassist.com

---

**Ready to make campus life more accessible!** 🎓♿