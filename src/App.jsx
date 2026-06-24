import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentListPage from './pages/students/StudentListPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import StudentPromotionPage from './pages/students/StudentPromotionPage';
import StudentCreatePage from './pages/students/StudentCreatePage';


import HomeworkPage from './pages/homework/HomeworkPage';
import TeacherListPage from './pages/teachers/TeacherListPage';
import GuardianListPage from './pages/guardians/GuardianListPage';
import AttendancePage from './pages/attendance/AttendancePage';
import ExamPage from './pages/exams/ExamPage';
import HifzPage from './pages/hifz/HifzPage';
import FeesPage from './pages/finance/FeesPage';
import NoticesPage from './pages/notices/NoticesPage';
import AcademicsPage from './pages/academics/AcademicsPage';
import ClassSubjectsPage from './pages/academics/ClassSubjectsPage';
import MessagingPage from './pages/messaging/MessagingPage';
import LibraryPage from './pages/library/LibraryPage';
import HostelPage from './pages/hostel/HostelPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import ReportsPage from './pages/reports/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* পাবলিক */}
        <Route path="/login" element={<LoginPage />} />

        {/* ড্যাশবোর্ড (প্রোটেক্টেড) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/promote" element={<StudentPromotionPage />} />
          <Route path="/students/new" element={<StudentCreatePage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />


          <Route path="/teachers" element={<TeacherListPage />} />
          <Route path="/guardians" element={<GuardianListPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/academics/class-subjects" element={<ClassSubjectsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/hifz" element={<HifzPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/homework" element={<HomeworkPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/role-management" element={<RoleManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* রিডাইরেক্ট */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
