import './SuccessStories.css'

interface Story {
  name: string
  quote: string
  outcome: string
}

function StoryCard({ name, quote, outcome }: Story) {
  return (
    <div className="story-card">
      <div className="quote-icon">"</div>
      <blockquote className="story-quote">{quote}</blockquote>
      <div className="story-author">— {name}</div>
      <div className="story-outcome">{outcome}</div>
    </div>
  )
}

function SuccessStories() {
  const stories: Story[] = [
    {
      name: 'Maria Rodriguez',
      quote: 'I never thought someone like me could become a pilot. Hidden Treasures showed me it was possible.',
      outcome: 'Now pursuing Commercial Pilot License',
    },
    {
      name: 'James Washington',
      quote: 'The mentorship I received changed my entire perspective on what I could achieve.',
      outcome: 'Earned FAA Part 107 Drone Certification',
    },
    {
      name: 'Aisha Patel',
      quote: 'Learning about aircraft maintenance opened up a career path I didn\'t know existed.',
      outcome: 'Started apprenticeship with major airline',
    },
  ]

  return (
    <section className="success-stories section">
      <div className="container">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">
          Real people. Real transformations. Real futures.
        </p>
        <div className="stories-grid">
          {stories.map((story, index) => (
            <StoryCard key={index} {...story} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessStories
