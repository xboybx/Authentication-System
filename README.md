# Secure Authentication System

A production-ready authentication system built with Node.js, Express.js, React, and MongoDB featuring JWT tokens, refresh token mechanism, and comprehensive security measures.

## Links

🔗 **GitHub Repository**: [https://github.com/yourusername/secure-auth-system](https://github.com/yourusername/secure-auth-system)

🚀 **Live Demo**: [https://secure-auth-demo.vercel.app](https://secure-auth-demo.vercel.app)

## Features

### Backend Features
- **Secure Registration & Login** with email validation and strong password requirements
- **JWT Authentication** with separate access and refresh tokens
- **Token Rotation** for enhanced security
- **Rate Limiting** on authentication endpoints
- **Input Validation** and sanitization
- **Role-based Access Control**
- **Comprehensive Error Handling**
- **Security Headers** and CORS protection
- **MongoDB Integration** with Mongoose ODM
- **Structured Logging** with Winston

### Frontend Features
- **React 18** with modern hooks and context API
- **Protected Routes** and authentication flow
- **Automatic Token Refresh**
- **Responsive Design**
- **Form Validation**
- **Error Handling**

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: winston

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS with responsive design

## Project Structure

```
/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── security.js
│   ├── models/
│   │   ├── User.js
│   │   └── RefreshToken.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── logger.js
│   ├── validators/
│   │   └── authValidators.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

## Flow of the auth Tokens 
┌──────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                  │
│ POST /login                                               │
│ Body: { email, password }                                 │
│                                                           │
│ Response:                                                 │
│ ├─ Short Token (15min) ← Use for API calls              │
│ └─ Long Token (7days)  ← Save for later refreshing      │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│ 2. USE SHORT TOKEN                                        │
│ GET /profile                                              │
│ Headers: { Authorization: "Bearer short_token" }          │
│                                                           │
│ 15 minutes later...                                       │
│ ❌ Short token expired!                                   │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│ 3. REFRESH (Get New Short Token)                         │
│ POST /refresh                                             │
│ Body: { refreshToken: "long_token" }                      │
│                                                           │
│ You SEND: Long token (7d) ───────────────┐               │
│                                           │               │
│ You GET:                                  │               │
│ ├─ NEW Short Token (15min) ◄──────────── WHY /refresh?   │
│ └─ NEW Long Token (7days)                 │               │
│                                           │               │
│ "Refresh" means: Use long token to       │               │
│                  REFRESH the short token ┘               │
└──────────────────────────────────────────────────────────┘
              ↓ (Repeat every 15min)
┌──────────────────────────────────────────────────────────┐
│ 4. LOGOUT                                                 │
│ POST /logout                                              │
│ Body: { refreshToken: "long_token" }                      │
│                                                           │
│ Server marks long token as REVOKED                        │
│ → Can't refresh anymore                                   │
│ → Must login again                                        │
└──────────────────────────────────────────────────────────┘

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/auth-system

# JWT Secrets (Generate strong secrets for production)
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

5. Start MongoDB service

6. Run the backend:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/auth
```

5. Run the frontend:
```bash
npm start
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout User
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Security Features

### Password Security
- **Bcrypt Hashing** with 10 salt rounds
- **Strong Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### JWT Security
- **Separate Secrets** for access and refresh tokens
- **Short-lived Access Tokens** (15 minutes)
- **Long-lived Refresh Tokens** (7 days)
- **Token Rotation** on refresh
- **Secure Token Storage** in database

### HTTP Security
- **Helmet.js** for security headers
- **CORS Configuration** with whitelist
- **Rate Limiting** on auth endpoints
- **Input Validation** and sanitization
- **Request Logging** without sensitive data

### Database Security
- **Parameterized Queries** (Mongoose)
- **Indexed Fields** for performance
- **Soft Delete** capability
- **Connection Pooling**

## Environment Variables

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/auth-system

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Security
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/auth
REACT_APP_ENV=development
```

## Development Guidelines

### Code Style
- Use async/await for asynchronous operations
- Implement proper error handling with try/catch
- Follow RESTful API conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Security Best Practices
- Never commit secrets to version control
- Use environment variables for configuration
- Validate all user inputs
- Implement rate limiting
- Log security events
- Keep dependencies updated

### Testing
- Test all API endpoints
- Verify authentication flow
- Check error handling
- Test token refresh mechanism
- Validate input constraints

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure production database
4. Set up HTTPS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting
3. Configure environment variables
4. Set up HTTPS
5. Configure CDN for assets

## Monitoring & Maintenance

### Health Checks
- Database connectivity
- Token expiration monitoring
- Error rate tracking
- Performance metrics

### Regular Tasks
- Rotate JWT secrets periodically
- Clean up expired tokens
- Monitor security logs
- Update dependencies
- Review access patterns

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check MongoDB service status
- Verify connection string
- Check network connectivity

**JWT Verification Failed**
- Verify JWT secrets match
- Check token expiration
- Validate token format

**CORS Errors**
- Check frontend URL configuration
- Verify CORS settings
- Check request headers

**Rate Limiting**
- Monitor request frequency
- Check rate limit configuration
- Review IP whitelist

## Support

For issues and questions:
 mailto:jeswanth0127@gmail.com