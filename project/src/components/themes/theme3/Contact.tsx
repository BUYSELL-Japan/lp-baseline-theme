import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContactData, useContactEmail } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || '';
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const contactData = useContactData();
  const contactEmail = useContactEmail();
  const { t, translate } = useLocalize();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');

  if (!contactData || !t(contactData, 'sectionTitle') || !contactData.fields) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <section id="contact" className="py-32 bg-stone-50">
      <div className="max-w-5xl mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <div className="w-8 h-px bg-amber-700 mx-auto mb-8" />
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 font-light tracking-wider mb-3">
            {t(contactData, 'sectionTitle')}
          </h2>
          <p className="font-serif text-stone-500 text-base tracking-wide">
            {t(contactData, 'sectionSubtitle')}
          </p>
          <div className="w-8 h-px bg-amber-700 mx-auto mt-8" />
        </motion.div>

        {/* Form layout — centered for theme alignment */}
        <div className="max-w-3xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Honeypot */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {/* Name */}
            <div className="group">
              <label htmlFor="contact-name" className="block font-serif text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
                {t(contactData.fields, 'name')}
              </label>
              <input
                type="text" id="contact-name" name="name" value={formData.name} onChange={handleChange}
                disabled={isDisabled} required
                className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-amber-700 outline-none py-3 font-serif text-stone-800 text-lg transition-colors duration-300 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div className="group">
              <label htmlFor="contact-email" className="block font-serif text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
                {t(contactData.fields, 'email')}
              </label>
              <input
                type="email" id="contact-email" name="email" value={formData.email} onChange={handleChange}
                disabled={isDisabled} required
                className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-amber-700 outline-none py-3 font-serif text-stone-800 text-lg transition-colors duration-300 disabled:opacity-50"
              />
            </div>

            {/* Subject */}
            <div className="group">
              <label htmlFor="contact-subject" className="block font-serif text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
                {t(contactData.fields, 'subject')}
              </label>
              <input
                type="text" id="contact-subject" name="subject" value={formData.subject} onChange={handleChange}
                disabled={isDisabled} required
                className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-amber-700 outline-none py-3 font-serif text-stone-800 text-lg transition-colors duration-300 disabled:opacity-50"
              />
            </div>

            {/* Message */}
            <div className="group">
              <label htmlFor="contact-message" className="block font-serif text-xs tracking-[0.25em] uppercase text-stone-400 mb-3">
                {t(contactData.fields, 'message')}
              </label>
              <textarea
                id="contact-message" name="message" value={formData.message} onChange={handleChange}
                rows={5} disabled={isDisabled} required
                className="w-full bg-transparent border-0 border-b border-stone-300 focus:border-amber-700 outline-none py-3 font-serif text-stone-800 text-lg transition-colors duration-300 resize-none disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className="flex items-center gap-3 px-12 py-5 bg-stone-800 text-white font-serif text-sm tracking-[0.25em] uppercase hover:bg-amber-800 transition-colors duration-500 disabled:opacity-50"
            >
              {submitStatus === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitStatus === 'success' && <CheckCircle className="w-4 h-4" />}
              {(submitStatus === 'idle' || submitStatus === 'error') && <Send className="w-4 h-4" />}
              {t(contactData, 'submitButton')}
            </motion.button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="font-serif text-sm text-stone-500 tracking-wide">
                  {translate('contactSuccess')}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="font-serif text-sm text-red-500 tracking-wide">
                  {translate('contactError')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>

      </div>
    </section>
  );
}
