import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isLoading: false, error: null });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'লগ ইন ব্যর্থ হয়েছে';
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (err) {
      get().logout();
    }
  },

  clearError: () => set({ error: null }),

  isAuthenticated: () => !!get().token,

  getUserTypeLabel: () => {
    const labels = {
      super_admin: 'সুপার অ্যাডমিন',
      co_super_admin: 'কো-সুপার অ্যাডমিন',
      admin: 'অ্যাডমিন',
      principal: 'প্রিন্সিপাল',
      vice_principal: 'ভাইস প্রিন্সিপাল',
      teacher: 'শিক্ষক',
      hifz_teacher: 'হিফজ শিক্ষক',
      accountant: 'হিসাবরক্ষক',
      admission_officer: 'ভর্তি কর্মকর্তা',
      hostel_manager: 'হোস্টেল ম্যানেজার',
      library_manager: 'লাইব্রেরি ম্যানেজার',
      student: 'ছাত্র/ছাত্রী',
      guardian: 'অভিভাবক',
    };
    return labels[get().user?.userType] || '';
  },
}));

export default useAuthStore;
