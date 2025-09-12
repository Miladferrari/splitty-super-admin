import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon-clean.png" />
        <meta name="theme-color" content="#10b981" />
      </Head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check for saved theme preference or OS dark mode preference
                  const savedTheme = localStorage.getItem('splitty-theme');
                  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Apply dark mode if user explicitly chose it or if user's OS prefers dark mode
                  if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Failed to restore dark mode preference:', e);
                }
              })();
            `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}