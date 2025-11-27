import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
const Home = () => {
  return (
    <div className="max-w-[1400px] w-full mx-auto px-7 py-4">
      <div className="w-full mx-auto p-5 rounded-2xl border animate-slideUp"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--blur-amount))',
          WebkitBackdropFilter: 'blur(var(--blur-amount))',
          borderColor: 'var(--glass-border)',
          boxShadow: '0 20px 60px var(--shadow-color), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
        <h1 className="mb-5 text-[1.75rem] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          Welcome to Secure Authentication System
        </h1>

        {/* Grid Layout for side-by-side content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
          {/* Features Section */}
          <div className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
              boxShadow: '0 8px 24px var(--shadow-color)'
            }}>
            <h2 className="text-2xl  flex items-center gap-2 mb-5 font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              <Sparkles />Features
            </h2>
            <ul className="pl-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              <li>🔒 Secure user registration with email validation</li>
              <li>💪 Strong password requirements</li>
              <li>🎫 JWT-based authentication</li>
              <li>🔄 Token rotation and secure storage</li>
              <li>⏱️ Rate limiting on auth endpoints</li>
              <li>✅ Input validation and sanitization</li>
              <li>👥 Role-based access control</li>
              <li>🛡️ Comprehensive error handling</li>
              <li>🔐 Security headers and CORS</li>
            </ul>
          </div>

          {/* Technology Stack Section */}
          <div className="p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
              boxShadow: '0 8px 24px var(--shadow-color)'
            }}>
            <h2 className="text-2xl  flex items-center gap-2 mb-5 font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              <Zap /> Technology Stack
            </h2>
            <h3 className="text-lg mt-5 mb-3 font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              Backend:
            </h3>
            <ul className="pl-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              <li>Node.js with Express.js</li>
              <li>MongoDB with Mongoose ODM</li>
              <li>JWT for authentication</li>
              <li>bcrypt for password hashing</li>
              <li>express-validator</li>
              <li>helmet for security headers</li>
            </ul>

            <h3 className="text-lg mt-5 mb-3 font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              Frontend:
            </h3>
            <ul className="pl-5 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              <li>React 18</li>
              <li>React Router for navigation</li>
              <li>Context API for state</li>
              <li>Axios for API calls</li>
              <li>Protected routes flow</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;