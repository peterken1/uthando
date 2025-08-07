# Uthando - Love Note Generator & Relationship Coach

Uthando is a comprehensive relationship app that combines AI-powered love note generation, love language discovery, and personalized relationship coaching. The app is designed as a Progressive Web App (PWA) for easy installation on mobile devices.

## Features

### 🎯 Core Features
- **Love Note Generator**: Create personalized, heartfelt love notes in multiple languages using AI
- **Love Language Quiz**: Discover your love language through an interactive multilingual quiz
- **Love Doctor**: Chat with an AI relationship coach trained in emotional intelligence
- **PWA Support**: Install the app on your device for quick access
- **Multilingual Support**: Available in English, Swahili, Shona, Dholuo, Kalenjin, and Kikuyu

### 💝 Love Note Generator
- Generate romantic, personalized love notes
- Support for multiple African languages
- Share directly via WhatsApp
- Copy to clipboard functionality
- Feedback system for continuous improvement

### 💞 Love Language Quiz
- Interactive quiz to discover your love language
- Available in 11 different languages
- Results saved for personalized coaching
- Seamless navigation to other features

### 💬 Love Doctor (NEW!)
- AI-powered relationship coaching
- Warm, supportive chat interface
- Personalized advice based on quiz results
- Emotional intelligence-based prompts
- Real-time conversation with context awareness

### 📱 PWA Features
- Install button with smart detection
- Offline functionality via service worker
- Home screen shortcuts
- Native app-like experience
- Cross-platform compatibility

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4 for coaching, GPT-3.5-turbo for love notes
- **Deployment**: Vercel
- **PWA**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uthando
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key

### Environment Variables

- `OPENAI_API_KEY`: Required for AI-powered features (love notes and coaching)

## Project Structure

```
uthando/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── generate-love-note/
│   │   └── love-doctor/
│   ├── love-doctor/       # Love Doctor page
│   ├── quiz/             # Quiz page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── InstallButton.tsx
│   ├── LoveDoctor.tsx
│   ├── LoveLanguageQuiz.tsx
│   └── LoveNoteGenerator.tsx
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icons/          # App icons
└── README.md
```

## API Endpoints

### POST /api/generate-love-note
Generates a personalized love note.

**Request Body:**
```json
{
  "recipient": "string",
  "sender": "string", 
  "language": "string"
}
```

### POST /api/love-doctor
Provides AI relationship coaching.

**Request Body:**
```json
{
  "message": "string",
  "quizResults": "string (optional)",
  "conversationHistory": "array (optional)"
}
```

## Features in Detail

### Love Doctor AI Coach
The Love Doctor is an AI relationship coach that:
- Provides warm, empathetic guidance
- Uses emotional intelligence principles
- Offers personalized advice based on quiz results
- Maintains conversation context
- Encourages self-reflection through thoughtful questions

### PWA Installation
The app automatically detects when it can be installed and shows an install prompt. Users can:
- Install directly from the browser
- Add to home screen on mobile
- Access offline functionality
- Use app shortcuts

### Multilingual Support
Currently supports:
- English
- Swahili
- Shona
- Dholuo
- Kalenjin
- Kikuyu
- Zulu
- Xhosa
- Tswana
- Afrikaans
- Tshivenda
- Ndebele

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the Uthando team or create an issue in the repository.

---

Made with ❤️ for better relationships

