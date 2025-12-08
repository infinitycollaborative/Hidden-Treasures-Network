/**
 * Mapbox Configuration
 *
 * This file contains configuration and utility functions for Mapbox GL JS integration.
 */

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  style: 'mapbox://styles/mapbox/streets-v12', // Default style
  defaultCenter: {
    lng: -98.35, // Centered on the U.S. while showing the globe
    lat: 39.5,
  },
  defaultZoom: 1.75,
}

/**
 * Map styles available for the platform
 */
export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
} as const

export type MapStyleKey = keyof typeof MAP_STYLES

/**
 * Custom marker colors based on entity type
 */
export const MARKER_COLORS = {
  organization: '#0ea5e9', // Primary blue
  mentor: '#1e3a8a', // Navy
  student: '#10b981', // Green
  sponsor: '#f59e0b', // Gold
  event: '#dc2626', // Red
} as const

/**
 * Validate if Mapbox token is configured
 */
export function isMapboxConfigured(): boolean {
  return !!MAPBOX_CONFIG.accessToken && MAPBOX_CONFIG.accessToken !== ''
}

/**
 * Get coordinates from address (placeholder for geocoding functionality)
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  // TODO: Implement Mapbox Geocoding API
  // This is a placeholder that should be implemented with actual Mapbox Geocoding API
  console.warn('Geocoding not yet implemented for address:', address)
  return null
}
