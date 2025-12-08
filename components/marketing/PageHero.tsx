import { ReactNode } from "react"

interface PageHeroProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHero({ title, description, children, className = "" }: PageHeroProps) {
  return (
    <section className={`bg-gradient-to-br from-aviation-navy via-aviation-navy to-blue-900 text-white py-16 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-6 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
