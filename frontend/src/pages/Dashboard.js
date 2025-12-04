import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/authService';
import { UserRound, OctagonAlert, RefreshCcw, Check, X, Zap, LockKeyhole, LogOut, LayoutDashboard } from 'lucide-react';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.getProfile();
      // console.log('Dashboard profile:', response.data.user.avatar);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] w-full mx-auto px-7 py-4">
        <div className="max-w-[480px] w-full mx-auto my-2.5 mb-7 p-7 rounded-2xl border"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--blur-amount))',
            WebkitBackdropFilter: 'blur(var(--blur-amount))',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 20px 60px var(--shadow-color)'
          }}>
          <p className="text-center text-lg"
            style={{ color: 'var(--text-primary)' }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] w-full mx-auto px-7 py-4">
        <div className="max-w-[480px] w-full mx-auto my-2.5 mb-7 p-7 rounded-2xl border"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--blur-amount))',
            WebkitBackdropFilter: 'blur(var(--blur-amount))',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 20px 60px var(--shadow-color)'
          }}>
          <div className="px-5 py-4 rounded-xl border text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--error-color)',
              borderColor: 'var(--error-color)'
            }}>
            <h3 className="text-lg mb-2 font-semibold flex items-center gap-2"><OctagonAlert /> Error</h3>
            <p>{error}</p>
            <button onClick={fetchProfile}
              className="px-7 py-3.5 flex items-center gap-2 border rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 mt-4"
              style={{
                background: 'var(--accent-primary)',
                color: 'var(--accent-secondary)',
                boxShadow: '0 8px 24px var(--shadow-color)',
                borderColor: 'var(--accent-primary)'
              }}>
              <RefreshCcw /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayUser = profile || user;


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
        <h2 className="mb-5  flex items-center gap-2 text-[1.75rem] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}>
          <LayoutDashboard /> Dashboard
        </h2>

        {/* User Info - Full Width */}
        <div className="p-[18px] rounded-2xl mb-[18px] border transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 8px 24px var(--shadow-color)'
          }}>
          <h3 className="mb-3 text-lg flex items-center gap-2 font-semibold"
            style={{ color: 'var(--text-primary)' }}>
            <UserRound /> User Information
          </h3>
          {/*AVATAR IMAGE */}
          <span>  {displayUser?.avatar && (
            <img src={displayUser.avatar} alt="User Avatar" className="w-20 h-20 rounded-lg ml-4 mb-4" />
          )}</span>
          <p className="my-2 text-[0.9375rem] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {displayUser?.name}
          </p>
          <p className="my-2 text-[0.9375rem] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> {displayUser?.email}
          </p>
          <p className="my-2 text-[0.9375rem] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Role:</strong>{' '}
            <span className="px-2.5 py-0.5 rounded-lg uppercase text-xs font-semibold"
              style={{ background: 'var(--glass-bg)' }}>
              {displayUser?.role}
            </span>
          </p>
          <p className="my-2 text-[0.9375rem] flex items-center gap-2 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Account Status:</strong>{' '}
            {displayUser?.isActive ?
              <span style={{ color: 'var(--success-color)' }}> Active</span> :
              <span style={{ color: 'var(--error-color)' }}> Inactive</span>
            }
          </p>
          {displayUser?.lastLogin && (
            <p className="my-2 text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Last Login:</strong> {new Date(displayUser.lastLogin).toLocaleString()}
            </p>
          )}
          <p className="my-2 text-[0.9375rem] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Member Since:</strong> {new Date(displayUser?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Grid Layout for Actions and Security Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Quick Actions */}
          <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
              boxShadow: '0 8px 24px var(--shadow-color)'
            }}>
            <h3 className="mb-3 text-lg flex items-center gap-2 font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              <Zap /> Quick Actions
            </h3>
            <div className="flex flex-col gap-3 mt-3">
              <button onClick={fetchProfile}
                className="w-full px-7 py-3.5 flex items-center justify-center gap-2 border rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'var(--accent-primary)',
                  color: 'var(--accent-secondary)',
                  boxShadow: '0 8px 24px var(--shadow-color)',
                  borderColor: 'var(--accent-primary)'
                }}>
                <RefreshCcw /> Refresh Profile
              </button>
              <button onClick={handleLogout}
                className="w-full px-3.5 py-2 flex items-center justify-center gap-2 border-[1.5px] rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'transparent',
                  color: 'var(--error-color)',
                  borderColor: 'var(--error-color)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--error-color)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'var(--error-color)';
                }}>
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>

          {/* Security Information */}
          <div className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
              boxShadow: '0 8px 24px var(--shadow-color)'
            }}>
            <h3 className="mb-3  flex items-center gap-2 text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}>
              <LockKeyhole /> Security Information
            </h3>
            <div className="mt-3">
              <p className="my-2  flex items-center gap-2  text-[0.9375rem]"
                style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Authentication Status:</strong>{' '}
                <Check size={16} style={{ color: 'var(--success-color)' }} />
                <span style={{ color: 'var(--success-color)' }}>Authenticated</span>
              </p>
              <p className="my-2 flex items-center gap-2 text-[0.9375rem]"
                style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Access Token:</strong>{' '}
                {AuthService.getAccessToken() ? (
                  <>
                    <Check size={16} style={{ color: 'var(--success-color)' }} />
                    <span style={{ color: 'var(--success-color)' }}>Present</span>
                  </>
                ) : (
                  <>
                    <X size={16} style={{ color: 'var(--error-color)' }} />
                    <span style={{ color: 'var(--error-color)' }}>Missing</span>
                  </>
                )}
              </p>
              <p className="my-2 flex items-center gap-2 text-[0.9375rem]"
                style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Refresh Token:</strong>{' '}
                {AuthService.getRefreshToken() ? (
                  <>
                    <Check size={16} style={{ color: 'var(--success-color)' }} />
                    <span style={{ color: 'var(--success-color)' }}>Present</span>
                  </>
                ) : (
                  <>
                    <X size={16} style={{ color: 'var(--error-color)' }} />
                    <span style={{ color: 'var(--error-color)' }}>Missing</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;