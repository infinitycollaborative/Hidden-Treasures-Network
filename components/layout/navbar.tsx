"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/organizations", label: "Organizations" },
    { href: "/map", label: "Global Network" },
    { href: "/resources", label: "Resources" },
    { href: "/impact", label: "Impact" },
    { href: "/sponsors", label: "Sponsors" },
  ]

  return (
    <nav className="bg-aviation-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-aviation-sky" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Hidden Treasures</span>
              <span className="text-xs text-aviation-gold leading-tight">Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-aviation-sky/20 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-aviation-sky/20">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                Join Network
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-aviation-sky/20 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-aviation-sky/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-aviation-sky/20 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 space-y-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:bg-aviation-sky/20">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  Join Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
