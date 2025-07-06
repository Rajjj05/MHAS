# Serenity AI - Mental Health & Spiritual Wellness Platform

A full-stack AI-powered mental health and spiritual wellness chat application built with modern web technologies. This monorepo contains both frontend and backend applications designed for seamless deployment on Vercel.

## 🌟 Project Overview

Serenity AI is a compassionate platform that provides users with AI-powered conversations for mental health support and spiritual guidance. The application features a beautiful, tranquil interface with glassmorphic design elements and smooth animations to create a calming user experience.

### ✨ Key Features

- **🧠 Mental Health Chat** - AI-powered conversations for mental health support and guidance
- **🕊️ Spiritual Chat** - Spiritual wellness discussions and exploration
- **📚 Chat History** - View and continue previous conversations with organized history
- **🔐 Authentication** - Secure Google OAuth integration
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **⚡ Real-time Experience** - Fast, responsive chat interface
- **🌙 Calming Interface** - Glassmorphic design with soothing animations

## 🏗️ Architecture

This is a monorepo containing:

```
Serenity AI/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express.js + MongoDB + AI Integration
├── .gitignore         # Root-level git ignore rules
└── README.md          # This file
```

### Frontend Stack

- **React 18** with modern hooks
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **Axios** for API communication

### Backend Stack

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Groq API** for AI language model integration
- **Google OAuth 2.0** for authentication
- **JWT** for session management
- **Serverless-ready** for Vercel deployment

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials
- Groq API key

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd serenity-ai
   ```

2. **Install dependencies for both frontend and backend:**

   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**

   **Frontend (.env in frontend/ directory):**

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

   **Backend (.env in backend/ directory):**

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/serenity-ai
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Start development servers:**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🌐 Deployment

This project is optimized for deployment on **Vercel** with separate configurations for frontend and backend.

### Deployment Structure

- **Frontend**: Deployed as a static Vite application
- **Backend**: Deployed as Vercel serverless functions

### Deploy to Vercel

1. **Frontend Deployment:**

   ```bash
   cd frontend
   vercel --prod
   ```

2. **Backend Deployment:**
   ```bash
   cd backend
   vercel --prod
   ```

### Environment Variables for Production

Set these in your Vercel dashboard:

**Frontend:**

- `VITE_API_URL`: Your deployed backend URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

**Backend:**

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret for JWT signing
- `GROQ_API_KEY`: Your Groq API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `CLIENT_URL`: Your deployed frontend URL
- `NODE_ENV`: production

## 📁 Project Structure

### Frontend (`/frontend`)

```
src/
├── components/        # Reusable UI components
│   ├── AuthCallback.jsx
│   ├── ChatInterface.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── LoadingSpinner.jsx
│   ├── PageTransition.jsx
│   ├── ScrollToTop.jsx
│   └── SignInButton.jsx
├── contexts/          # React context providers
│   ├── AuthContext.jsx
│   └── ChatContext.jsx
├── pages/            # Page components
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── History.jsx
│   ├── Home.jsx
│   ├── MentalHealthChat.jsx
│   └── SpiritualChat.jsx
├── services/         # API service layers
│   ├── AuthService.js
│   └── ChatService.js
└── utils/           # Utility functions
    └── axios.js
```

### Backend (`/backend`)

```
├── api/              # Vercel serverless function entry
│   └── index.js
├── config/           # Configuration files
│   ├── openai.js
│   └── passport.js
├── controllers/      # Route controllers
│   ├── ChatController.js
│   └── UserController.js
├── middlewares/      # Express middlewares
│   └── auth.js
├── models/          # MongoDB models
│   ├── Chat.js
│   └── User.js
├── routes/          # API routes
│   ├── chatRoutes.js
│   └── userRoutes.js
├── services/        # Business logic services
│   └── openaiService.js
└── utils/          # Utility functions
    └── mongodb.js
```

## 🎨 Design System

The application features a **glassmorphic design** with:

- Gradient backgrounds with tranquil colors
- Semi-transparent cards with backdrop blur
- Smooth hover transitions and animations
- Consistent spacing and typography
- Responsive design for all screen sizes

### Color Palette

- Primary: Blue/Teal gradients (`from-blue-400 to-teal-500`)
- Accent: Purple/Pink gradients (`from-purple-400 to-pink-500`)
- Background: Subtle gradients with glassmorphic overlays
- Text: High contrast for accessibility

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout user

### Chat Management

- `GET /api/chats` - Get user's chat history
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `POST /api/chats/:id/messages` - Add message to chat

## 🧪 Development

### Scripts

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Code Quality

- ESLint configuration for consistent code style
- Prettier for code formatting
- Modern ES6+ JavaScript throughout

## 📝 What's Been Accomplished

### ✅ Completed Features

- **Full-stack architecture** with React frontend and Express backend
- **AI-powered chat system** using Groq API
- **Google OAuth authentication** with Passport.js
- **Beautiful, responsive UI** with glassmorphic design
- **Chat history management** with clean, intuitive interface
- **Serverless deployment setup** for Vercel
- **Comprehensive documentation** for both frontend and backend
- **Environment configuration** for development and production
- **Monorepo structure** optimized for separate deployments

### 🎨 UI/UX Enhancements

- Removed unused features (bookmarks, delete, export)
- Simplified chat history to show only essential information
- Enhanced homepage with floating animation for the main heading
- Updated SignInButton with improved glassmorphic styling
- Cleaned up Footer to show only real, functional links
- Improved overall design consistency and user experience

### 🚀 DevOps & Deployment

- Configured Vercel deployment for both frontend and backend
- Added comprehensive `.gitignore` files for monorepo structure
- Set up serverless function configuration for backend
- Provided environment variable documentation
- Created deployment-ready `vercel.json` configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions, issues, or support:

- Check the individual README files in `/frontend` and `/backend` directories
- Review the API documentation in the backend README
- Ensure all environment variables are properly configured
- Verify MongoDB connection and Groq API key validity

---

**Serenity AI** - Your journey to mental wellness starts here. 🌟
