import { useState } from 'react';
import { Settings as SettingsIcon, Building2, Palette, Shield, Database, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('institution');

  const sections = [
    { key: 'institution', label: 'প্রতিষ্ঠান তথ্য', icon: Building2 },
    { key: 'appearance', label: 'ডিজাইন ও থিম', icon: Palette },
    { key: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { key: 'security', label: 'নিরাপত্তা', icon: Shield },
    { key: 'backup', label: 'ব্যাকআপ ও ডেটা', icon: Database },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">সেটিংস</h1>
          <p className="page-subtitle">সিস্টেম কনফিগারেশন এবং প্রাতিষ্ঠানিক সেটিংস</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Settings Navigation */}
        <div className="card" style={{ padding: '8px' }}>
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeSection === sec.key ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeSection === sec.key ? 'var(--primary)' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: activeSection === sec.key ? 600 : 400,
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <sec.icon size={18} />
              {sec.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="card">
          {activeSection === 'institution' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>প্রতিষ্ঠান তথ্য</h2>
              <div className="grid grid-2" style={{ gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">প্রতিষ্ঠানের নাম</label>
                  <input type="text" className="form-input" defaultValue="দারুল উলূম মাদ্রাসা" />
                </div>
                <div className="form-group">
                  <label className="form-label">প্রতিষ্ঠানের ধরন</label>
                  <select className="form-input">
                    <option>কওমি মাদ্রাসা</option>
                    <option>আলিয়া মাদ্রাসা</option>
                    <option>হাফেজিয়া মাদ্রাসা</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ইমেইল</label>
                  <input type="email" className="form-input" defaultValue="info@darululoom.edu.bd" />
                </div>
                <div className="form-group">
                  <label className="form-label">ফোন নম্বর</label>
                  <input type="text" className="form-input" defaultValue="+৮৮০১৭XXXXXXXX" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">ঠিকানা</label>
                  <textarea className="form-input" rows="3" defaultValue="ঢাকা, বাংলাদেশ"></textarea>
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary">সংরক্ষণ করুন</button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>ডিজাইন ও থিম</h2>
              <div className="form-group">
                <label className="form-label">থিম</label>
                <div className="flex gap-16">
                  <div style={{ padding: '20px 30px', borderRadius: '12px', background: '#0f172a', border: '2px solid var(--primary)', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 600 }}>ডার্ক</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>বর্তমান</div>
                  </div>
                  <div style={{ padding: '20px 30px', borderRadius: '12px', background: '#f8fafc', border: '2px solid transparent', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ color: '#1e293b', fontWeight: 600 }}>লাইট</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>শীঘ্রই আসছে</div>
                  </div>
                </div>
              </div>
              <div className="form-group mt-24">
                <label className="form-label">প্রাইমারি কালার</label>
                <div className="flex gap-12">
                  {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'].map((color) => (
                    <div
                      key={color}
                      style={{
                        width: '40px', height: '40px', borderRadius: '50%', background: color,
                        cursor: 'pointer', border: color === '#10b981' ? '3px solid #fff' : '3px solid transparent',
                        boxShadow: color === '#10b981' ? `0 0 0 2px ${color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>নোটিফিকেশন সেটিংস</h2>
              {[
                { label: 'নতুন ভর্তির আবেদন', desc: 'যখন নতুন ছাত্র ভর্তির আবেদন আসবে' },
                { label: 'পেমেন্ট নোটিফিকেশন', desc: 'যখন ফি গ্রহণ বা বকেয়া হবে' },
                { label: 'উপস্থিতি এলার্ট', desc: 'যখন কোনো ছাত্র ৩ দিনের বেশি অনুপস্থিত থাকবে' },
                { label: 'পরীক্ষার ফলাফল', desc: 'পরীক্ষার ফলাফল প্রকাশিত হলে' },
              ].map((item, i) => (
                <div key={i} className="flex-between" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-muted mt-4">{item.desc}</div>
                  </div>
                  <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ display: 'none' }} />
                    <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: 'var(--primary)', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', right: '3px', transition: 'all 0.3s' }}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>নিরাপত্তা সেটিংস</h2>
              <div className="form-group">
                <label className="form-label">বর্তমান পাসওয়ার্ড</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
              <div className="grid grid-2" style={{ gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">নতুন পাসওয়ার্ড</label>
                  <input type="password" className="form-input" placeholder="নতুন পাসওয়ার্ড..." />
                </div>
                <div className="form-group">
                  <label className="form-label">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input type="password" className="form-input" placeholder="আবার লিখুন..." />
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary">পাসওয়ার্ড পরিবর্তন করুন</button>
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>ব্যাকআপ ও ডেটা</h2>
              <div className="card" style={{ background: 'var(--bg-secondary)', marginBottom: '20px' }}>
                <div className="flex-between">
                  <div>
                    <div className="font-semibold">সর্বশেষ ব্যাকআপ</div>
                    <div className="text-sm text-muted mt-4">এখনো কোনো ব্যাকআপ নেওয়া হয়নি</div>
                  </div>
                  <button className="btn btn-primary">ব্যাকআপ নিন</button>
                </div>
              </div>
              <div className="card" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex-between">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--danger)' }}>ডেটা রিসেট</div>
                    <div className="text-sm text-muted mt-4">সতর্কতা: এই অপারেশন অপরিবর্তনীয়</div>
                  </div>
                  <button className="btn" style={{ background: 'var(--danger)', color: '#fff' }}>রিসেট</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
