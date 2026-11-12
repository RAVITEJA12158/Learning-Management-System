import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const FAQS = [
  {
    q: 'How are course completion percentages calculated?',
    a: 'Your completion percentage is automatically calculated from CONTENT_PROGRESS as (completed content items ÷ total published content items) × 100.',
  },
  {
    q: 'Can I submit an assignment after the due date?',
    a: 'If the instructor has enabled "Allow Late Submissions" on the assignment, you can still upload your file or repository link after the deadline—it will be recorded with a LATE status badge.',
  },
  {
    q: 'What happens if my timer expires during a fullscreen quiz?',
    a: 'Quiz attempts feature an automatic countdown timer. When time reaches 00:00, your selected answers in QUIZ_ANSWERS are automatically finalized and submitted.',
  },
  {
    q: 'How is my overall course grade computed?',
    a: 'CourseHub combines your graded Assignment marks and Quiz Attempt scores using the course’s weighted GRADE_COMPONENTS rubric (e.g., Assignments 20%, Quizzes 20%, Mid Exam 25%, Final Exam 30%, Participation 5%).',
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('Technical Issue');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-2041',
      subject: 'Cloudinary PDF upload verification in CS401',
      category: 'Course Content',
      status: 'Resolved',
      date: 'Oct 28, 2026',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setTickets([
      {
        id: `TCK-${Math.floor(3000 + Math.random() * 6000)}`,
        subject: subject.trim(),
        category,
        status: 'Open',
        date: 'Just now',
      },
      ...tickets,
    ]);
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 sm:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8">
        <Badge variant="info" className="mb-2">
          Academic Help Desk
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Contact & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 transition-colors">
          Get help with course enrollment, assignment submissions, fullscreen quizzes, or technical issues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-8 shadow-xs transition-colors">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-200 dark:border-emerald-500/20">
                ✓
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Support Ticket Logged!
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md mx-auto">
                Thank you for reaching out. Your ticket has been assigned to our academic support team and appears in your ticket tracker.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5">
                Open a Support Ticket
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm sm:text-xs font-bold text-slate-800 dark:text-white outline-none"
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Course Enrollment">Course Enrollment</option>
                    <option value="Assignment / Grading">Assignment / Grading</option>
                    <option value="Quiz Exam Mode">Quiz Exam Mode</option>
                    <option value="Account & Role Access">Account & Role Access</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your question or issue..."
                    className="w-full min-h-[44px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-base sm:text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include course code (e.g. CS401) and any relevant details..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-base sm:text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Submit Support Request
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Your Recent Support Tickets
            </h3>
            {tickets.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-cyan-400 mr-2">
                    {t.id}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white break-words">
                    {t.subject}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                    {t.category} · {t.date}
                  </p>
                </div>
                <Badge variant={t.status === 'Resolved' ? 'active' : 'warning'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-1.5"
              >
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.q}</h3>
                <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
