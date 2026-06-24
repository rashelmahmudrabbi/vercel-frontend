import { useState, useEffect, useRef } from 'react';
import { ClipboardCheck, CheckCircle, AlertCircle, Save, Search, ChevronDown, Check } from 'lucide-react';
import api from '../../api/axios';

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSections, setSelectedSections] = useState([]); // array of section IDs
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const sectionDropdownRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { [studentId]: { status: 'present'|'absent'|'late'|'on_leave', remarks: '' } }
  
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close section dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(e.target)) {
        setSectionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/students/classes');
        if (res.data.success) {
          const classList = res.data.data.classes || [];
          setClasses(classList);
          if (classList.length > 0) {
            setSelectedClass(classList[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch classes', err);
        setToast({ type: 'error', message: 'ক্লাস তালিকা লোড করতে সমস্যা হয়েছে' });
      } finally {
        setMetaLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (!selectedClass) return;
    const fetchSections = async () => {
      try {
        const res = await api.get(`/students/sections?classLevel=${selectedClass}`);
        if (res.data.success) {
          const sectionList = res.data.data.sections || [];
          setSections(sectionList);
          // Default: সব section select করা
          setSelectedSections(sectionList.map(s => s._id));
        }
      } catch (err) {
        console.error('Failed to fetch sections', err);
      }
    };
    fetchSections();
    setStudents([]);
    setAttendance({});
  }, [selectedClass]);

  // Section multi-select handlers
  const toggleSection = (sectionId) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAllSections = () => {
    if (selectedSections.length === sections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(sections.map(s => s._id));
    }
  };

  const getSectionLabel = () => {
    if (selectedSections.length === 0) return 'শাখা নির্বাচন করুন';
    if (selectedSections.length === sections.length) return 'সব শাখা নির্বাচিত';
    const names = sections
      .filter(s => selectedSections.includes(s._id))
      .map(s => s.name);
    return names.join(', ');
  };

  const loadAttendanceData = async () => {
    if (!selectedClass || selectedSections.length === 0) {
      setToast({ type: 'error', message: 'অনুগ্রহ করে শ্রেণি এবং অন্তত একটি শাখা নির্বাচন করুন' });
      return;
    }
    setLoading(true);
    try {
      const sectionsParam = selectedSections.join(',');

      // 1. Fetch students in selected class/sections
      const studentsRes = await api.get('/students', {
        params: { classLevel: selectedClass, sections: sectionsParam, limit: 200 }
      });
      const studentsData = studentsRes.data.data || [];

      // Sort students by section name then roll number
      studentsData.sort((a, b) => {
        const secA = a.currentEnrollment?.section?.name || '';
        const secB = b.currentEnrollment?.section?.name || '';
        if (secA !== secB) return secA.localeCompare(secB, 'bn');
        const rollA = parseInt(a.currentEnrollment?.rollNumber) || 0;
        const rollB = parseInt(b.currentEnrollment?.rollNumber) || 0;
        return rollA - rollB;
      });

      setStudents(studentsData);

      // 2. Fetch existing attendance records for the date/class/sections
      const attendanceRes = await api.get('/attendance', {
        params: { date, classLevel: selectedClass, sections: sectionsParam }
      });
      const records = attendanceRes.data.data?.records || [];

      // 3. Map records to attendance state
      const initialAttendance = {};

      // Default all fetched students to present
      studentsData.forEach(student => {
        initialAttendance[student._id] = { status: 'present', remarks: '' };
      });

      // Override with database records if they exist
      records.forEach(rec => {
        const sId = typeof rec.student === 'object' ? rec.student?._id : rec.student;
        if (sId) {
          initialAttendance[sId] = {
            status: rec.status,
            remarks: rec.remarks || ''
          };
        }
      });

      setAttendance(initialAttendance);
      setToast({ type: 'success', message: `${studentsData.length} জন শিক্ষার্থীর ডাটা লোড হয়েছে` });
    } catch (err) {
      console.error('Failed to load attendance details', err);
      setToast({ type: 'error', message: 'ডাটা লোড করতে ব্যর্থ হয়েছে' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const markAllStatus = (status) => {
    const updated = { ...attendance };
    students.forEach(student => {
      updated[student._id] = {
        ...updated[student._id],
        status
      };
    });
    setAttendance(updated);
  };

  const saveAttendance = async () => {
    if (students.length === 0) {
      setToast({ type: 'error', message: 'সংরক্ষণ করার জন্য কোনো ছাত্র তালিকা নেই' });
      return;
    }
    setSubmitting(true);
    try {
      // Build one combined payload — backend uses per-student upsert anyway
      const studentsPayload = Object.keys(attendance).map(studentId => ({
        studentId,
        status: attendance[studentId].status,
        remarks: attendance[studentId].remarks
      }));

      const payload = {
        date,
        classLevel: selectedClass,
        section: selectedSections[0], // primary section for record-keeping
        students: studentsPayload
      };

      const res = await api.post('/attendance', payload);
      if (res.data.success) {
        setToast({ type: 'success', message: `${studentsPayload.length} জন শিক্ষার্থীর উপস্থিতি সংরক্ষণ হয়েছে!` });
      }
    } catch (err) {
      console.error('Failed to save attendance', err);
      const errMsg = err.response?.data?.message || 'উপস্থিতি সংরক্ষণ করতে সমস্যা হয়েছে';
      setToast({ type: 'error', message: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present': return 'badge-active';
      case 'absent': return 'badge-danger';
      case 'late': return 'badge-warning';
      case 'on_leave': return 'badge-info';
      default: return 'badge-inactive';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present': return 'উপস্থিত';
      case 'absent': return 'অনুপস্থিত';
      case 'late': return 'বিলম্ব';
      case 'on_leave': return 'ছুটি';
      default: return 'অজানা';
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          padding: '14px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
          background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease-out',
          maxWidth: '400px',
        }}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.9rem' }}>{toast.message}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">উপস্থিতি খাতা</h1>
          <p className="page-subtitle">মাদ্রাসার শিক্ষার্থীদের দৈনিক উপস্থিতি রেকর্ড ও সংশোধন করুন</p>
        </div>
      </div>

      {/* ফিল্টার এবং লোড কার্ড */}
      <div className="card mb-24" style={{ position: 'relative', zIndex: 10 }}>
        {metaLoading ? (
          <div className="flex-center" style={{ padding: '10px' }}>
            <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
          </div>
        ) : (
          <div className="flex gap-16" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
              <label className="form-label">তারিখ</label>
              <input 
                type="date" 
                className="form-input" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
              <label className="form-label">শ্রেণি</label>
              <select 
                className="form-input" 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">শ্রেণি নির্বাচন করুন</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Multi-select Section Dropdown */}
            <div className="form-group" style={{ marginBottom: 0, minWidth: '200px', position: 'relative' }} ref={sectionDropdownRef}>
              <label className="form-label">শাখা (সেকশন)</label>
              <button
                type="button"
                className="form-input"
                onClick={() => selectedClass && setSectionDropdownOpen(o => !o)}
                disabled={!selectedClass}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: selectedClass ? 'pointer' : 'not-allowed',
                  textAlign: 'left', gap: '8px',
                  background: sectionDropdownOpen ? 'var(--bg-primary)' : '',
                  borderColor: sectionDropdownOpen ? 'var(--primary-500)' : '',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontSize: '0.9rem' }}>
                  {getSectionLabel()}
                </span>
                {selectedSections.length > 0 && (
                  <span style={{
                    background: 'var(--primary-500)', color: '#fff',
                    borderRadius: '50%', width: '20px', height: '20px',
                    fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontWeight: 700
                  }}>
                    {selectedSections.length}
                  </span>
                )}
                <ChevronDown size={14} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: sectionDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown Panel */}
              {sectionDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 500,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  minWidth: '200px', overflow: 'hidden',
                  animation: 'slideDown 0.15s ease-out'
                }}>
                  {/* Select All */}
                  <div
                    onClick={toggleAllSections}
                    style={{
                      padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                      borderBottom: '1px solid var(--border-color)',
                      background: selectedSections.length === sections.length ? 'rgba(var(--primary-rgb, 14,165,233), 0.08)' : '',
                      fontWeight: 600, fontSize: '0.85rem'
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                      border: '2px solid var(--primary-500)',
                      background: selectedSections.length === sections.length ? 'var(--primary-500)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {selectedSections.length === sections.length && <Check size={11} color="#fff" strokeWidth={3} />}
                      {selectedSections.length > 0 && selectedSections.length < sections.length && (
                        <div style={{ width: '8px', height: '2px', background: 'var(--primary-500)', borderRadius: '1px' }} />
                      )}
                    </div>
                    সব শাখা নির্বাচন করুন
                  </div>

                  {/* Individual sections */}
                  {sections.map(sec => {
                    const isChecked = selectedSections.includes(sec._id);
                    return (
                      <div
                        key={sec._id}
                        onClick={() => toggleSection(sec._id)}
                        style={{
                          padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                          background: isChecked ? 'rgba(14,165,233,0.06)' : '',
                          transition: 'background 0.15s',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={e => { if (!isChecked) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isChecked ? 'rgba(14,165,233,0.06)' : ''; }}
                      >
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                          border: `2px solid ${isChecked ? 'var(--primary-500)' : 'var(--border-color)'}`,
                          background: isChecked ? 'var(--primary-500)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s'
                        }}>
                          {isChecked && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <span>শাখা {sec.name}</span>
                        {sec.classLevel?.name && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {sec.classLevel.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => { setSectionDropdownOpen(false); loadAttendanceData(); }}
              disabled={loading || !selectedClass || selectedSections.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Search size={16} /> লোড করুন
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card flex-center" style={{ padding: '60px' }}>
          <div className="spinner"></div>
          <span className="ml-12 text-muted">ডাটা লোড হচ্ছে...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="card empty-state">
          <ClipboardCheck size={48} style={{ opacity: 0.3 }} />
          <div className="empty-state-title mt-16">কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি</div>
          <p className="text-muted text-sm mt-8">শ্রেণি ও শাখা নির্বাচন করে "লোড করুন" বাটনে ক্লিক করুন</p>
        </div>
      ) : (
        <div className="animate-slide-up">
          {/* বাল্ক একশন কন্ট্রোল */}
          <div className="flex-between mb-16" style={{ background: 'var(--bg-secondary)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span className="text-sm font-semibold">মোট শিক্ষার্থী: {students.length} জন</span>
            <div className="flex gap-8">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm text-success" 
                onClick={() => markAllStatus('present')}
                style={{ fontSize: '0.85rem' }}
              >
                সবাই উপস্থিত
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm text-danger" 
                onClick={() => markAllStatus('absent')}
                style={{ fontSize: '0.85rem' }}
              >
                সবাই অনুপস্থিত
              </button>
            </div>
          </div>

          {/* উপস্থিতির মূল তালিকা */}
          <div className="card table-container" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>রোল</th>
                  <th>ছাত্রের নাম ও আইডি</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>স্ট্যাটাস</th>
                  <th style={{ textAlign: 'center' }}>উপস্থিতি নির্বাচন করুন</th>
                  <th style={{ width: '220px' }}>মন্তব্য (ঐচ্ছিক)</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const studentId = student._id;
                  const roll = student.currentEnrollment?.rollNumber || '—';
                  const studentName = student.user?.fullName || 
                    `${student.user?.firstName || ''} ${student.user?.lastName || ''}`.trim();
                  const currentStatus = attendance[studentId]?.status || 'present';
                  const currentRemarks = attendance[studentId]?.remarks || '';

                  return (
                    <tr key={studentId}>
                      <td style={{ textAlign: 'center', fontFamily: 'Inter', fontWeight: 600 }}>{roll}</td>
                      <td>
                        <div className="font-semibold">{studentName}</div>
                        <div className="text-xs text-muted">{student.studentId}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${getStatusBadgeClass(currentStatus)}`}>
                          {getStatusLabel(currentStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="flex-center gap-4">
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'present' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(studentId, 'present')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderColor: currentStatus === 'present' ? 'var(--success)' : 'transparent',
                              background: currentStatus === 'present' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                              color: currentStatus === 'present' ? '#10b981' : 'var(--text-secondary)'
                            }}
                          >
                            উপস্থিত
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'absent' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(studentId, 'absent')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderColor: currentStatus === 'absent' ? 'var(--danger)' : 'transparent',
                              background: currentStatus === 'absent' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                              color: currentStatus === 'absent' ? '#ef4444' : 'var(--text-secondary)'
                            }}
                          >
                            অনুপস্থিত
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'late' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(studentId, 'late')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderColor: currentStatus === 'late' ? 'var(--warning)' : 'transparent',
                              background: currentStatus === 'late' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                              color: currentStatus === 'late' ? '#f59e0b' : 'var(--text-secondary)'
                            }}
                          >
                            বিলম্ব
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${currentStatus === 'on_leave' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleStatusChange(studentId, 'on_leave')}
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              borderColor: currentStatus === 'on_leave' ? 'var(--info)' : 'transparent',
                              background: currentStatus === 'on_leave' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                              color: currentStatus === 'on_leave' ? '#3b82f6' : 'var(--text-secondary)'
                            }}
                          >
                            ছুটি
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem', marginBottom: 0 }}
                          placeholder="মন্তব্য..."
                          value={currentRemarks}
                          onChange={(e) => handleRemarksChange(studentId, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-secondary)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button 
                className="btn btn-primary" 
                onClick={saveAttendance}
                disabled={submitting}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} /> {submitting ? 'সংরক্ষণ হচ্ছে...' : 'উপস্থিতি সংরক্ষণ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
