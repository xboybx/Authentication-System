import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, KeyRound, OctagonAlert, RectangleEllipsis, User, Lock } from 'lucide-react';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    setSuccess(false);

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
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
        <h2 className="mb-5  flex items-center gap-2 justify-center text-[1.75rem] font-bold text-center tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          <KeyRound /> Register
        </h2>

        {error && (
          <div className="px-5 flex items-center gap-2 py-4 mb-5 rounded-xl border animate-slideDown text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--error-color)',
              borderColor: 'var(--error-color)'
            }}>
            <OctagonAlert /> {error}
          </div>
        )}

        {success && (
          <div className="px-5 py-4 mb-5 rounded-xl border animate-slideDown text-sm"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--success-color)',
              borderColor: 'var(--success-color)'
            }}>
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-[18px]">
            <label htmlFor="name"
              className="block mb-2 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <User size={12} /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5"
              disabled={loading}
              placeholder="Enter your full name"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                borderColor: errors.name ? 'var(--error-color)' : 'var(--glass-border)',
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
                if (!errors.name) {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.name && (
              <span className="mt-1.5 text-[13px] font-medium block animate-shake"
                style={{ color: 'var(--error-color)' }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-[18px]">
            <label htmlFor="email"
              className="block mb-2 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5"
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

          {/* Password Field */}
          <div className="mb-[18px]">
            <label htmlFor="password"
              className="block mb-2 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <RectangleEllipsis size={12} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5"
              disabled={loading}
              placeholder="Create a strong password"
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

          {/* Confirm Password Field */}
          <div className="mb-[18px]">
            <label htmlFor="confirmPassword"
              className="block mb-2 flex items-center gap-2 font-semibold text-xs tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}>
              <Lock size={12} /> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-[18px] py-3.5 border-[1.5px] rounded-xl text-base font-sans transition-all duration-300 focus:-translate-y-0.5"
              disabled={loading}
              placeholder="Re-enter your password"
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                borderColor: errors.confirmPassword ? 'var(--error-color)' : 'var(--glass-border)',
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
                if (!errors.confirmPassword) {
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {errors.confirmPassword && (
              <span className="mt-1.5 text-[13px] font-medium block animate-shake"
                style={{ color: 'var(--error-color)' }}>
                {errors.confirmPassword}
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
            {loading ? ' Registering...' : ' Register'}
          </button>
        </form>

        <p className="mt-6 text-center"
          style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login"
            className="font-semibold"
            style={{ color: 'var(--text-primary)' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;