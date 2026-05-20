export default function sitemap() {
  const baseUrl = 'https://deftertut.com'
  const lastModified = '2026-05-20'

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-use`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/distance-sales`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
