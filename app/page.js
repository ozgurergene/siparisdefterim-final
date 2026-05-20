// app/page.js
// SERVER COMPONENT — 'use client' YOK. Metadata burada yaşar, botlar görür.
// Davranış: Landing içeriğini server-render eder (SEO için).
// Giriş yapmış kullanıcıyı RootRedirect client tarafında /home'a yönlendirir.

import LandingContent from './LandingContent'
import RootRedirect from './RootRedirect'

export const metadata = {
  metadataBase: new URL('https://deftertut.com'),
  title: 'SiparişDefterim - Instagram Sipariş Takip ve Yönetim Sistemi',
  description:
    'Instagram satıcıları için sipariş takip sistemi. DM siparişlerinizi tek panelde toplayın, müşteri ve kargo takibini kolaylaştırın. 50 sipariş ücretsiz.',
  keywords: [
    'instagram sipariş takip',
    'instagram sipariş yönetimi',
    'sipariş defteri',
    'dm sipariş takip',
    'instagram satış paneli',
    'sipariş takip programı',
  ],
  alternates: {
    canonical: 'https://deftertut.com',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://deftertut.com',
    siteName: 'SiparişDefterim',
    title: 'SiparişDefterim - Instagram Sipariş Takip ve Yönetim Sistemi',
    description:
      'Instagram satıcıları için sipariş takip sistemi. DM siparişlerinizi tek panelde toplayın, müşteri ve kargo takibini kolaylaştırın. 50 sipariş ücretsiz.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SiparişDefterim - Instagram Sipariş Yönetimi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SiparişDefterim - Instagram Sipariş Takip Sistemi',
    description:
      'Instagram satıcıları için sipariş takip sistemi. 50 sipariş ücretsiz dene.',
    images: ['/og-image.png'],
  },
}

export default function RootPage() {
  return (
    <>
      {/* Giriş yapmış kullanıcıyı sessizce /home'a yönlendirir.
          Anonim ziyaretçide hiçbir şey yapmaz, landing görünür kalır. */}
      <RootRedirect />
      <LandingContent />
    </>
  )
}
