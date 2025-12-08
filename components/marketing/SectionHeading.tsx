interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = ""
}: SectionHeadingProps) {
  return (
    <div className={`mb-8 md:mb-12 ${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-aviation-navy mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg md:text-xl text-gray-700 ${centered ? "max-w-3xl mx-auto" : "max-w-3xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
