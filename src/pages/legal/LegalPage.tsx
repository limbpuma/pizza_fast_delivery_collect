import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface LegalPageProps {
  pageType: 'impressum' | 'datenschutz' | 'agb';
}

const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const currentLanguage = i18n.language || 'de';
        const lang = currentLanguage.startsWith('de') ? 'de' : 'en';
        const url = `/legal/${pageType}.${lang}.md`;
        
        console.log('Loading legal content from:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Content loaded successfully, length:', text.length);
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading legal content:', err);
        setError('Failed to load content: ' + (err as Error).message);
        
        // Fallback content
        const fallbackContent = {
          impressum: {
            de: '# Impressum\n\nContent wird geladen...',
            en: '# Imprint\n\nContent loading...'
          },
          datenschutz: {
            de: '# Datenschutzerklärung\n\nContent wird geladen...',
            en: '# Privacy Policy\n\nContent loading...'
          },
          agb: {
            de: '# AGB\n\nContent wird geladen...',
            en: '# Terms and Conditions\n\nContent loading...'
          }
        };
        
        const lang = (i18n.language || 'de').startsWith('de') ? 'de' : 'en';
        setContent(fallbackContent[pageType][lang]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageType, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">{children}</ul>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-orange-600 hover:text-orange-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;