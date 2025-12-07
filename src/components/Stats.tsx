import { useEffect, useState, useRef } from 'react'
import './Stats.css'

interface StatItemProps {
  value: string
  label: string
}

function StatItem({ value, label }: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState('0')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
    const suffix = value.replace(/[0-9,]/g, '')

    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    let startValue = 0
    const duration = 2000
    const increment = numericValue / (duration / 16)

    const timer = setInterval(() => {
      startValue += increment
      if (startValue >= numericValue) {
        setDisplayValue(numericValue.toLocaleString() + suffix)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(startValue).toLocaleString() + suffix)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-value">{displayValue}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Stats() {
  const stats = [
    { value: '50+', label: 'Partner Organizations' },
    { value: '200,000+', label: 'Youth Impacted' },
    { value: '25+', label: 'Countries Reached' },
    { value: '1,200+', label: 'Discovery Flights Completed' },
  ]

  return (
    <section className="stats section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
