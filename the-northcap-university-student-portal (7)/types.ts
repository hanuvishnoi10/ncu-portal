
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ATTENDANCE = 'ATTENDANCE',
  TIMETABLE = 'TIMETABLE',
  COURSES = 'COURSES',
  EXAMS = 'EXAMS',
  FEES = 'FEES',
  ASSIGNMENTS = 'ASSIGNMENTS',
  PROFILE = 'PROFILE',
  AI_HELP = 'AI_HELP'
}

export interface Student {
  id: string;
  name: string;
  program: string;
  semester: number;
  email: string;
  phone: string;
  cgpa: number;
  avatar: string;
  dob: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  professorEmail: string;
  professorCabin?: string;
  professorOfficeHours?: string;
  credits: number;
  attendance: number;
  totalClasses: number;
  attendedClasses: number;
  syllabus: string[];
}

export interface ClassSession {
  id: string;
  courseId: string;
  day: string;
  time: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  maxScore: number;
}

export interface FeeRecord {
  id: string;
  semester: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentDate?: string;
}

export interface ExamResult {
  courseId: string;
  midTerm: number;
  endTerm: number;
  grade: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}