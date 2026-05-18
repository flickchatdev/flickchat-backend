# FlickChat Backend

> A modern, scalable chat application backend built with **Express.js** and **TypeScript**

## 📱 Project Overview

**FlickChat** is a real-time chat application designed to provide seamless communication between users. The backend is a robust, type-safe REST API built with Node.js and Express, featuring authentication, user management, and extensible architecture for future features like real-time messaging, file sharing, and group chats.

### Key Highlights

- ✅ **Type-Safe**: Full TypeScript support with strict mode enabled
- ✅ **Secure**: Integrated security middleware (Helmet)
- ✅ **Scalable**: Clean architecture with separation of concerns
- ✅ **Well-Logged**: Morgan middleware for HTTP request logging
- ✅ **CORS Enabled**: Built-in cross-origin resource sharing support
- ✅ **Environment Aware**: Configuration management via environment variables

---

## 🛠️ Tech Stack & Dependencies

### Core Framework

- **Express.js** (v5.2.1) - Fast, unopinionated web framework
- **Node.js** - JavaScript runtime
- **TypeScript** (v6.0.3) - Typed superset of JavaScript

### Production Dependencies

| Package   | Version | Purpose                                  |
| --------- | ------- | ---------------------------------------- |
| `express` | 5.2.1   | Web server framework                     |
| `cors`    | 2.8.6   | Cross-Origin Resource Sharing middleware |
| `helmet`  | 8.1.0   | Security middleware (HTTP headers)       |
| `morgan`  | 1.10.1  | HTTP request logger                      |
| `dotenv`  | 17.4.2  | Environment variable management          |

### Development Dependencies

| Package          | Version | Purpose                           |
| ---------------- | ------- | --------------------------------- |
| `typescript`     | 6.0.3   | TypeScript compiler               |
| `tsx`            | 4.22.0  | TypeScript executor (development) |
| `@types/express` | 5.0.6   | TypeScript types for Express      |
| `@types/cors`    | 2.8.19  | TypeScript types for CORS         |
| `@types/morgan`  | 1.9.10  | TypeScript types for Morgan       |
| `@types/node`    | 25.8.0  | TypeScript types for Node.js      |
| `chalk`          | 5.6.2   | Terminal string styling           |

---

## 📁 Folder Structure

```
flickchat-backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── index.ts                  # Application entry point
│   │
│   ├── configs/
│   │   ├── env.config.ts         # Environment variables configuration
│   │   ├── responseMessage.config.ts  # Standardized response messages
│   │   └── index.ts              # Configs exports
│   │
│   ├── controllers/
│   │   ├── authentication.controller.ts  # Auth request handlers
│   │   └── index.ts              # Controllers exports
│   │
│   ├── routes/
│   │   ├── authentication.route.ts  # Auth endpoints routing
│   │   └── index.ts              # Routes exports
│   │
│   ├── services/
│   │   ├── authentication.service.ts  # Auth business logic
│   │   └── index.ts              # Services exports
│   │
│   ├── repository/
│   │   ├── user.repository.ts    # User data access layer
│   │   └── index.ts              # Repository exports
│   │
│   ├── utils/
│   │   └── index.ts              # Utility functions
│   │
│   └── public/                   # Static assets (CSS, images, etc.)
│
├── package.json                  # Project dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                      # Project documentation
```

### Architecture Explanation

The project follows a **layered architecture pattern**:

- **Controllers** - Handle HTTP requests and responses
- **Services** - Contain business logic
- **Repository** - Manage data access and database queries
- **Routes** - Define API endpoints and routing
- **Configs** - Application configuration settings
- **Utils** - Shared utility functions

This separation ensures **maintainability**, **testability**, and **scalability**.

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
NODE_ENV=development
PORT=5000

# JWT access tokens only
ACCESS_SECRET=replace_with_long_random_secret
ACCESS_TOKEN_EXPIRES_IN=15m

# Apple SSO
APPLE_CLIENT_ID=com.your.bundle.id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Step 3: Build TypeScript

```bash
npm run build
```

---

## 📝 Available Scripts

```bash
# Development: Watch TypeScript files and auto-reload server
npm run dev

# Production: Build TypeScript to JavaScript
npm run build

# Production: Start the compiled application
npm start
```

---

## 🌐 API Endpoints

### Health Check

**GET** `/`

```json
{
  "success": true,
  "message": "Server is running successfully",
  "health": "/health",
  "timestamp": "2025-05-16T10:30:00.000Z"
}
```

**GET** `/health`

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-05-16T10:30:00.000Z"
}
```

### Authentication Endpoints

Authentication routes are modular and can be extended with:

- User registration
- Login
- Token refresh
- Logout

Current auth endpoints include:

- `POST /api/auth/social-login` (Apple provider)
- `POST /api/auth/verify-firebase-token` (Firebase ID token + optional FCM token validation)
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

---

## ⚙️ Configuration Details

### TypeScript Configuration

The project uses **strict TypeScript settings** for type safety:

```json
{
  "target": "ES2022", // Modern ECMAScript version
  "module": "NodeNext", // Node-compatible module system
  "moduleResolution": "NodeNext",
  "strict": true, // Strict type checking
  "esModuleInterop": true, // CommonJS/ES6 interoperability
  "sourceMap": true // Debug support
}
```

### Security Middleware (Helmet)

Automatically sets secure HTTP headers:

- Prevents XSS attacks
- Disables MIME type sniffing
- Handles CSRF protection
- Sets Content Security Policy

### CORS Configuration

Enables cross-origin requests for frontend integration.

### Morgan Logging

Development mode logging for all HTTP requests in format: `dev`

---

## 🧪 Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Watch mode** automatically recompiles: `npm run dev`
3. **Test API** using tools like Postman or cURL
4. **Commit** changes to version control

---

## 📦 Production Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Set environment variables on your hosting platform

---

## 🔒 Security Features

- ✅ **Helmet.js** - Secures HTTP headers
- ✅ **CORS** - Controls cross-origin requests
- ✅ **Environment Variables** - Protects sensitive data
- ✅ **TypeScript** - Prevents runtime type errors
- ✅ **Morgan Logging** - Tracks all API requests

---

## 🚧 Future Enhancements

- [ ] Real-time messaging with WebSocket
- [ ] User authentication (JWT tokens)
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Message persistence
- [ ] File upload support
- [ ] Group chat functionality
- [ ] Unit & integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting
- [ ] Notification system

---

## 📞 Support & Contributing

For issues, feature requests, or contributions, please open a GitHub issue or submit a pull request.

---

## 📄 License

ISC License - See `package.json` for details.

---

**Happy Coding! 🚀**
