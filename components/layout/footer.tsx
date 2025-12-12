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
            <h3 className="font-semibold text-lg mb-4 text-aviation-gold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-aviation-sky transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-aviation-sky transition-colors">Programs</Link></li>
              <li><Link href="/events/tour" className="hover:text-aviation-sky transition-colors">Hidden Treasures Tour</Link></li>
              <li><Link href="/impact" className="hover:text-aviation-sky transition-colors">Impact</Link></li>
              <li><Link href="/sponsors" className="hover:text-aviation-sky transition-colors">Sponsors</Link></li>
              <li><Link href="/blog" className="hover:text-aviation-sky transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-aviation-gold">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/get-involved/students" className="hover:text-aviation-sky transition-colors">For Students</Link></li>
              <li><Link href="/get-involved/mentors" className="hover:text-aviation-sky transition-colors">For Mentors</Link></li>
              <li><Link href="/get-involved/organizations" className="hover:text-aviation-sky transition-colors">For Organizations</Link></li>
              <li><Link href="/get-involved/sponsors" className="hover:text-aviation-sky transition-colors">For Sponsors</Link></li>
              <li><Link href="/media" className="hover:text-aviation-sky transition-colors">Media & Press</Link></li>
              <li><Link href="/contact" className="hover:text-aviation-sky transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-aviation-sky/30 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Hidden Treasures Network. All rights reserved.</p>
          <p className="mt-2">
            A network of educators, mentors, and partners impacting one million lives by 2030
          </p>
        </div>
      </div>
    </footer>
  )
}
