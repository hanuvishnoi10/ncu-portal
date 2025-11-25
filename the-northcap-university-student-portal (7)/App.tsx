
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Login from './components/Login';
import { AppleSpotlight } from './components/AppleSpotlight';
import { ViewState, Student, Notification } from './types';
import { CURRENT_STUDENT, COURSES, TIMETABLE, ASSIGNMENTS, FEES, EXAM_RESULTS, DAYS_OF_WEEK, NOTIFICATIONS } from './constants';
import { Search, Bell, Download, Mail, Phone, Calendar, CheckCircle, IndianRupee, MapPin, Clock, Menu, Save, X, Info, AlertTriangle, AlertCircle, Trash2, Camera, Upload, Command } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [student, setStudent] = useState<Student>(CURRENT_STUDENT);
  
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<Student>(CURRENT_STUDENT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Spotlight & Notification State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  // Keyboard shortcut for Spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isAuthenticated) setIsSpotlightOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  // Determine next class
  const dayName = DAYS_OF_WEEK[currentDate.getDay() - 1]; // 0 is Sunday
  const nextClass = TIMETABLE.find(t => t.day === dayName);

  // Simulate active notification
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: `new-${Date.now()}`,
        title: 'New Grade Published',
        message: 'Mid-term results for Algebra & Calculus have been released.',
        time: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 8000); // 8 seconds delay
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleSaveProfile = () => {
    setStudent(editForm);
    setIsEditingProfile(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(ViewState.DASHBOARD);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            student={student} 
            courses={COURSES} 
            assignments={ASSIGNMENTS} 
            fees={FEES}
            nextClass={nextClass}
            onChangeView={setCurrentView}
          />
        );
      case ViewState.ATTENDANCE:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Attendance Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.map(course => (
                <div key={course.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Attended', value: course.attendedClasses },
                            { name: 'Missed', value: course.totalClasses - course.attendedClasses }
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill={course.attendance >= 70 ? '#22c55e' : '#ef4444'} />
                          <Cell fill="#e2e8f0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${course.attendance >= 70 ? 'text-slate-800' : 'text-red-500'}`}>{course.attendance}%</span>
                      <span className="text-xs text-slate-500 uppercase">Present</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-4">{course.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{course.code}</p>
                  <div className="w-full grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="bg-green-50 p-2 rounded text-green-700">
                      <span className="block font-bold">{course.attendedClasses}</span>
                      <span className="text-xs">Attended</span>
                    </div>
                    <div className="bg-red-50 p-2 rounded text-red-700">
                      <span className="block font-bold">{course.totalClasses - course.attendedClasses}</span>
                      <span className="text-xs">Missed</span>
                    </div>
                  </div>
                  {course.attendance < 70 && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-red-500 font-medium">
                          <AlertCircle className="w-3 h-3" /> Below 70% Target
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case ViewState.TIMETABLE:
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-900">Weekly Timetable</h2>
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                 <Download className="w-4 h-4" /> Download PDF
               </button>
             </div>
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Room</th>
                        <th className="px-6 py-4">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {TIMETABLE.map((slot) => {
                         const course = COURSES.find(c => c.id === slot.courseId);
                         return (
                           <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4 font-medium text-slate-900">{slot.day}</td>
                             <td className="px-6 py-4 text-slate-600 font-mono">{slot.time}</td>
                             <td className="px-6 py-4">
                               <div className="font-medium text-slate-900">{course?.name}</div>
                               <div className="text-xs text-slate-500">{course?.code}</div>
                             </td>
                             <td className="px-6 py-4">
                               <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs border border-slate-200">{slot.room}</span>
                             </td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                 slot.type === 'Lecture' ? 'bg-blue-100 text-blue-700' : 
                                 slot.type === 'Lab' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                               }`}>
                                 {slot.type}
                               </span>
                             </td>
                           </tr>
                         );
                      })}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );
      case ViewState.COURSES:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Courses & Syllabus</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {COURSES.map(course => (
                <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">{course.code}</span>
                       <h3 className="text-xl font-bold text-slate-900 mt-2">{course.name}</h3>
                    </div>
                    <span className="text-sm font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-600">{course.credits} Credits</span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instructor Details</h4>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold flex-shrink-0">
                        {course.professor.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{course.professor}</p>
                        <a href={`mailto:${course.professorEmail}`} className="text-xs text-blue-600 hover:underline block mb-2">{course.professorEmail}</a>
                        
                        {(course.professorCabin || course.professorOfficeHours) && (
                          <div className="bg-slate-50 rounded p-2 text-xs text-slate-600 space-y-1">
                             {course.professorCabin && (
                               <div className="flex items-center gap-2">
                                 <MapPin className="w-3 h-3 text-slate-400" />
                                 <span>{course.professorCabin}</span>
                               </div>
                             )}
                             {course.professorOfficeHours && (
                               <div className="flex items-center gap-2">
                                 <Clock className="w-3 h-3 text-slate-400" />
                                 <span>{course.professorOfficeHours}</span>
                               </div>
                             )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Syllabus Highlights</h4>
                    <ul className="space-y-2">
                      {course.syllabus.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case ViewState.EXAMS:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Exams & Results</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Mid-Term (25)</th>
                    <th className="px-6 py-4">End-Term (50)</th>
                    <th className="px-6 py-4">Internal (25)</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {EXAM_RESULTS.map((result, idx) => {
                    const course = COURSES.find(c => c.id === result.courseId);
                    const internal = Math.floor(Math.random() * 5) + 20; // Mock internal
                    const total = result.midTerm + result.endTerm + internal;
                    
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {course?.name} <span className="text-slate-400 font-normal">({course?.code})</span>
                        </td>
                        <td className="px-6 py-4">{result.midTerm}</td>
                        <td className="px-6 py-4">{result.endTerm || '-'}</td>
                        <td className="px-6 py-4">{internal}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{total}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            result.grade === 'NA' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
                          }`}>
                            {result.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case ViewState.ASSIGNMENTS:
         return (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
             <div className="grid gap-4">
               {ASSIGNMENTS.map((assign) => {
                 const course = COURSES.find(c => c.id === assign.courseId);
                 const isPending = assign.status === 'Pending';
                 return (
                   <div key={assign.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{course?.code}</span>
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${isPending ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                           {assign.status}
                         </span>
                       </div>
                       <h3 className="text-lg font-bold text-slate-900">{assign.title}</h3>
                       <p className="text-sm text-slate-500">Due: {new Date(assign.dueDate).toLocaleDateString()}</p>
                     </div>
                     
                     <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-xs text-slate-400 uppercase">Score</span>
                          <span className="block text-lg font-bold text-slate-800">{assign.score ? assign.score : '-'}/{assign.maxScore}</span>
                        </div>
                        {isPending ? (
                          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Upload
                          </button>
                        ) : (
                          <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                            View Submission
                          </button>
                        )}
                     </div>
                   </div>
                 )
               })}
             </div>
           </div>
         );
      case ViewState.FEES:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Fee Payment</h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               {FEES.map(fee => (
                 <div key={fee.id} className="p-6 border-b border-slate-100 last:border-0 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${fee.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        <IndianRupee className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{fee.semester} Fee</h3>
                        <p className="text-sm text-slate-500">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                        {fee.paymentDate && <p className="text-xs text-green-600 mt-1">Paid on {new Date(fee.paymentDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <span className="text-xl font-bold text-slate-800">₹{fee.amount.toLocaleString()}</span>
                      {fee.status === 'Pending' ? (
                        <button className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors">
                          Pay Now
                        </button>
                      ) : (
                        <button className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                           <Download className="w-4 h-4" /> Receipt
                        </button>
                      )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case ViewState.PROFILE:
        if (isEditingProfile) {
          return (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                   <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600">
                     <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
                    <div className="flex items-center gap-4">
                       <img 
                          src={editForm.avatar} 
                          alt="Preview" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                        />
                       <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                          >
                             <Upload className="w-3 h-3" /> Upload from Device
                          </button>
                          <input 
                            ref={fileInputRef} 
                            type="file" 
                            hidden 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                          />
                          <p className="text-[10px] text-slate-400">Recommended: Square JPG/PNG</p>
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL (Optional)</label>
                    <input 
                      type="text" 
                      value={editForm.avatar}
                      onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm text-slate-600"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={editForm.dob}
                      onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                  <div className="w-32 h-32 rounded-xl border-4 border-white bg-slate-200 overflow-hidden shadow-lg group relative">
                    <img src={student.avatar} alt="Profile" className="w-full h-full object-cover" />
                    <button 
                       onClick={() => {
                        setEditForm(student);
                        setIsEditingProfile(true);
                      }}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setEditForm(student);
                      setIsEditingProfile(true);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800"
                  >
                    Edit Profile
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                <p className="text-slate-500">{student.id} • {student.program}</p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Personal Information</h3>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="w-4 h-4" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone className="w-4 h-4" />
                      {student.phone}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      DOB: {new Date(student.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-bold text-slate-900 border-b pb-2">Academic Information</h3>
                     <div className="flex justify-between py-2 border-b border-slate-50">
                       <span className="text-slate-600">Current Semester</span>
                       <span className="font-medium">{student.semester}</span>
                     </div>
                     <div className="flex justify-between py-2 border-b border-slate-50">
                       <span className="text-slate-600">CGPA</span>
                       <span className="font-medium">{student.cgpa}</span>
                     </div>
                     <div className="flex justify-between py-2">
                       <span className="text-slate-600">Batch</span>
                       <span className="font-medium">2025 - 2029</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case ViewState.AI_HELP:
        return (
          <div className="max-w-4xl mx-auto space-y-4">
             <header className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">NCU AI Assistant</h2>
                <p className="text-slate-500">Powered by Google Gemini. Ask me anything about your university life.</p>
             </header>
             <AIChat 
                student={student} 
                courses={COURSES} 
                fees={FEES} 
                assignments={ASSIGNMENTS} 
             />
          </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={() => setIsAuthenticated(true)} 
        expectedStudentId={CURRENT_STUDENT.id} 
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-slate-50 min-h-screen w-full">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        student={student}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 flex-1 relative z-50">
             <div 
               onClick={() => setIsSpotlightOpen(true)}
               className="flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-2 rounded-lg w-full max-w-md cursor-pointer hover:bg-slate-200/70 transition-colors group"
             >
               <Search className="w-4 h-4 group-hover:text-slate-600" />
               <span className="text-sm text-slate-500 w-full group-hover:text-slate-700">Search...</span>
               <div className="flex items-center gap-1 text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm text-slate-400 font-medium font-mono">
                  <Command className="w-3 h-3" /> K
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4 relative">
             <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
               className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
             >
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
               )}
             </button>

             {/* Notifications Dropdown */}
             {isNotificationsOpen && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                 <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                       <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                       <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                            Read all
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearNotifications} className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1">
                             <Trash2 className="w-3 h-3" /> Clear
                          </button>
                        )}
                       </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-amber-50/50' : ''}`}>
                             <div className="flex gap-3">
                                <div className={`mt-0.5 flex-shrink-0 ${
                                  notif.type === 'alert' ? 'text-red-500' :
                                  notif.type === 'warning' ? 'text-amber-500' :
                                  notif.type === 'success' ? 'text-green-500' : 'text-blue-500'
                                }`}>
                                  {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                                  {notif.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                  {notif.type === 'success' && <CheckCircle className="w-4 h-4" />}
                                  {notif.type === 'info' && <Info className="w-4 h-4" />}
                                </div>
                                <div>
                                   <p className={`text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                     {notif.title}
                                   </p>
                                   <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                   <p className="text-[10px] text-slate-400 mt-2">{notif.time}</p>
                                </div>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
               </>
             )}

             <div 
               className="hidden sm:block text-right cursor-pointer hover:opacity-80 transition-opacity"
               onClick={() => setCurrentView(ViewState.PROFILE)}
             >
               <p className="text-sm font-bold text-slate-900">{student.name}</p>
               <p className="text-xs text-slate-500">Student</p>
             </div>
             <img 
               src={student.avatar} 
               alt="Profile" 
               className="w-9 h-9 rounded-full bg-slate-200 object-cover border border-slate-200 cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
               onClick={() => setCurrentView(ViewState.PROFILE)} 
             />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 overflow-y-auto h-full relative z-0">
          {renderContent()}
        </main>
      </div>

      {/* Spotlight Component */}
      <AppleSpotlight 
        isOpen={isSpotlightOpen} 
        onClose={() => setIsSpotlightOpen(false)} 
        onChangeView={setCurrentView} 
      />
    </div>
  );
};

export default App;
