import { Home, Plus, Users, Bed } from 'lucide-react';

export default function HostelPage() {
  const demoHostels = [
    { id: 1, name: 'দারুস সালাম হোস্টেল', type: 'ছাত্র', capacity: 60, occupied: 48, rooms: 15 },
    { id: 2, name: 'নূরুল হুদা হোস্টেল', type: 'ছাত্র', capacity: 40, occupied: 35, rooms: 10 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">হোস্টেল</h1>
          <p className="page-subtitle">আবাসন ব্যবস্থাপনা ও রুম বরাদ্দ</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> নতুন হোস্টেল
        </button>
      </div>

      <div className="grid grid-2">
        {demoHostels.map((hostel) => {
          const occupancyRate = Math.round((hostel.occupied / hostel.capacity) * 100);
          return (
            <div key={hostel.id} className="card animate-slide-up">
              <div className="flex-between mb-16">
                <h3 style={{ fontSize: '1.25rem' }}>{hostel.name}</h3>
                <span className="badge badge-active">{hostel.type}</span>
              </div>

              <div className="grid grid-3 mb-16">
                <div className="text-center">
                  <div className="text-muted text-sm">মোট ধারণক্ষমতা</div>
                  <div className="font-semibold" style={{ fontSize: '1.5rem' }}>{hostel.capacity}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-sm">বর্তমান আসন</div>
                  <div className="font-semibold" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{hostel.occupied}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted text-sm">খালি আসন</div>
                  <div className="font-semibold" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{hostel.capacity - hostel.occupied}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '16px' }}>
                <div className="flex-between text-sm mb-8">
                  <span className="text-muted">অকুপেন্সি রেট</span>
                  <span className="font-semibold">{occupancyRate}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-secondary)' }}>
                  <div style={{ width: `${occupancyRate}%`, height: '100%', borderRadius: '4px', background: occupancyRate > 90 ? 'var(--danger)' : 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary flex-1">
                  <Bed size={14} /> রুম বিবরণ
                </button>
                <button className="btn btn-primary flex-1">
                  <Users size={14} /> আবাসিকরা
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
