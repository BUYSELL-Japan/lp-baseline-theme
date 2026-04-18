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
    <section id="contact" className="py-32 px-6 bg-red-50/20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] bg-red-600 opacity-[0.02] rounded-full blur-[120px] -translate-x-1/4 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Text Side */}
          <div className="w-full lg:w-2/5 pt-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-red-950 mb-12 italic tracking-tighter leading-[0.9]">
                {t(contactData, 'sectionTitle')}
              </h2>
              <div className="w-24 h-4 bg-red-600 rounded-full mb-12 shadow-lg" />
              <p className="text-xl md:text-2xl font-black text-red-900/40 italic leading-tight">
                {t(contactData, 'sectionSubtitle')}
              </p>
            </motion.div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-3/5"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(239,68,68,0.1)] relative"
            >
              {/* Glass Effect Overlay */}
              <div className="absolute -inset-4 bg-yellow-400 opacity-10 rounded-[4.5rem] blur-2xl -z-10" />

              {/* Honeypot */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder={t(contactData.fields, 'name')}
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      disabled={isDisabled}
                      className={`w-full px-0 py-6 bg-transparent border-b-4 transition-all duration-300 outline-none font-black text-2xl text-red-950 placeholder:text-red-900/20 ${
                        focused === 'name' ? 'border-red-600' : 'border-red-100'
                      }`}
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t(contactData.fields, 'email')}
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      disabled={isDisabled}
                      className={`w-full px-0 py-6 bg-transparent border-b-4 transition-all duration-300 outline-none font-black text-2xl text-red-950 placeholder:text-red-900/20 ${
                        focused === 'email' ? 'border-red-600' : 'border-red-100'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder={t(contactData.fields, 'subject')}
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    disabled={isDisabled}
                    className={`w-full px-0 py-6 bg-transparent border-b-4 transition-all duration-300 outline-none font-black text-2xl text-red-950 placeholder:text-red-900/20 ${
                      focused === 'subject' ? 'border-red-600' : 'border-red-100'
                    }`}
                    required
                  />
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t(contactData.fields, 'message')}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={4}
                    disabled={isDisabled}
                    className={`w-full px-0 py-6 bg-transparent border-b-4 transition-all duration-300 outline-none font-black text-2xl text-red-950 placeholder:text-red-900/20 resize-none ${
                      focused === 'message' ? 'border-red-600' : 'border-red-100'
                    }`}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  className="w-full bg-red-600 text-yellow-200 py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 flex items-center justify-center gap-6 disabled:opacity-50"
                >
                  {submitStatus === 'sending' ? (
                    <Loader2 className="animate-spin w-8 h-8" />
                  ) : submitStatus === 'success' ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Send className="w-8 h-8" />
                  )}
                  {t(contactData, 'submitButton')}
                </motion.button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-green-50 rounded-[2.5rem] text-green-800 font-black text-center border-4 border-green-100 italic">
                      {translate('contactSuccess')}
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-red-50 rounded-[2.5rem] text-red-800 font-black text-center border-4 border-red-100 italic">
                      {translate('contactError')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
