import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContactData, useContactEmail } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || '';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const contactData = useContactData();
  const contactEmail = useContactEmail();
  const { t } = useLocalize();
  const [focused, setFocused] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');

  if (!contactData || !contactData.fields) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitStatus === 'sending') return;
    setSubmitStatus('sending');

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot, targetEmail: contactEmail }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setHoneypot('');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const isDisabled = submitStatus === 'sending' || submitStatus === 'success';

  return (
    <section id="contact" className="py-32 px-6 bg-amber-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-red-600 font-black uppercase tracking-[0.3em] text-sm block mb-4">Get in Touch</span>
          <h2 className="text-5xl md:text-8xl font-black text-rose-900 mb-6 italic tracking-tighter">
            {t(contactData, 'sectionTitle')}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-orange-950/60">
            {t(contactData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_30px_80px_rgba(239,68,68,0.1)] border-8 border-amber-50"
        >
          {/* Honeypot */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-red-600 ml-4">
                  {t(contactData.fields, 'name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  disabled={isDisabled}
                  className={`w-full px-8 py-5 rounded-full bg-amber-50 border-4 transition-all duration-300 outline-none font-bold text-rose-900 ${
                    focused === 'name' ? 'border-yellow-400 bg-white ring-4 ring-yellow-400/20' : 'border-transparent'
                  }`}
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-red-600 ml-4">
                  {t(contactData.fields, 'email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  disabled={isDisabled}
                  className={`w-full px-8 py-5 rounded-full bg-amber-50 border-4 transition-all duration-300 outline-none font-bold text-rose-900 ${
                    focused === 'email' ? 'border-yellow-400 bg-white ring-4 ring-yellow-400/20' : 'border-transparent'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="subject" className="text-sm font-black uppercase tracking-widest text-red-600 ml-4">
                {t(contactData.fields, 'subject')}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocused('subject')}
                onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className={`w-full px-8 py-5 rounded-full bg-amber-50 border-4 transition-all duration-300 outline-none font-bold text-rose-900 ${
                  focused === 'subject' ? 'border-yellow-400 bg-white ring-4 ring-yellow-400/20' : 'border-transparent'
                }`}
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-black uppercase tracking-widest text-red-600 ml-4">
                {t(contactData.fields, 'message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={6}
                disabled={isDisabled}
                className={`w-full px-8 py-6 rounded-[3rem] bg-amber-50 border-4 transition-all duration-300 outline-none font-bold text-rose-900 resize-none ${
                  focused === 'message' ? 'border-yellow-400 bg-white ring-4 ring-yellow-400/20' : 'border-transparent'
                }`}
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className="w-full bg-red-600 text-yellow-200 py-6 rounded-full font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {submitStatus === 'sending' ? (
                <Loader2 className="animate-spin" />
              ) : submitStatus === 'success' ? (
                <CheckCircle />
              ) : (
                <Send className="w-6 h-6" />
              )}
              {t(contactData, 'submitButton')}
            </motion.button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-green-50 rounded-3xl text-green-800 font-bold text-center border-2 border-green-100">
                  <CheckCircle className="inline-block mr-2" /> Message sent successfully!
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 rounded-3xl text-red-800 font-bold text-center border-2 border-red-100">
                  <AlertCircle className="inline-block mr-2" /> Failed to send message. Please try again.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
