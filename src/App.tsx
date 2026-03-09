import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Upload, 
  MessageSquare, 
  User, 
  ChevronRight, 
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Assignment {
  id: number;
  student_name: string;
  title: string;
  link: string;
  status: 'Pending Review' | 'Graded' | 'Resubmit';
  submitted_at: string;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'courses', icon: BookOpen, label: 'My Courses' },
    { id: 'assignments', icon: Upload, label: 'Assignment Portal' },
    { id: 'help', icon: MessageSquare, label: 'Help Center' },
  ];

  return (
    <div className="w-64 bg-[#000033] text-white h-screen fixed left-0 top-0 flex flex-col p-6">
      <div className="mb-12">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          VUE<span className="text-[#FF0000]">POINT</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest opacity-50">Digital Hub Portal</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-[#FF0000] text-white shadow-lg shadow-red-900/20' 
                : 'hover:bg-white/5 text-white/70'
            }`}
          >
            <tab.icon size={20} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Student User</p>
            <p className="text-[10px] opacity-50">Full-Stack Track</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const stats = [
    { label: 'Course Completion %', value: '75%', color: 'text-blue-500' },
    { label: 'Assignments Submitted', value: '12', color: 'text-green-500' },
    { label: 'Next Class Date', value: 'April 6th', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-[#000033]">Welcome back, Student!</h2>
        <p className="text-slate-500">Here's what's happening with your learning journey today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-[#000033]">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Submitted "React Hooks Deep Dive"</p>
                  <p className="text-xs text-slate-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#000033] p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Upcoming Workshop</h3>
            <p className="text-white/70 text-sm mb-6">Advanced Backend Architecture with Node.js</p>
            <button className="bg-[#FF0000] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition-colors">
              Set Reminder
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

const AssignmentPortal = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch('/api/assignments');
    const data = await res.json();
    setAssignments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_name: 'Student User', title, link })
      });
      setTitle('');
      setLink('');
      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Graded': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'Resubmit': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-amber-500" size={16} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
          <h3 className="text-xl font-bold mb-6 text-[#000033]">Submit Assignment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Project Title</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder="e.g. Portfolio Website"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">GitHub Link / URL</label>
              <input 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <button 
              disabled={isSubmitting}
              className="w-full bg-[#FF0000] text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
              Submit Project
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-[#000033]">Submission History</h3>
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>No assignments submitted yet.</p>
              </div>
            ) : (
              assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <BookOpen size={20} className="text-[#000033]" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-400">{new Date(a.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-medium">
                      {getStatusIcon(a.status)}
                      {a.status}
                    </div>
                    <a href={a.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#FF0000]">
                      <ChevronRight size={20} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpCenter = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hello! I am the Vue Point Support Bot. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-[#000033] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold">Support Bot</h3>
            <p className="text-[10px] opacity-50 uppercase tracking-widest">AI Assistant</p>
          </div>
        </div>
        <button className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
          Escalate to Mentor
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#FF0000] text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
              <Loader2 className="animate-spin text-slate-400" size={18} />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about location, courses, or opening dates..."
            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-[#FF0000] text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'assignments' && <AssignmentPortal />}
            {activeTab === 'help' && <HelpCenter />}
            {activeTab === 'courses' && (
              <div className="text-center py-20">
                <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-2xl font-bold text-slate-400">Course Content Coming Soon</h2>
                <p className="text-slate-400">We are currently preparing your curriculum materials.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
