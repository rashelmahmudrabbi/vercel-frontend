import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  ClipboardCheck,
  FileText,
  BookOpenCheck,
  ArrowUpRight,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, getUserTypeLabel } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, graduated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/students/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.log('Stats fetch failed');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'সুপ্রভাত';
    if (hour < 17) return 'শুভ অপরাহ্ন';
    if (hour < 20) return 'শুভ সন্ধ্যা';
    return 'শুভ রাত্রি';
  };

  const userName = user?.fullName || user?.firstName || user?.username || '';

  const activities = [
    { text: 'আহমাদ হাসান প্রথম শ্রেণিতে ভর্তি হয়েছে', time: '১০ মিনিট আগে', color: 'teal' },
    { text: 'পঞ্চম শ্রেণির উপস্থিতি চিহ্নিত করা হয়েছে', time: '৩০ মিনিট আগে', color: 'blue' },
    { text: 'জানুয়ারি মাসের ফি চালান তৈরি হয়েছে', time: '১ ঘণ্টা আগে', color: 'amber' },
    { text: 'অষ্টম শ্রেণির মডেল টেস্ট ফলাফল প্রকাশিত', time: '২ ঘণ্টা আগে', color: 'green' },
    { text: 'হিফজ বিভাগে ৩ জন নতুন ছাত্র ভর্তি হয়েছে', time: '৩ ঘণ্টা আগে', color: 'teal' },
  ];

  return (
    <div className="animate-fade-in">
      {/* স্বাগত বার্তা */}
      <div className="dashboard-welcome">
        <h2>{greeting()}, {userName}! 👋</h2>
        <p>
          আজকের তারিখ: {new Date().toLocaleDateString('bn-BD', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {' • '}
          ভূমিকা: {getUserTypeLabel()}
        </p>

        <div className="dashboard-quick-actions">
          <button className="quick-action-btn" onClick={() => navigate('/students/new')}>
            <Plus size={14} /> নতুন ছাত্র ভর্তি
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/attendance')}>
            <ClipboardCheck size={14} /> উপস্থিতি চিহ্নিত
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/exams')}>
            <FileText size={14} /> নম্বর এন্ট্রি
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/hifz')}>
            <BookOpenCheck size={14} /> হিফজ অগ্রগতি
          </button>
        </div>
      </div>

      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-4 mb-24">
        <div className="stats-card animate-slide-up stagger-1">
          <div className="stats-card-icon teal">
            <GraduationCap size={24} />
          </div>
          <div className="stats-card-value">{stats.total}</div>
          <div className="stats-card-label">মোট ছাত্র/ছাত্রী</div>
          <div className="stats-card-trend up">
            <TrendingUp size={12} /> +১২%
          </div>
        </div>

        <div className="stats-card animate-slide-up stagger-2">
          <div className="stats-card-icon green">
            <UserCheck size={24} />
          </div>
          <div className="stats-card-value">{stats.active}</div>
          <div className="stats-card-label">সক্রিয় ছাত্র/ছাত্রী</div>
          <div className="stats-card-trend up">
            <TrendingUp size={12} /> +৮%
          </div>
        </div>

        <div className="stats-card animate-slide-up stagger-3">
          <div className="stats-card-icon blue">
            <Users size={24} />
          </div>
          <div className="stats-card-value">১৮</div>
          <div className="stats-card-label">মোট শিক্ষক</div>
          <div className="stats-card-trend up">
            <TrendingUp size={12} /> +২
          </div>
        </div>

        <div className="stats-card animate-slide-up stagger-4">
          <div className="stats-card-icon amber">
            <CreditCard size={24} />
          </div>
          <div className="stats-card-value">৳২.৫L</div>
          <div className="stats-card-label">এ মাসের আদায়</div>
          <div className="stats-card-trend down">
            <TrendingDown size={12} /> -৫%
          </div>
        </div>
      </div>

      {/* নিচের সেকশন */}
      <div className="grid grid-2">
        {/* সাম্প্রতিক কার্যক্রম */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="card-header">
            <h3 className="card-title">সাম্প্রতিক কার্যক্রম</h3>
            <button className="btn btn-ghost btn-sm">সব দেখুন</button>
          </div>
          <div>
            {activities.map((act, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-dot ${act.color}`}></div>
                <div>
                  <div className="activity-text">{act.text}</div>
                  <div className="activity-time">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* দ্রুত তথ্য */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <h3 className="card-title">আজকের সারসংক্ষেপ</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(20, 184, 166, 0.06)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(20, 184, 166, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
                  উপস্থিতির হার
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Inter' }}>
                  ৯৪.৫%
                </div>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: `conic-gradient(var(--primary-500) 94.5%, var(--border-color) 0)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.688rem',
                  fontWeight: 700,
                  color: 'var(--primary-400)',
                }}>
                  ৯৫%
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(245, 158, 11, 0.06)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
                  বকেয়া ফি
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Inter' }}>
                  ৳৪৫,০০০
                </div>
              </div>
              <span className="badge badge-warning">১২ জন</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(34, 197, 94, 0.06)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(34, 197, 94, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
                  হিফজ সম্পন্ন (এ বছর)
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Inter' }}>
                  ৫ জন
                </div>
              </div>
              <span className="badge badge-success">🎉 মাশাআল্লাহ</span>
            </div>

            <button
              className="btn btn-secondary w-full mt-8"
              onClick={() => navigate('/students')}
            >
              ছাত্র তালিকা দেখুন <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
