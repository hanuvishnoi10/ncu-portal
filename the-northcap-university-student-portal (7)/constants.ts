
import { Student, Course, ClassSession, Assignment, FeeRecord, ExamResult, Notification } from './types';

export const CURRENT_STUDENT: Student = {
  id: '25CSU078',
  name: 'Hanu Vishnoi',
  program: 'B.Tech Cyber Security',
  semester: 2,
  email: 'hanu25csu078@ncuindia.edu',
  phone: '+91 98765 43210',
  cgpa: 8.4,
  avatar: 'https://picsum.photos/200/200',
  dob: '2007-08-15'
};

export const COURSES: Course[] = [
  {
    id: 'CS101',
    code: 'CSL101',
    name: 'Programming in C',
    professor: 'Dr. Sarah Khan',
    professorEmail: 'sarah.khan@ncuindia.edu',
    professorCabin: 'Block A, Room 305',
    professorOfficeHours: 'Mon, Wed 14:00 - 15:00',
    credits: 4,
    attendance: 85,
    totalClasses: 40,
    attendedClasses: 34,
    syllabus: ['Introduction to C', 'Control Structures', 'Arrays & Strings', 'Pointers', 'File Handling']
  },
  {
    id: 'CS102',
    code: 'CSL102',
    name: 'Web Fundamentals',
    professor: 'Prof. Rahul Verma',
    professorEmail: 'rahul.verma@ncuindia.edu',
    professorCabin: 'Block C, Room 210',
    professorOfficeHours: 'Tue, Thu 11:00 - 12:00',
    credits: 3,
    attendance: 72,
    totalClasses: 36,
    attendedClasses: 26,
    syllabus: ['HTML5 Basics', 'CSS Styling', 'JavaScript Intro', 'DOM Manipulation', 'Responsive Design']
  },
  {
    id: 'MAT104',
    code: 'MAT104',
    name: 'Algebra & Calculus',
    professor: 'Dr. Anjali Gupta',
    professorEmail: 'anjali.gupta@ncuindia.edu',
    professorCabin: 'Block B, Room 104',
    professorOfficeHours: 'Wed, Fri 10:00 - 11:00',
    credits: 4,
    attendance: 92,
    totalClasses: 42,
    attendedClasses: 39,
    syllabus: ['Matrices', 'Vector Spaces', 'Differential Calculus', 'Integral Calculus']
  },
  {
    id: 'EVS101',
    code: 'EVS101',
    name: 'Environmental Science',
    professor: 'Mr. Vikram Singh',
    professorEmail: 'vikram.singh@ncuindia.edu',
    professorCabin: 'Block A, Room 202',
    professorOfficeHours: 'Mon, Thu 15:00 - 16:00',
    credits: 2,
    attendance: 65,
    totalClasses: 28,
    attendedClasses: 18,
    syllabus: ['Ecosystems', 'Biodiversity', 'Environmental Pollution', 'Social Issues', 'Human Population']
  }
];

export const TIMETABLE: ClassSession[] = [
  { id: '1', courseId: 'CS101', day: 'Monday', time: '09:00 AM - 10:00 AM', room: 'LH-101', type: 'Lecture' },
  { id: '2', courseId: 'CS102', day: 'Monday', time: '10:00 AM - 11:00 AM', room: 'LH-102', type: 'Lecture' },
  { id: '3', courseId: 'MAT104', day: 'Tuesday', time: '09:00 AM - 11:00 AM', room: 'LH-205', type: 'Lecture' },
  { id: '4', courseId: 'EVS101', day: 'Wednesday', time: '02:00 PM - 03:00 PM', room: 'LH-103', type: 'Lecture' },
  { id: '5', courseId: 'CS101', day: 'Thursday', time: '11:00 AM - 01:00 PM', room: 'LAB-1', type: 'Lab' },
  { id: '6', courseId: 'CS102', day: 'Friday', time: '10:00 AM - 11:00 AM', room: 'LAB-2', type: 'Lab' },
];

export const ASSIGNMENTS: Assignment[] = [
  { id: 'A1', courseId: 'CS101', title: 'Pointers & Arrays Project', dueDate: '2025-05-15', status: 'Pending', maxScore: 20 },
  { id: 'A2', courseId: 'CS102', title: 'Personal Portfolio Page', dueDate: '2025-05-10', status: 'Submitted', maxScore: 50 },
  { id: 'A3', courseId: 'MAT104', title: 'Calculus Problem Set', dueDate: '2025-04-20', status: 'Graded', score: 18, maxScore: 20 },
];

export const FEES: FeeRecord[] = [
  { id: 'F1', semester: 'Semester 1', amount: 135000, dueDate: '2024-07-10', status: 'Paid', paymentDate: '2024-07-05' },
  { id: 'F2', semester: 'Semester 2', amount: 135000, dueDate: '2025-01-10', status: 'Pending' },
];

export const EXAM_RESULTS: ExamResult[] = [
  { courseId: 'CS101', midTerm: 22, endTerm: 0, grade: 'NA' },
  { courseId: 'CS102', midTerm: 18, endTerm: 0, grade: 'NA' },
  { courseId: 'MAT104', midTerm: 24, endTerm: 0, grade: 'NA' },
  { courseId: 'EVS101', midTerm: 15, endTerm: 0, grade: 'NA' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Class Cancelled', message: 'EVS101 lecture today at 2 PM is cancelled due to faculty meeting.', time: '2 hours ago', type: 'alert', read: false },
  { id: '2', title: 'Assignment Reminder', message: 'Web Fundamentals Portfolio is due in 2 days. Don\'t forget to submit.', time: '5 hours ago', type: 'warning', read: false },
  { id: '3', title: 'Library Book Due', message: 'Please return "Clean Code" by tomorrow to avoid fines.', time: '1 day ago', type: 'info', read: true },
  { id: '4', title: 'Fee Payment Received', message: 'Payment of ₹1,35,000 for Semester 1 has been successfully processed.', time: '2 days ago', type: 'success', read: true },
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];