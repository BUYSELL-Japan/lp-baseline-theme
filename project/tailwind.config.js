/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,astro}'],
  theme: {
    extend: {
      colors: {
        // テーマカラー（CSS変数から取得 - warm.css / default.css で上書き可能）
        theme: {
          // プライマリ（デフォルト: teal-600 系）
          primary:        'var(--color-primary)',
          'primary-hover':'var(--color-primary-hover)',
          'primary-light':'var(--color-primary-light)',
          'primary-lighter':'var(--color-primary-lighter)',
          'primary-text': 'var(--color-primary-text)',
          // アクセント（デフォルト: primary と同値 / warm: 珊瑚レッド）
          accent:         'var(--color-accent, var(--color-primary))',
          'accent-hover': 'var(--color-accent-hover, var(--color-primary-hover))',
          'accent-light': 'var(--color-accent-light, var(--color-primary-light))',
          // ベース背景
          base:           'var(--color-bg-base)',
          'section-alt':  'var(--color-bg-section-alt)',
          // セクション区切りライン
          divider:        'var(--color-divider)',
          // フッター
          'footer-from':  'var(--color-footer-bg-from)',
          'footer-to':    'var(--color-footer-bg-to)',
          'footer-border':'var(--color-footer-border)',
          'footer-muted': 'var(--color-footer-text-muted)',
          'footer-subtle':'var(--color-footer-text-subtle)',
          'footer-icon':  'var(--color-footer-icon-bg)',
          'footer-icon-hover': 'var(--color-footer-icon-bg-hover)',
          // CTAボタンテキスト（白ボタン時）
          'cta-btn-text': 'var(--color-cta-btn-text)',
        },
      },
    },
  },
  plugins: [],
};
