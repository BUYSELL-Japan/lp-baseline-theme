import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContactData, useContactEmail } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';
import SectionError from '../../SectionError';

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || '';
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const contactData = useContactData();
  const contactEmail = useContactEmail();
  const { t, translate } = useLocalize();
  const [focused, setFocused] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');

  if (!contactData) return <SectionError sectionName="Contact" error="No contact data available" data={contactData} />;
  const sectionTitle = t(contactData, 'sectionTitle');
  if (!sectionTitle) return <SectionError sectionName="Contact" error="Missing section title" data={contactData} />;
  if (!contactData.fields) return <SectionError sectionName="Contact" error="Missing contact form fields data" data={contactData} />;

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

  const inputBase = "w-full px-5 py-4 rounded-xl bg-slate-800 border-2 border-slate-700 text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
  const inputFocused = "border-blue-500";
  const inputNormal = "border-slate-700";

  return (
    <section id="contact" className="py-32 px-6 bg-slate-950">
      {/* Glow accent */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            {t(contactData, 'sectionTitle')}
          </h2>
          <p className="text-xl text-slate-400">
            {t(contactData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl"
        >
          {/* Honeypot */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name-t2" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                {t(contactData.fields, 'name')}
              </label>
              <input
                type="text" id="name-t2" name="name"
                value={formData.name} onChange={handleChange}
                onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className={`${inputBase} ${focused === 'name' ? inputFocused : inputNormal}`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email-t2" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                {t(contactData.fields, 'email')}
              </label>
              <input
                type="email" id="email-t2" name="email"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className={`${inputBase} ${focused === 'email' ? inputFocused : inputNormal}`}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject-t2" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                {t(contactData.fields, 'subject')}
              </label>
              <input
                type="text" id="subject-t2" name="subject"
                value={formData.subject} onChange={handleChange}
                onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className={`${inputBase} ${focused === 'subject' ? inputFocused : inputNormal}`}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message-t2" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                {t(contactData.fields, 'message')}
              </label>
              <textarea
                id="message-t2" name="message"
                value={formData.message} onChange={handleChange}
                onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                rows={6} disabled={isDisabled}
                className={`${inputBase} resize-none ${focused === 'message' ? inputFocused : inputNormal}`}
                required
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={isDisabled}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              {submitStatus === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {(submitStatus === 'idle' || submitStatus === 'error') && <Send className="w-5 h-5" />}
              {t(contactData, 'submitButton')}
            </motion.button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-300"
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">{translate('contactSuccess')}</span>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold">{translate('contactError')}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
