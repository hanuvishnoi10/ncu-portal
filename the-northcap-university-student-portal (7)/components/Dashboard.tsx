
import React from 'react';
import { ViewState, Student, Course, Assignment, FeeRecord, ClassSession } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowRight, Book, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  student: Student;
  courses: Course[];
  assignments: Assignment[];
  fees: FeeRecord[];
  nextClass: ClassSession | undefined;
  onChangeView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ student, courses, assignments, fees, nextClass, onChangeView }) => {
  // Calculate aggregate attendance
  const totalClasses = courses.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClasses = courses.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallAttendance = Math.round((attendedClasses / totalClasses) * 100) || 0;

  // Visual logic for 70% target
  const isAttendanceLow = overallAttendance < 70;
  const attendanceColor = isAttendanceLow ? '#ef4444' : '#f59e0b'; // Red-500 or Amber-500

  const attendanceData = [
    { name: 'Attended', value: attendedClasses },
    { name: 'Missed', value: totalClasses - attendedClasses },
  ];
  
  const COLORS = [attendanceColor, '#e2e8f0']; // Dynamic Main Color, Slate-200

  const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
  const pendingFees = fees.some(f => f.status === 'Pending' || f.status === 'Overdue');

  const coursePerformanceData = courses.map(c => ({
    name: c.code,
    attendance: c.attendance,
  }));

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {student.name.split(' ')[0]} 👋</h2>
        <p className="text-slate-500">Here's what's happening today at NCU.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onChangeView(ViewState.ATTENDANCE)}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendance</p>
              <h3 className={`text-2xl font-bold mt-1 ${isAttendanceLow ? 'text-red-500' : 'text-slate-800'}`}>{overallAttendance}%</h3>
            </div>
            <div className={`p-2 rounded-lg ${isAttendanceLow ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <PieChart width={40} height={40}>
                <Pie data={attendanceData} innerRadius={10} outerRadius={18} paddingAngle={2} dataKey="value">
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Target: 70% minimum</p>
        </div>

        <div 
          onClick={() => onChangeView(ViewState.EXAMS)}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CGPA</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{student.cgpa}</h3>
          </div>
           <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center self-end">
             <Book className="w-5 h-5" />
           </div>
           <p className="text-xs text-slate-500 mt-2">Semester {student.semester}</p>
        </div>

        <div 
          onClick={() => onChangeView(ViewState.ASSIGNMENTS)}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assignments</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingAssignments}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center self-end">
             <AlertCircle className="w-5 h-5" />
           </div>
          <p className="text-xs text-slate-500 mt-2">Pending Submission</p>
        </div>

        <div 
          onClick={() => onChangeView(ViewState.FEES)}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
        >
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fee Status</p>
            <h3 className={`text-2xl font-bold mt-1 ${pendingFees ? 'text-red-500' : 'text-green-600'}`}>
              {pendingFees ? 'Due' : 'Clear'}
            </h3>
          </div>
           <div className={`w-10 h-10 rounded-lg flex items-center justify-center self-end relative z-10 ${pendingFees ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
             <Clock className="w-5 h-5" />
           </div>
           {pendingFees && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500" />}
          <p className="text-xs text-slate-500 mt-2 relative z-10">{fees.find(f => f.status === 'Pending')?.dueDate ? `Due by ${fees.find(f => f.status === 'Pending')?.dueDate}` : 'No dues'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Next Class
          </h3>
          {nextClass ? (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase">{nextClass.type}</span>
                <span className="text-sm font-semibold text-slate-600">{nextClass.time}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{courses.find(c => c.id === nextClass.courseId)?.name}</h4>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Room: {nextClass.room}
              </p>
              <button 
                onClick={() => onChangeView(ViewState.TIMETABLE)}
                className="mt-4 w-full py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                View Full Timetable
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No more classes today!</p>
            </div>
          )}
        </div>

        {/* Attendance Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Attendance Overview</h3>
            <button 
              onClick={() => onChangeView(ViewState.ATTENDANCE)}
              className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
            >
              Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformanceData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="attendance" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
