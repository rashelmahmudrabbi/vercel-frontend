import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Shield, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, token } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      {/* বাম পাশ — Hero */}
      <div className="login-hero">
        <div className="login-hero-content animate-fade-in">
          <div className="login-hero-icon">📖</div>
          <h1>মাদ্রাসা ম্যানেজমেন্ট সিস্টেম</h1>
          <p>
            আপনার প্রতিষ্ঠানের সম্পূর্ণ পরিচালনা একটি মাত্র প্ল্যাটফর্মে।
            ছাত্র ভর্তি থেকে ফলাফল প্রকাশ, ফি ব্যবস্থাপনা থেকে হিফজ অগ্রগতি —
            সবকিছু সহজে পরিচালনা করুন।
          </p>

          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon">
                <Users size={16} />
              </div>
              <span>ছাত্র, শিক্ষক ও অভিভাবক ব্যবস্থাপনা</span>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <GraduationCap size={16} />
              </div>
              <span>পরীক্ষা, ফলাফল ও হিফজ অগ্রগতি ট্র্যাকিং</span>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <BookOpen size={16} />
              </div>
              <span>উপস্থিতি, হোমওয়ার্ক ও পাঠ পরিকল্পনা</span>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <Shield size={16} />
              </div>
              <span>নিরাপদ ও ভূমিকা-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ডান পাশ — লগ ইন ফর্ম */}
      <div className="login-form-side">
        <div className="login-form-container animate-slide-up">
          <h2 className="login-form-title">লগ ইন করুন</h2>
          <p className="login-form-subtitle">
            আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
          </p>

          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: 'var(--border-radius-sm)',
                marginBottom: '20px',
                fontSize: '0.875rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                ইমেইল, ফোন নম্বর বা ইউজারনেম
              </label>
              <input
                id="login-email"
                type="text"
                className="form-input"
                placeholder="আপনার ইমেইল, ফোন নম্বর বা ইউজারনেম দিন"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                পাসওয়ার্ড
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-remember">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                মনে রাখুন
              </label>
              <a href="#" onClick={(e) => e.preventDefault()}>
                পাসওয়ার্ড ভুলে গেছেন?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                  প্রবেশ করা হচ্ছে...
                </>
              ) : (
                'লগ ইন করুন'
              )}
            </button>
          </form>

          <div className="login-divider">অথবা</div>

          <div style={{ textAlign: 'center', fontSize: '0.813rem', color: 'var(--text-muted)' }}>
            ডেমো অ্যাকাউন্ট: <strong style={{ color: 'var(--text-secondary)' }}>admin@madrasah.com</strong> / <strong style={{ color: 'var(--text-secondary)' }}>admin123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
