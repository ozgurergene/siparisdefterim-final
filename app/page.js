console.log('Page loaded')
export const metadata = {
  title: "SiparişDefterim",
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
