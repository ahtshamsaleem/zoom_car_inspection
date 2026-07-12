// components/language-script.tsx
export function LanguageScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('zoom-inspection-locale');
        var locale = 'en';
        if (stored) {
          var parsed = JSON.parse(stored);
          locale = (parsed.state && parsed.state.locale) || 'en';
        }
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      } catch (e) {}
    })();
  `;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}