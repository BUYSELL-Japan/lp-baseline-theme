import { AlertCircle } from 'lucide-react';

interface SectionErrorProps {
  sectionName: string;
  error: string;
  data?: any;
}

export default function SectionError({ sectionName, error, data }: SectionErrorProps) {
  return (
    <section className="py-12 px-4 bg-red-50/50 border-l-4 border-red-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              {sectionName} Section Error
            </h3>
            <p className="text-red-800 mb-3">{error}</p>
            {data !== undefined && (
              <details className="text-sm">
                <summary className="cursor-pointer text-red-700 hover:text-red-900 font-medium mb-2">
                  Show Debug Data
                </summary>
                <pre className="bg-white p-4 rounded border border-red-200 overflow-auto max-h-64 text-xs">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
