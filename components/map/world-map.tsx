"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface Organization {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  city: string
  country: string
}

export function WorldMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Check if Mapbox token is available
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) {
      console.error("Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file")
      return
    }

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 2,
      projection: { name: "globe" } as any
    })

    map.current.on("load", () => {
      setLoaded(true)

      // Add sample organization markers (in production, fetch from Firestore)
      const sampleOrganizations: Organization[] = [
        {
          id: "1",
          name: "Infinity Aero Club Tampa Bay",
          location: { lat: 27.9506, lng: -82.4572 },
          city: "Tampa",
          country: "USA"
        },
        // Add more sample organizations as needed
      ]

      sampleOrganizations.forEach((org) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="p-2">
            <h3 class="font-bold text-sm">${org.name}</h3>
            <p class="text-xs text-gray-600">${org.city}, ${org.country}</p>
          </div>`
        )

        const el = document.createElement("div")
        el.className = "marker"
        el.style.backgroundImage = "url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)"
        el.style.width = "30px"
        el.style.height = "30px"
        el.style.backgroundSize = "100%"
        el.style.cursor = "pointer"

        new mapboxgl.Marker(el)
          .setLngLat([org.location.lng, org.location.lat])
          .setPopup(popup)
          .addTo(map.current!)
      })
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}
    </div>
  )
}
