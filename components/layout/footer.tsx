import Link from "next/link"
import { Plane, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-aviation-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-aviation-sky" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Hidden Treasures Network</span>
                <span className="text-xs text-aviation-gold leading-tight">Aviation & STEM Education</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              A global platform connecting aviation and STEM education organizations, mentors,
              students, and sponsors under a unified mission to impact one million lives by 2030.
            </p>
            <p className="text-aviation-gold font-semibold">
              Infinity Aero Club Tampa Bay, Inc. (501c3)
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-aviation-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-aviation-sky transition-colors">About Us</Link></li>
              <li><Link href="/organizations" className="hover:text-aviation-sky transition-colors">Organizations</Link></li>
              <li><Link href="/map" className="hover:text-aviation-sky transition-colors">Global Network</Link></li>
              <li><Link href="/resources" className="hover:text-aviation-sky transition-colors">Resources</Link></li>
              <li><Link href="/impact" className="hover:text-aviation-sky transition-colors">Impact Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-aviation-gold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-aviation-sky" />
                <a href="mailto:info@hiddentreasuresnetwork.org" className="hover:text-aviation-sky transition-colors">
                  info@hiddentreasuresnetwork.org
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-aviation-sky" />
                <span>Coming Soon</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-aviation-sky" />
                <span>Tampa Bay, FL</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-aviation-sky/30 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Hidden Treasures Network. All rights reserved.</p>
          <p className="mt-2">
            Founded by Ricardo "Tattoo" Foster, LCDR USN (Ret.)
          </p>
        </div>
      </div>
    </footer>
  )
}
