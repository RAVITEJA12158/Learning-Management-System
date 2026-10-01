import { useState } from 'react';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 w-full">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact & Support</h1>
        <p className="text-sm text-slate-500 mt-1">Have questions or need assistance with your courses?</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        {submitted ? (
          <div className="text-center py-10">
            <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-900">Message Sent!</h2>
            <p className="text-sm text-slate-500 mt-2">Thank you for reaching out. Our support team will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message</label>
              <textarea
                rows="5"
                required
                placeholder="Describe your issue or query..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs"
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
