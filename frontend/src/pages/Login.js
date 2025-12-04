import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, OctagonAlert, RectangleEllipsis } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from "firebase/auth";
import { auth, providers } from '../utils/firebase.config';
import AuthService from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, isAuthenticated, error, clearError, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  //Handling GoogleSignup
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const result = await signInWithPopup(auth, providers);
      const user = result.user;


      const userData = {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        avatar: user.photoURL,

      };
      const data = await AuthService.googleSignUp(userData);

      if (data.success) {
        googleLogin(data.data.user);//THIS IS THE USER DATA FOR AUTHENTICATION TO AUTH CONTEXT
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setErrors({ form: data.message || 'Google login failed' });
      }


    } catch (error) {
      console.error('Google Sign Up Error:', error);
      setErrors({ form: error.message || 'An error occurred during Google sign-up' });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError(); // Clear any previous errors

    await login(formData); // Call login - errors are handled in AuthContext

    setLoading(false);

    // If login was successful, navigate to dashboard
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-7 py-4">
      <div className="max-w-[480px] w-full mx-auto my-2.5 mb-7 p-7 rounded-2xl border animate-slideUp"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--blur-amount))',
          WebkitBackdropFilter: 'blur(var(--blur-amount))',
          borderColor: 'var(--glass-border)',
          boxShadow: '0 20px 60px var(--shadow-color), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
        <h2 className="mb-5 flex items-center gap-2 justify-center text-[1.75rem] font-bold text-center tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          <KeyRound /> Login
        </h2>

        {error && (
          <div className="px-5 py-4 mb-5 flex items-center gap-2 rounded-xl border animate-slideDown text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--error-color)',
              borderColor: 'var(--error-color)'
            }}>
            <OctagonAlert size={12} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-[18px]">
            <label htmlFor="email"
              className="flex items-center gap-2 mb-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <Mail size={15} /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5 ${errors.email ? 'error' : ''}`}
              disabled={loading}
              placeholder="Enter your email"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                borderColor: errors.email ? 'var(--error-color)' : 'var(--glass-border)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.background = 'var(--bg-secondary)';
                e.target.style.boxShadow = '0 4px 12px var(--shadow-color)';
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.email && (
              <span className="mt-1.5 text-[13px] font-medium block animate-shake"
                style={{ color: 'var(--error-color)' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="mb-[18px]">
            <label htmlFor="password"
              className="flex items-center gap-2 mb-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <RectangleEllipsis size={15} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5 ${errors.password ? 'error' : ''}`}
              disabled={loading}
              placeholder="Enter your password"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                borderColor: errors.password ? 'var(--error-color)' : 'var(--glass-border)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.background = 'var(--bg-secondary)';
                e.target.style.boxShadow = '0 4px 12px var(--shadow-color)';
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.password && (
              <span className="mt-1.5 text-[13px] font-medium block animate-shake"
                style={{ color: 'var(--error-color)' }}>
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-7 py-3.5 border rounded-xl text-base font-semibold cursor-pointer transition-all duration-[cubic-bezier(0.4,0,0.2,1)] no-underline inline-block font-sans tracking-wide relative overflow-hidden active:scale-95 hover:-translate-y-0.5 w-full mt-2.5"
            disabled={loading}
            style={{
              background: 'var(--accent-primary)',
              color: 'var(--accent-secondary)',
              boxShadow: '0 8px 24px var(--shadow-color)',
              borderColor: 'var(--accent-primary)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transform: loading ? 'none' : ''
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.boxShadow = '0 12px 32px var(--shadow-strong)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 8px 24px var(--shadow-color)';
            }}>
            {loading ? ' Logging in...' : ' Login'}
          </button>
        </form>
        <button
          type="button"
          className="px-7 py-3.5 border rounded-xl text-base font-semibold cursor-pointer transition-all duration-[cubic-bezier(0.4,0,0.2,1)] no-underline inline-block font-sans tracking-wide relative overflow-hidden active:scale-95 hover:-translate-y-0.5 w-full mt-2.5"
          disabled={loading}
          style={{
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            boxShadow: '0 8px 24px var(--shadow-color)',
            borderColor: 'var(--glass-border)',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            transform: loading ? 'none' : ''
          }}
          onClick={handleGoogleSignUp}
        >
          {loading ? "Signing up..." : (
            <div className="flex items-center justify-center gap-2">
              <FcGoogle size={24} />
              <span>Sign up with Google</span>
            </div>
          )}
        </button>

        <p className="mt-6 text-center"
          style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register"
            className="font-semibold"
            style={{ color: 'var(--text-primary)' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 