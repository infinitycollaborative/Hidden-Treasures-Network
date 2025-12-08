import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://HiddenTreasuresNetwork.org'

  const routes = [
    '',
    '/about',
    '/programs',
    '/events/tour',
    '/impact',
    '/sponsors',
    '/media',
    '/blog',
    '/contact',
    '/get-involved/students',
    '/get-involved/mentors',
    '/get-involved/organizations',
    '/get-involved/sponsors',
    '/map',
    '/network/directory',
    '/resources',
    '/events',
    '/login',
    '/register',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.includes('/get-involved') ? 0.9 : 0.8,
  }))
}
