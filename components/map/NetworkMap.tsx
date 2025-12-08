"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { OrganizationRecord } from '@/lib/db-organizations'
import { MAPBOX_CONFIG } from '@/lib/mapbox'

interface NetworkMapProps {
  organizations: OrganizationRecord[]
  heightClass?: string
}

export function NetworkMap({ organizations, heightClass = 'h-[500px]' }: NetworkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [ready, setReady] = useState(false)

  const center = useMemo(() => MAPBOX_CONFIG.defaultCenter || { lng: -98.35, lat: 39.5 }, [])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const token = MAPBOX_CONFIG.accessToken
    if (!token) {
      console.error('Mapbox access token is missing. Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.')
      return
    }

    mapboxgl.accessToken = token

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_CONFIG.style,
      center: [center.lng, center.lat],
      zoom: 1.75,
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    mapRef.current.on('load', () => {
      setReady(true)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      mapRef.current?.remove()
    }
  }, [center])

  useEffect(() => {
    if (!ready || !mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    organizations
      .filter((org) => org.location?.coordinates?.lat && org.location?.coordinates?.lng)
      .forEach((org) => {
        const element = document.createElement('div')
        element.className =
          'w-8 h-8 rounded-full bg-white shadow-lg border-2 border-aviation-navy flex items-center justify-center text-aviation-navy'
        element.innerHTML = '✈️'

        const popupContent = `
          <div class="min-w-[220px]">
            <div class="flex items-center gap-3">
              ${org.media?.logoUrl ? `<img src="${org.media.logoUrl}" alt="${org.name}" class="w-12 h-12 object-contain rounded" />` : ''}
              <div>
                <p class="font-semibold text-base text-gray-900">${org.name}</p>
                <p class="text-xs text-gray-600">${org.location?.city ? `${org.location.city}, ` : ''}${org.location?.country || ''}</p>
              </div>
            </div>
            ${org.programTypes?.length ? `<div class="mt-2 flex flex-wrap gap-1 text-[11px] text-gray-700">${org.programTypes
              .map((p) => `<span class="px-2 py-1 bg-blue-50 rounded-full border border-blue-100">${p}</span>`)
              .join('')}</div>` : ''}
            <a href="/network/${org.id}" class="mt-3 inline-flex items-center justify-center px-3 py-2 bg-aviation-navy text-white rounded-md text-sm w-full">View Profile</a>
          </div>
        `

        const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(popupContent)

        const marker = new mapboxgl.Marker({ element })
          .setLngLat([org.location!.coordinates!.lng, org.location!.coordinates!.lat])
          .setPopup(popup)
          .addTo(mapRef.current!)

        markersRef.current.push(marker)
      })
  }, [organizations, ready])

  return (
    <div className={`relative w-full ${heightClass}`}>
      <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-600">
          Loading interactive map...
        </div>
      )}
    </div>
  )
}

export default NetworkMap
