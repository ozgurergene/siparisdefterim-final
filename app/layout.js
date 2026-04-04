import '../globals.css'
import { Suspense } from 'react';

export const metadata = {
  title: "SiparişDefterim",
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" style={{ margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0 }}>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#666' }}>Yükleniyor...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}