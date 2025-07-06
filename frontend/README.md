# Serenity AI - Frontend

A beautiful, modern React application providing AI-powered mental health and spiritual wellness chat interface.

## 🚀 Features

- **Mental Health Chat** - Compassionate AI conversations for mental health support
- **Spiritual Chat** - AI-guided spiritual guidance and exploration
- **Chat History** - View and continue previous conversations
- **Beautiful UI** - Glassmorphic design with smooth animations
- **Responsive Design** - Works perfectly on all devices
- **Authentication** - Google OAuth integration

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls

## 📦 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

| Variable                | Description            | Example                                            |
| ----------------------- | ---------------------- | -------------------------------------------------- |
| `VITE_API_URL`          | Backend API URL        | `http://localhost:3000/api`                        |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id.apps.googleusercontent.com` |

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── utils/        # Utility functions
│   ├── App.jsx       # Main App component
│   └── main.jsx      # Entry point
├── package.json
└── vite.config.js
```

## 🎨 Design System

The app uses a custom design system with:

- **Tranquil colors** - Calming blues and teals
- **Warm accents** - Subtle warm tones
- **Glassmorphic effects** - Modern frosted glass look
- **Smooth animations** - Powered by Framer Motion

## 🚀 Deployment

This frontend is configured for deployment on Vercel:

1. **Build command:** `npm run build`
2. **Output directory:** `dist`
3. **Root directory:** `frontend` (for monorepo)

## 🔧 Development

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import where needed

### API Integration

- All API calls go through `src/services/`
- Use the `axios` instance from `src/utils/axios.js`
- Handle authentication in `src/contexts/AuthContext.jsx`

## 🤝 Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test on multiple screen sizes

## 📄 License

This project is part of the Serenity AI application.
