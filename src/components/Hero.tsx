import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1 className="hero-headline">
            Empowering the Next Generation Through Aviation & STEM
          </h1>
          <p className="hero-subheadline">
            A global network of organizations, mentors, and innovators impacting one million lives by 2030
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary">Get Involved</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
