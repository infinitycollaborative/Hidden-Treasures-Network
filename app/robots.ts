import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://HiddenTreasuresNetwork.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/assistant/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
