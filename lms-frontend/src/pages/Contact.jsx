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
        <h1 className="text-3xl font-black text-slate-900 dark:text-zinc-50 tracking-tight transition-colors">Contact & Support</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 transition-colors">Have questions or need assistance with your courses?</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs transition-colors">
        {submitted ? (
          <div className="text-center py-10">
            <div className="h-14 w-14 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Message Sent!</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">Thank you for reaching out. Our support team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Message</label>
              <textarea
                rows="5"
                required
                placeholder="Describe your issue or query..."
                className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs cursor-pointer"
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
