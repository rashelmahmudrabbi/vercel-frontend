import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileText,
  CreditCard,
  Bell,
  MessageSquare,
  Library,
  Home,
  Settings,
  LogOut,
  Search,
  Moon,
  Sun,
  ChevronLeft,
  Menu,
  BookOpenCheck,
  UserCheck,
  Building2,
  Shield,
  BarChart2,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const menuItems = [
  {
    group: 'প্রধান',
    items: [
      { path: '/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    ],
  },
  {
    group: 'শিক্ষা ব্যবস্থাপনা',
    items: [
      { path: '/students', label: 'ছাত্র/ছাত্রী', icon: GraduationCap },
      { path: '/teachers', label: 'শিক্ষকমণ্ডলী', icon: Users },
      { path: '/guardians', label: 'অভিভাবক', icon: UserCheck },
      { path: '/academics', label: 'একাডেমিক', icon: BookOpen },
      { path: '/academics/class-subjects', label: 'শ্রেণি বিষয় ম্যাপিং', icon: BookOpenCheck },
      { path: '/attendance', label: 'উপস্থিতি', icon: ClipboardCheck },
      { path: '/homework', label: 'হোমওয়ার্ক', icon: FileText },
      { path: '/exams', label: 'পরীক্ষা ও ফলাফল', icon: FileText },
      { path: '/hifz', label: 'হিফজ অগ্রগতি', icon: BookOpenCheck },
    ],
  },
  {
    group: 'আর্থিক',
    items: [
      { path: '/fees', label: 'ফি / বেতন', icon: CreditCard },
    ],
  },
  {
    group: 'যোগাযোগ',
    items: [
      { path: '/notices', label: 'নোটিশ', icon: Bell },
      { path: '/messaging', label: 'মেসেজিং', icon: MessageSquare },
    ],
  },
  {
    group: 'অন্যান্য',
    items: [
      { path: '/library', label: 'লাইব্রেরি', icon: Library },
      { path: '/hostel', label: 'হোস্টেল', icon: Home },
      { path: '/settings', label: 'সেটিংস', icon: Settings },
    ],
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUserTypeLabel } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [myPermissions, setMyPermissions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userPermissions') || '{}'); } catch { return {}; }
  });

  // Handle theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch and cache user permissions
  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const res = await api.get('/permissions/me');
        if (res.data.success) {
          const perms = res.data.data;
          localStorage.setItem('userPermissions', JSON.stringify(perms));
          setMyPermissions(perms);
        }
      } catch (_) {}
    };
    if (user) fetchPerms();
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('userPermissions');
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/reports')) return 'রিপোর্ট ও বিশ্লেষণ';
    for (const group of menuItems) {
      for (const item of group.items) {
        if (location.pathname.startsWith(item.path)) {
          return item.label;
        }
      }
    }
    return 'ড্যাশবোর্ড';
  };

  const userInitial = user?.firstName
    ? user.firstName.charAt(0)
    : user?.username?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div>
      {/* সাইডবার */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">م</div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">মাদ্রাসা ERP</div>
            <div className="sidebar-brand-sub">ম্যানেজমেন্ট সিস্টেম</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((group) => {
            // Filter other group items for super_admin specifically, if needed we can add role_management dynamically here
            let items = group.items;
            if (group.group === 'অন্যান্য') {
              if (user?.userType === 'super_admin' || user?.userType === 'co_super_admin') {
                items = [
                  ...group.items,
                  { path: '/reports', label: 'রিপোর্ট ও বিশ্লেষণ', icon: BarChart2 },
                  { path: '/role-management', label: 'রোল ও পারমিশন', icon: Shield },
                ];
              } else if (myPermissions.can_view_reports) {
                items = [...group.items, { path: '/reports', label: 'রিপোর্ট ও বিশ্লেষণ', icon: BarChart2 }];
              }
            }

            return (
              <div key={group.group} className="sidebar-nav-group">
                <div className="sidebar-nav-group-title">{group.group}</div>
                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{userInitial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user?.fullName || user?.firstName || user?.username}
              </div>
              <div className="sidebar-user-role">{getUserTypeLabel()}</div>
            </div>
            <button
              className="btn-ghost btn-icon"
              onClick={handleLogout}
              title="লগ আউট"
              style={{ marginRight: 'auto' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* টপবার */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="topbar-icon-btn"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen);
              }
            }}
            style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
          >
            <Menu size={20} />
          </button>

          <div className="topbar-breadcrumb">
            <Building2 size={16} />
            দারুল উলূম মাদ্রাসা
            <ChevronLeft size={14} style={{ opacity: 0.4 }} />
            <span>{getPageTitle()}</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="topbar-search">
            <Search size={16} />
            <input type="text" placeholder="অনুসন্ধান করুন..." />
          </div>

          <button className="topbar-icon-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          <button className="topbar-icon-btn" onClick={toggleTheme} title="থিম পরিবর্তন করুন">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* মেইন কন্টেন্ট */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* মোবাইল overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
