import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const VALID_EMAIL = 'robert.farrugia@lognormal.io';
  const VALID_PASSWORD = 'welovefalcon';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin();
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '448px', width: '100%' }}>
        {/* Login Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          border: '1px solid #e5e7eb'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <img src="/Falcondive.svg" alt="Falcon Dive" style={{ width: '240px', height: 'auto' }} />
          </div>

          {/* Welcome Text */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Sign in to your analytics dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '12px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <Mail size={20} style={{ color: '#9ca3af' }} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '12px',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <Lock size={20} style={{ color: '#9ca3af' }} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '12px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#9ca3af' : '#6366f1',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = '#6366f1';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span>Signing in...</span>
                  <style>{`
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0' }}>
              Email: robert.farrugia@lognormal.io
            </p>
            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0' }}>
              Password: welovefalcon
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Powered by Falcon Dive &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
