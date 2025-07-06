# Serenity AI - Backend

A robust Express.js API server providing AI-powered mental health and spiritual wellness chat backend with MongoDB and Google OAuth integration.

## 🚀 Features

- **AI Chat API** - Powered by Groq API for intelligent conversations
- **User Authentication** - Google OAuth 2.0 integration
- **Chat Management** - Create, retrieve, and manage chat sessions
- **Chat History** - Comprehensive chat history with statistics
- **MongoDB Integration** - Persistent data storage
- **RESTful API** - Clean, documented API endpoints
- **Serverless Ready** - Configured for Vercel deployment

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Authentication provider
- **Groq API** - AI language model integration
- **JWT** - JSON Web Tokens for session management

## 📦 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:

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

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

| Variable               | Description                          | Required           |
| ---------------------- | ------------------------------------ | ------------------ |
| `PORT`                 | Server port                          | No (default: 3000) |
| `MONGODB_URI`          | MongoDB connection string            | Yes                |
| `JWT_SECRET`           | JWT signing secret                   | Yes                |
| `GROQ_API_KEY`         | Groq API key for AI chat             | Yes                |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               | Yes                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret           | Yes                |
| `CLIENT_URL`           | Frontend URL for CORS                | Yes                |
| `NODE_ENV`             | Environment (development/production) | No                 |

## 📝 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (if configured)

## 📁 Project Structure

```
backend/
├── api/
│   └── index.js      # Serverless entry point
├── controllers/
│   ├── chatController.js
│   └── userController.js
├── models/
│   ├── Chat.js
│   └── User.js
├── routes/
│   ├── chatRoutes.js
│   └── userRoutes.js
├── services/
│   └── openaiService.js
├── middlewares/
│   └── auth.js
├── config/
│   ├── openai.js
│   └── passport.js
├── utils/
│   └── mongodb.js
├── index.js          # Local development entry
└── package.json
```

## 🔌 API Endpoints

### Authentication

- `GET /api/users/auth/google` - Initiate Google OAuth
- `GET /api/users/auth/google/callback` - OAuth callback
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile

### Chat Management

- `GET /api/chats/welcome/:chatType` - Get welcome message
- `POST /api/chats/create` - Create new chat
- `POST /api/chats/:chatId/message` - Send message to chat
- `GET /api/chats/user` - Get user's chats
- `GET /api/chats/:chatId` - Get specific chat
- `DELETE /api/chats/:chatId` - Delete chat

### Chat History

- `GET /api/chats/history` - Get comprehensive chat history
- `GET /api/chats/statistics` - Get chat statistics
- `POST /api/chats/:chatId/bookmark` - Toggle bookmark
- `GET /api/chats/:chatId/export` - Export chat

## 🤖 AI Integration

The backend integrates with Groq API to provide:

- **Mental Health Support** - Specialized prompts for mental health conversations
- **Spiritual Guidance** - Tailored responses for spiritual questions
- **Context Awareness** - Maintains conversation context
- **Response Generation** - Intelligent, empathetic responses

## 🔐 Authentication Flow

1. User clicks "Sign in with Google" on frontend
2. Frontend redirects to `/api/users/auth/google`
3. Google OAuth handles authentication
4. Backend creates/updates user in MongoDB
5. JWT token issued and stored in httpOnly cookie
6. User authenticated for subsequent requests

## 💾 Database Schema

### User Model

```javascript
{
  googleId: String,
  name: String,
  email: String,
  picture: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Chat Model

```javascript
{
  userId: ObjectId,
  title: String,
  chatType: String, // 'mental-health', 'spiritual', 'general'
  subCategory: String,
  messages: [{
    role: String, // 'user', 'assistant'
    content: String,
    timestamp: Date
  }],
  isBookmarked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Serverless function** configured in `api/index.js`
2. **Environment variables** set in Vercel dashboard
3. **MongoDB Atlas** recommended for production database
4. **Domain configuration** for CORS settings

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start MongoDB (if running locally)
mongod

# Start development server
npm run dev
```

## 🔧 Development

### Adding New Routes

1. Create controller in `controllers/`
2. Add routes in `routes/`
3. Import routes in `index.js`

### Database Operations

- Use Mongoose models in `models/`
- Follow existing patterns for queries
- Handle errors appropriately

### AI Integration

- Modify `services/openaiService.js`
- Update prompts for different chat types
- Test responses thoroughly

## 🔒 Security Features

- **CORS** configured for frontend domain
- **JWT** secure token-based authentication
- **Environment variables** for sensitive data
- **Input validation** on all endpoints
- **Error handling** without exposing internals

## 🤝 Contributing

1. Follow existing code structure
2. Add proper error handling
3. Update documentation for new endpoints
4. Test authentication flows
5. Validate with different user scenarios

## 📄 License

This project is part of the Serenity AI application.
