import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContactData, useContactEmail } from '../contexts/PageDataContext';
import { useLocalize } from '../hooks/useLocalize';
import SectionError from './SectionError';

// ★ Lambdaが完成したら、ここのURLをAPI GatewayのエンドポイントURLに書き換えてください
const CONTACT_API_URL = import.meta.env.PUBLIC_CONTACT_API_URL || '';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const contactData = useContactData();
  const contactEmail = useContactEmail();
  const { t } = useLocalize();
  const [focused, setFocused] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  // フォームデータ（本物の入力項目）
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ★ ハニーポット（スパムボット対策の罠フィールド）
  // display:none で人間には見えないが、ボットがこの欄に入力するとサーバー側で破棄する
  const [honeypot, setHoneypot] = useState('');

  if (!contactData) {
    return <SectionError sectionName="Contact" error="No contact data available" data={contactData} />;
  }

  const sectionTitle = t(contactData, 'sectionTitle');
  if (!sectionTitle) {
    return <SectionError sectionName="Contact" error="Missing section title" data={contactData} />;
  }
  if (!contactData.fields) {
    return <SectionError sectionName="Contact" error="Missing contact form fields data" data={contactData} />;
  }

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
        body: JSON.stringify({
          ...formData,
          // ハニーポットの値も一緒に送信（Lambda側でチェックする）
          website: honeypot,
          // 店舗ごとのメールアドレスをLambdaに渡す
          targetEmail: contactEmail,
        }),
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
    <section id="contact" className="py-24 px-4 bg-section-gradient">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t(contactData, 'sectionTitle')}
          </h2>
          <div className="w-24 h-1 bg-theme-divider mx-auto mb-6" />
          <p className="text-xl text-gray-700">
            {t(contactData, 'sectionSubtitle')}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* ★ ハニーポットフィールド（人間には見えない罠） */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website">ウェブサイト（入力しないでください）</label>
            <input
              type="text"
              id="website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t(contactData.fields, 'name')}
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-theme-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                animate={{ scale: focused === 'name' ? 1.02 : 1, borderColor: focused === 'name' ? '#0d9488' : '#e5e7eb' }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t(contactData.fields, 'email')}
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-theme-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                animate={{ scale: focused === 'email' ? 1.02 : 1, borderColor: focused === 'email' ? '#0d9488' : '#e5e7eb' }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                {t(contactData.fields, 'subject')}
              </label>
              <motion.input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocused('subject')}
                onBlur={() => setFocused(null)}
                disabled={isDisabled}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-theme-primary focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                animate={{ scale: focused === 'subject' ? 1.02 : 1, borderColor: focused === 'subject' ? '#0d9488' : '#e5e7eb' }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t(contactData.fields, 'message')}
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={6}
                disabled={isDisabled}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-theme-primary focus:outline-none transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                animate={{ scale: focused === 'message' ? 1.02 : 1, borderColor: focused === 'message' ? '#0d9488' : '#e5e7eb' }}
                transition={{ duration: 0.2 }}
                required
              />
            </div>

            {/* 送信ボタン（状態に応じて表示が変わる） */}
            <motion.button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-theme-primary text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={!isDisabled ? { scale: 1.02, y: -2, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              transition={{ duration: 0.2 }}
            >
              {submitStatus === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {(submitStatus === 'idle' || submitStatus === 'error') && <Send className="w-5 h-5" />}
              {t(contactData, 'submitButton')}
            </motion.button>

            {/* 送信結果フィードバック */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">お問い合わせを受け付けました。ありがとうございます！</span>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm font-medium">送信に失敗しました。しばらくしてからもう一度お試しください。</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

