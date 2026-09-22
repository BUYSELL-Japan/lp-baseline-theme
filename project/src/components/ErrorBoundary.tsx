import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  language?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

type ErrorBoundaryLanguage = 'ja' | 'en' | 'ko' | 'zh-tw';

const errorMessages: Record<ErrorBoundaryLanguage, { title: string; body: string; details: string; reload: string }> = {
  ja: {
    title: 'アプリケーションエラー',
    body: 'アプリケーションの表示中に問題が発生しました。ページを再読み込みするか、サポートにお問い合わせください。',
    details: 'エラー詳細',
    reload: 'ページを再読み込み',
  },
  en: {
    title: 'Application Error',
    body: 'Something went wrong while rendering the application. Please refresh the page or contact support.',
    details: 'Error Details',
    reload: 'Reload Page',
  },
  ko: {
    title: '애플리케이션 오류',
    body: '애플리케이션을 표시하는 중 문제가 발생했습니다. 페이지를 새로고침하거나 지원팀에 문의해 주세요.',
    details: '오류 세부 정보',
    reload: '페이지 새로고침',
  },
  'zh-tw': {
    title: '應用程式錯誤',
    body: '顯示應用程式時發生問題。請重新載入頁面或聯絡支援團隊。',
    details: '錯誤詳細資訊',
    reload: '重新載入頁面',
  },
};

function detectLanguage(): ErrorBoundaryLanguage {
  if (typeof navigator === 'undefined') return 'ja';
  const lang = navigator.language?.toLowerCase() || '';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('zh')) return 'zh-tw';
  return 'ja';
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const propLang = this.props.language?.toLowerCase();
      const lang: ErrorBoundaryLanguage =
        propLang === 'en' || propLang === 'ko' || propLang === 'zh-tw' || propLang === 'ja'
          ? propLang
          : detectLanguage();
      const messages = errorMessages[lang];

      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-red-900 mb-2">
                  {messages.title}
                </h1>
                <p className="text-red-800 mb-4">
                  {messages.body}
                </p>
              </div>
            </div>

            {this.state.error && (
              <details className="mb-4">
                <summary className="cursor-pointer text-red-700 hover:text-red-900 font-medium mb-2">
                  {messages.details}
                </summary>
                <div className="bg-red-50 p-4 rounded border border-red-200 overflow-auto">
                  <p className="font-mono text-sm text-red-900 mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="font-mono text-xs text-red-800 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {messages.reload}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
