import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { User, UserLock } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-[1000] py-3 mb-5 transition-all duration-300 border-b shadow-md"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--blur-amount))',
        WebkitBackdropFilter: 'blur(var(--blur-amount))',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 4px 16px var(--shadow-color)'
      }}>
      <div className="max-w-[1400px] w-full mx-auto px-7 flex justify-between items-center flex-wrap gap-3">
        <h1 className="m-0 text-2xl font-bold tracking-tight transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}>
          <Link to="/" className="transition-opacity duration-300 hover:opacity-80 flex items-center gap-2"
            style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
            <UserLock /> Auth System
          </Link>
        </h1>

        <div className="flex gap-4 items-center">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="px-4 py-2 rounded-xl flex items-center gap-2 border font-medium animate-fadeIn"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)'
                }}>
                <User /> {user?.name}
              </span>
              <Link to="/dashboard"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }}>
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="px-3.5 py-2 border-[1.5px] rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 inline-block font-sans tracking-wide relative overflow-hidden"
                style={{
                  background: 'transparent',
                  color: 'var(--error-color)',
                  borderColor: 'var(--error-color)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--error-color)';
                  e.target.style.color = 'white';
                  e.target.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--error-color)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }}>
                Login
              </Link>
              <Link to="/register"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--glass-bg)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;