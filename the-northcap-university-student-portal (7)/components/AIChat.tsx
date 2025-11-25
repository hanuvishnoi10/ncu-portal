
import React, { useState, useEffect, useRef } from 'react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage, Student, Course, FeeRecord, Assignment } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AIChatProps {
  student: Student;
  courses: Course[];
  fees: FeeRecord[];
  assignments: Assignment[];
}

const AIChat: React.FC<AIChatProps> = ({ student, courses, fees, assignments }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi ${student.name.split(' ')[0]}! I'm your NCU Assistant. Ask me about your attendance, fees, syllabus, or assignments.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = `
      Student Name: ${student.name}
      ID: ${student.id}
      Program: ${student.program}
      CGPA: ${student.cgpa}
      
      Important Policy:
      - Minimum Attendance Requirement is 70%.

      Courses & Attendance (Goal 70%):
      ${courses.map(c => `- ${c.name} (${c.code}): ${c.attendance}% attendance. Professor: ${c.professor} (Cabin: ${c.professorCabin || 'N/A'}, Office Hours: ${c.professorOfficeHours || 'N/A'})`).join('\n')}
      
      Pending Assignments:
      ${assignments.filter(a => a.status === 'Pending').map(a => `- ${a.title} (Due: ${a.dueDate})`).join('\n') || "None"}
      
      Fee Status:
      ${fees.map(f => `- ${f.semester}: ${f.amount} INR, Status: ${f.status}`).join('\n')}
    `;

    const responseText = await generateAIResponse(userMsg.text, context);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[600px] flex flex-col overflow-hidden">
      <div className="bg-amber-500 p-4 text-slate-900 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold">NCU Assistant</h3>
          <p className="text-xs text-slate-900/80">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-amber-100' : 'bg-slate-200'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-amber-700" /> : <Bot className="w-4 h-4 text-slate-700" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-amber-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-amber-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex max-w-[80%] gap-2 flex-row">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-slate-700" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about attendance, exam dates..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
