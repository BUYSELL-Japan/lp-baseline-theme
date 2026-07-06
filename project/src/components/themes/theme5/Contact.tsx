import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { useContactData, useContactEmail } from '../../../contexts/PageDataContext';
import { useLocalize } from '../../../hooks/useLocalize';

const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || '';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const contactData = useContactData();
  const contactEmail = useContactEmail();
  const { t, translate } = useLocalize();
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

  const inputClass = (fieldName: string) =>
    `w-full bg-transparent border-b-2 transition-all duration-200 outline-none text-base font-medium text-gray-900 placeholder:text-gray-400 py-4 ${
      focused === fieldName
        ? 'border-[#D4AF37]'
        : 'border-gray-300 hover:border-gray-500'
    }`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Top gold accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-0 items-start">

          {/* Text Side */}
          <div className="w-full lg:w-2/5 pr-0 lg:pr-20 mb-12 lg:mb-0 pt-0 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-8 border-l-2 border-[#C0392B]"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{translate('sectionContact')}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                {t(contactData, 'sectionTitle')}
              </h2>
              <div className="w-12 h-0.5 bg-[#D4AF37] mb-8" />
              <p className="text-base text-gray-500 leading-relaxed font-medium">
                {t(contactData, 'sectionSubtitle')}
              </p>

              {/* Cymbal disc decoration */}
              <div className="mt-16 hidden lg:block">
                <div className="w-20 h-20 border-2 border-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-3/5"
          >
            <form onSubmit={handleSubmit} className="border border-gray-200 p-10 lg:p-14 relative">
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]" />

              {/* Honeypot */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
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
                      className={inputClass('name')}
                      required
                    />
                  </div>
                  <div>
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
                      className={inputClass('email')}
                      required
                    />
                  </div>
                </div>

                <div>
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
                    className={inputClass('subject')}
                    required
                  />
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t(contactData.fields, 'message')}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={5}
                    disabled={isDisabled}
                    className={`${inputClass('message')} resize-none`}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { x: 4 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  className="flex items-center gap-4 px-10 py-4 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] border border-gray-900 hover:bg-gray-950 transition-colors disabled:opacity-50"
                >
                  {submitStatus === 'sending' ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : submitStatus === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t(contactData, 'submitButton')}
                </motion.button>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 border border-[#D4AF37] bg-[#D4AF37]/5 text-gray-900 text-sm font-bold"
                    >
                      {translate('contactSuccess')}
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 border border-[#C0392B] bg-[#C0392B]/5 text-gray-900 text-sm font-bold"
                    >
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
