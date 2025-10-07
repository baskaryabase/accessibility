# EduAssist - Campus Accessibility Hub 🎓♿

EduAssist is a comprehensive web application designed to make campus life more accessible to visually and hearing-impaired students. Built with Next.js and powered by Google Cloud APIs, it provides essential accessibility tools including text-to-speech, voice navigation, automatic captioning, and multilingual support.

## 🚀 Project Overview

EduAssist serves as a unified accessibility hub that helps students interact with digital campus resources through:

- **Voice Navigation**: Navigate using simple voice commands
- **Text-to-Speech (TTS)**: Convert announcements and content to speech
- **Auto Captions**: Generate captions for lecture videos
- **Accessible Interface**: WCAG 2.1 AA compliant design
- **Multilingual Support**: Real-time translation capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with accessibility-focused design
- **APIs**: Google Cloud Text-to-Speech, Speech-to-Text, Video Intelligence, Translation
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## ✨ Core Features

### 🔊 Text-to-Speech (TTS)
- Convert announcements, lecture notes, and campus updates into natural speech
- Multiple languages and voice options
- Adjustable speech rate, pitch, and volume
- Downloadable audio files

### 🎙️ Speech-to-Text (Voice Commands)
- Real-time voice recognition for navigation
- Natural language commands like "Open timetable" or "Show library schedule"
- Hands-free form completion
- Continuous listening mode

### 🎬 Automatic Subtitles & Captions
- Auto-generate captions for uploaded lecture videos
- Real-time caption generation
- Editable transcripts with timestamps
- Export capabilities (SRT format)

### ⠃ Braille Converter
- Convert lectures, speeches, and important notes into Braille format
- Support for both Grade 1 (uncontracted) and Grade 2 (contracted) Braille
- File upload support (TXT, PDF, DOC, DOCX)
- Print-ready BRF format output
- Visual Braille display for verification
- Copy/paste and download functionality

### 🌐 Accessible Interface
- High-contrast mode support
- Adjustable font sizes (small, medium, large, xl)
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatible
- Skip navigation links

### 🗣️ Multilingual Support
- Real-time translation of content
- Regional language support
- UI text localization
- Cultural adaptation features

## 📋 Prerequisites

Before setting up EduAssist, ensure you have:

- Node.js 18.x or later
- npm or yarn package manager
- Google Cloud Platform account
- Google Cloud project with billing enabled

## 🔧 Google Cloud Setup

### 1. Create Google Cloud Project
```bash
# Install Google Cloud CLI
# Visit: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create a new project
gcloud projects create eduassist-project --name="EduAssist"

# Set the project
gcloud config set project eduassist-project
```

### 2. Enable Required APIs
```bash
# Enable necessary Google Cloud APIs
gcloud services enable texttospeech.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable videointelligence.googleapis.com
gcloud services enable translate.googleapis.com
```

### 3. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create eduassist-service \
    --description="EduAssist service account" \
    --display-name="EduAssist Service"

# Grant necessary roles
gcloud projects add-iam-policy-binding eduassist-project \
    --member="serviceAccount:eduassist-service@eduassist-project.iam.gserviceaccount.com" \
    --role="roles/cloudtranslate.user"

gcloud projects add-iam-policy-binding eduassist-project \
    --member="serviceAccount:eduassist-service@eduassist-project.iam.gserviceaccount.com" \
    --role="roles/speech.client"

gcloud projects add-iam-policy-binding eduassist-project \
    --member="serviceAccount:eduassist-service@eduassist-project.iam.gserviceaccount.com" \
    --role="roles/videointelligence.admin"

# Create and download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=eduassist-service@eduassist-project.iam.gserviceaccount.com
```

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies
```bash
# Clone the repository (if using git)
git clone <repository-url>
cd eduassist

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# GOOGLE_CLOUD_PROJECT_ID=your-project-id
# GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

### 3. Place Service Account Key
- Move your `service-account-key.json` file to the project root
- Ensure the path matches your `GOOGLE_APPLICATION_CREDENTIALS` environment variable

