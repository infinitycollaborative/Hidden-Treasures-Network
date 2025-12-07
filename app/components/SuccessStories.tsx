import Image from 'next/image'

const stories = [
  {
    id: 1,
    name: 'Sarah Martinez',
    role: 'Commercial Pilot',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: 'The Hidden Treasures Network gave me the wings to pursue my dream of becoming a pilot. Their mentorship program connected me with industry professionals who guided me every step of the way.',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Aerospace Engineer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: 'From building model aircraft to designing real ones, HTN showed me that my passion for aviation could become a rewarding career in aerospace engineering.',
  },
  {
    id: 3,
    name: 'Aisha Patel',
    role: 'Flight Operations Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: 'The STEM programs opened my eyes to the countless career paths in aviation. Now I manage flight operations for a major airline, and I credit HTN for showing me the way.',
  },
]

export default function SuccessStories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the inspiring individuals who soared to new heights with our programs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Portrait Image */}
              <div className="relative h-80">
                <Image
                  src={story.image}
                  alt={`${story.name} - ${story.role}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {story.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">{story.role}</p>
                <p className="text-gray-700 leading-relaxed italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
