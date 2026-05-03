# 🗳️ ElectaGuide Pro

<p align="center">
  <em>An AI-powered, interactive platform designed to demystify the election process and empower voters with accessible, non-partisan education.</em>
</p>

## 🚀 Overview

**ElectaGuide Pro** is a modern MERN-stack application built to solve the problem of election process education. Understanding how elections work, how votes are counted, and debunking common myths can be overwhelming. This platform leverages Google's **Gemini 2.5 Flash** to provide a dynamic, highly interactive learning experience that is easy to navigate and accessible to everyone.

**Live Demo:** [https://electaguide-api-124338265695.us-central1.run.app](https://electaguide-api-124338265695.us-central1.run.app)

---

## ✨ Features

- **🤖 AI-Powered Chat Assistant:** Got a specific question about voter registration or the electoral college? Ask the non-partisan AI assistant for instant, factual answers.
- **📚 Interactive Learning Modules:** 8 comprehensive modules covering everything from the basics of voting to how results are certified.
- **⚡ Myth Buster:** A dedicated section to debunk common election misinformation with evidence-based facts.
- **📖 Dynamic Glossary:** Search any election term and get an AI-generated, easy-to-understand definition with real-world examples.
- **🎯 Knowledge Quizzes:** Test your understanding at the end of each module with interactive quizzes.
- **🏆 Progress Tracking:** Local storage persistence tracks your learning journey, completed modules, and earned achievements without requiring you to create an account.
- **🎨 Premium UI/UX:** A beautifully crafted, fully responsive, and accessible dark-themed interface built with vanilla CSS Modules and Framer Motion.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Framer Motion, CSS Modules
- **Backend:** Node.js, Express, `node-cache` (for AI response caching)
- **AI Integration:** Google Generative AI SDK (`gemini-2.5-flash`)
- **Deployment:** Google Cloud Run, Google Cloud Build, Google Secret Manager
- **Security:** Helmet, Express Rate Limit, robust CORS configuration

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key (get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/electaguide-pro.git
   cd electaguide-pro
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   CORS_ORIGIN=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=20
   ```
   *(Note: If you don't provide an API key, the app gracefully falls back to a static "Demo Mode" so you can still view the UI.)*

4. **Start the Development Servers**
   
   In one terminal window, start the backend:
   ```bash
   npm run dev:server
   ```
   
   In a second terminal window, start the frontend:
   ```bash
   npm run dev:client
   ```
   
   The application will be available at `http://localhost:5173`.

---

## 🧪 Testing

The backend includes a robust test suite using Jest and Supertest to ensure API reliability.
```bash
npm run test
```

---

## ☁️ Deployment Architecture

This project is designed to be deployed as a single, highly optimized container on **Google Cloud Run**. The multi-stage `Dockerfile` builds the React frontend and serves it directly from the Express backend, removing the need for a separate static hosting service.

- **Build:** `gcloud builds submit` builds the image in the cloud.
- **Secrets:** API keys are injected securely at runtime via Google Secret Manager.
- **Scaling:** Cloud Run scales instances to zero when inactive, ensuring maximum cost-efficiency.

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page if you'd like to contribute.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
