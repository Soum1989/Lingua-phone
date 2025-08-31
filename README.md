# LinguaBot - Multilingual AI Chatbot

A production-ready multilingual chatbot application built for the GKEturns10 Hackathon, featuring AI-powered conversations, pronunciation training, and gamified language learning.

## 🌟 Features

- **Multilingual Chat**: Support for 50+ languages including all 22 official Indian languages
- **Voice Integration**: Speech-to-Text and Text-to-Speech capabilities
- **Pronunciation Trainer**: Gamified pronunciation practice with instant feedback
- **Role-Play Scenarios**: Interactive real-world conversation practice
- **Gamification**: XP system, badges, and progression tracking
- **Mobile-First PWA**: Responsive design optimized for all devices
- **Production Ready**: Containerized and ready for Google Kubernetes Engine deployment

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Vite for fast development and builds

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **File Uploads**: Multer for audio file handling
- **Security**: Helmet and CORS protection
- **Health Checks**: Built-in monitoring endpoints

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes manifests for GKE deployment
- **Development**: Skaffold for streamlined K8s development
- **Monitoring**: Health checks and resource limits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerization)
- Google Cloud SDK (for GKE deployment)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 5173) and backend (port 3001) concurrently.

3. **Open Application**
   Navigate to `http://localhost:5173` in your browser.

### Building for Production

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Build Backend**
   ```bash
   npm run build:server
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

### Build Container
```bash
docker build -t linguabot .
```

### Run Container
```bash
docker run -p 3001:3001 linguabot
```

### Docker Compose
```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment (GKE)

### Prerequisites
- Google Cloud Project with GKE enabled
- kubectl configured for your cluster
- Docker images pushed to Google Container Registry

### Deploy to GKE

1. **Set Project ID**
   ```bash
   export PROJECT_ID=your-gcp-project-id
   ```

2. **Build and Push Images**
   ```bash
   # Build image
   docker build -t gcr.io/$PROJECT_ID/linguabot:latest .
   
   # Push to GCR
   docker push gcr.io/$PROJECT_ID/linguabot:latest
   ```

3. **Update Kubernetes Manifests**
   Replace `PROJECT_ID` in `k8s/deployment.yml` with your actual project ID.

4. **Deploy to Cluster**
   ```bash
   kubectl apply -f k8s/
   ```

5. **Get External IP**
   ```bash
   kubectl get service linguabot-service
   ```

### Using Skaffold (Recommended)

1. **Update skaffold.yaml**
   Replace `PROJECT_ID` with your Google Cloud project ID.

2. **Development Mode**
   ```bash
   skaffold dev
   ```

3. **Production Deployment**
   ```bash
   skaffold run -p prod
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Google Cloud APIs (when integrating real services)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_CLOUD_PROJECT=your-project-id

# Optional: External API Keys
OPENAI_API_KEY=your-openai-key
GOOGLE_TRANSLATE_API_KEY=your-google-translate-key
```

### PWA Configuration

The app is PWA-ready with:
- Service worker for offline functionality
- Web app manifest for mobile installation
- Responsive design for all screen sizes

## 🧪 API Integration Points

The application is structured to easily integrate with real AI and language services:

### Chat AI Integration
- Replace `ChatService` with OpenAI GPT, Google Bard, or other AI services
- Update `/server/services/chatService.ts`

### Translation Services
- Integrate Google Translate API in `TranslationService`
- Update `/server/services/translationService.ts`

### Speech Services
- Integrate Google Cloud Speech-to-Text and Text-to-Speech
- Update `/server/services/speechService.ts`

### Pronunciation Scoring
- Integrate pronunciation assessment APIs
- Update `/server/services/pronunciationService.ts`

## 📱 Supported Languages

The application supports 50+ languages including:

### Indian Languages (22 Official + Regional)
- Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam
- Odia, Punjabi, Assamese, Urdu, Sanskrit, Sindhi, Nepali, Kashmiri
- Konkani, Manipuri, Dogri, Maithili, Santali, Bodo
- Regional: Bhojpuri, Tulu, Kumaoni

### International Languages
- Chinese (Mandarin), Japanese, German, French, Spanish, Arabic
- Portuguese, Russian, Korean, Italian, Dutch, Turkish, Polish
- Scandinavian: Swedish, Danish, Norwegian, Finnish
- Southeast Asian: Thai, Vietnamese, Indonesian, Malay, Filipino
- And many more...

## 🏆 Gamification Features

- **XP System**: Earn experience points for conversations and exercises
- **Badges**: Unlock achievements for milestones and accomplishments
- **Levels**: Progress through difficulty levels
- **Role-Play**: Interactive scenarios for real-world practice
- **Pronunciation Scoring**: AI-powered pronunciation feedback

## 🔐 Security Features

- CORS protection for API endpoints
- Helmet.js for security headers
- Input validation and sanitization
- File upload size limits
- Non-root Docker containers
- Kubernetes security contexts

## 📊 Monitoring & Observability

- Health check endpoints (`/health`)
- Kubernetes readiness and liveness probes
- Resource limits and requests
- Error logging and handling

## 🚀 GKE Deployment Strategy

This application is optimized for Google Kubernetes Engine with:

1. **Horizontal Pod Autoscaling**: Automatically scale based on CPU/memory usage
2. **Load Balancing**: Distribute traffic across multiple pods
3. **Rolling Updates**: Zero-downtime deployments
4. **Resource Management**: CPU and memory limits for cost optimization
5. **Health Monitoring**: Automatic restart of unhealthy pods

## 🛠️ Development Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build frontend for production
- `npm run build:server` - Build backend for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## 📝 License

MIT License - feel free to use this project as a starting point for your own applications.

## 🤝 Contributing

This project was created for the GKEturns10 Hackathon. Feel free to fork and extend it for your own use cases!

---

**Built with ❤️ for the GKEturns10 Hackathon**