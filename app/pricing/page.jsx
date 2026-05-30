import PricingPageWrapper from './PricingContent'

export const metadata = {
  title: "Pro'ya Yükselt | SiparişDefterim",
  description:
    'SiparişDefterim Pro ile sınırsız sipariş oluştur, gelişmiş raporlara eriş ve öncelikli destek al. Aylık $2.99 veya yıllık $29.99.',
  alternates: {
    canonical: 'https://deftertut.com/pricing',
  },
  openGraph: {
    title: "Pro'ya Yükselt | SiparişDefterim",
    description:
      'Sınırsız sipariş, gelişmiş raporlar ve öncelikli destek ile işini büyüt.',
    url: 'https://deftertut.com/pricing',
    siteName: 'SiparişDefterim',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: 'https://deftertut.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SiparişDefterim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Pro'ya Yükselt | SiparişDefterim",
    description:
      'Sınırsız sipariş, gelişmiş raporlar ve öncelikli destek ile işini büyüt.',
    images: ['https://deftertut.com/og-image.png'],
  },
}

export default function PricingPage() {
  return <PricingPageWrapper />
}