### 4. Start Development Server
```bash
# Run development server
npm run dev

# Or using yarn
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
eduassist/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── tts/                  # Text-to-Speech API
│   │   │   ├── stt/                  # Speech-to-Text API
│   │   │   ├── video-captions/       # Video captioning API
│   │   │   ├── braille-convert/      # Braille conversion API
│   │   │   └── extract-text/         # Text extraction API
│   │   ├── tts/                      # TTS feature page
│   │   ├── captions/                 # Captions feature page
│   │   ├── braille/                  # Braille converter page
│   │   ├── voice/                    # Voice navigation page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/                   # React components
│   │   ├── accessibility/            # Accessibility components
│   │   ├── features/                 # Feature components
│   │   ├── layout/                   # Layout components
│   │   ├── providers/                # Context providers
│   │   └── sections/                 # Page sections
│   ├── lib/                          # Utility functions
│   ├── styles/                       # Additional styles
│   └── types/                        # TypeScript types
├── public/                           # Static assets
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind CSS config
└── tsconfig.json                     # TypeScript config
```

## 🎯 Usage Examples

### Text-to-Speech
```javascript
// Convert text to speech
const response = await fetch('/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Welcome to EduAssist!',
    languageCode: 'en-US',
    speakingRate: 1.0,
    pitch: 0
  })
});
```

### Braille Converter
```javascript
// Convert text to Braille
const response = await fetch('/api/braille-convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Computer Science Lecture Notes',
    grade: 'grade2', // or 'grade1'
    includeVisual: true
  })
});
```

### Voice Commands
- "Open timetable" - Navigate to schedule
- "Convert to braille" - Open Braille converter
- "Read announcements" - Start TTS for content
- "High contrast on" - Enable accessibility mode
- "Help" - Show available commands

### Video Captions
```javascript
// Generate captions for video
const formData = new FormData();
formData.append('video', videoFile);
formData.append('languageCode', 'en-US');
formData.append('generateSRT', 'true');

const response = await fetch('/api/video-captions', {
  method: 'POST',
  body: formData
});
```

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: Built-in high contrast mode
- **Font Scaling**: Adjustable text sizes
- **Focus Management**: Clear focus indicators
- **Alternative Text**: Descriptive alt text for images

### Assistive Technology Support
- Compatible with NVDA, JAWS, VoiceOver
- Works with Dragon NaturallySpeaking
- Supports switch navigation
- Mobile accessibility features

## 🔧 Configuration

### Voice Settings
```typescript
interface TTSSettings {
  voice: string;           // Voice selection
  rate: number;           // Speaking rate (0.25-4.0)
  pitch: number;          // Voice pitch (-20 to 20)
  volume: number;         // Audio volume (0-1)
  language: string;       // Language code
}
```

### Accessibility Settings
```typescript
interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  highContrast: boolean;
  reduceMotion: boolean;
  voiceEnabled: boolean;
  language: string;
}
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Upload service account key as file
```

### Deploy to Other Platforms
1. Build the application: `npm run build`
2. Set environment variables
3. Upload service account key
4. Deploy static files and API routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

### Development Guidelines
- Follow accessibility best practices
- Write semantic HTML
- Include ARIA labels where needed
- Test with screen readers
- Ensure keyboard navigation works
- Maintain high contrast ratios

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**1. Google Cloud Authentication Error**
```bash
# Verify service account key
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
gcloud auth application-default print-access-token
```

**2. API Quota Exceeded**
- Check Google Cloud Console quotas
- Enable billing if using free tier
- Monitor API usage

**3. Speech Recognition Not Working**
- Ensure HTTPS in production
- Check browser permissions
- Verify microphone access

### Getting Help
- Check the [Issues](../../issues) page
- Review [Google Cloud Documentation](https://cloud.google.com/docs)
- Test accessibility with screen readers

## 🔮 Future Enhancements

- [ ] Real-time live captions for video calls
- [ ] AI-powered content summarization
- [ ] Integration with Learning Management Systems
- [ ] Mobile app development
- [ ] Offline functionality
- [ ] Advanced voice commands
- [ ] Personalized accessibility profiles
- [ ] Campus navigation integration

## 🙏 Acknowledgments

- Google Cloud Platform for powerful APIs
- Next.js team for the excellent framework
- Tailwind CSS for accessible styling utilities
- The accessibility community for guidance and feedback

---

**Made with ❤️ for inclusive education**

For questions or support, please [open an issue](../../issues) or contact the development team.