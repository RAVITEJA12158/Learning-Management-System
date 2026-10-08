import { useState } from 'react';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans transition-colors duration-200">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Contact & Support</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 transition-colors">Have questions or need assistance with your courses?</p>
      </div>

      <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs transition-colors">
        {submitted ? (
          <div className="text-center py-10">
            <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-emerald-200 dark:border-emerald-500/20">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Thank you for reaching out. Our support team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">Message</label>
              <textarea
                rows="5"
                required
                placeholder="Describe your issue or query..."
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(0,102,255,0.4)] cursor-pointer"
            >
              Submit Support Request
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Contact;
