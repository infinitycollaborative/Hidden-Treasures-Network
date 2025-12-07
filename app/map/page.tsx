import { WorldMap } from "@/components/map/world-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Users, MapPin } from "lucide-react"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Global Network Map
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Explore aviation and STEM education organizations around the world.
            Connect with partners, discover collaboration opportunities, and see the global impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Globe className="h-8 w-8 text-aviation-sky mx-auto mb-2" />
              <CardTitle>Global Reach</CardTitle>
              <CardDescription>Organizations across continents</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-aviation-sky mx-auto mb-2" />
              <CardTitle>Network Size</CardTitle>
              <CardDescription>Growing community of educators</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 text-aviation-sky mx-auto mb-2" />
              <CardTitle>Find Partners</CardTitle>
              <CardDescription>Discover nearby organizations</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="h-[600px]">
          <CardContent className="h-full p-6">
            <WorldMap />
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Note: Configure your Mapbox access token in environment variables to enable the map.
            <br />
            Visit <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-aviation-sky hover:underline">mapbox.com</a> to get your free token.
          </p>
        </div>
      </div>
    </div>
  )
}
