import Image from 'next/image'

export default function Mission() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="STEM education with children"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Hidden Treasures Network, we believe every student has untapped potential
              waiting to be discovered. Our mission is to inspire and empower young minds
              through hands-on aviation and STEM education.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We provide resources, mentorship, and opportunities that open doors to careers
              in aviation, engineering, technology, and beyond. By fostering curiosity and
              innovation, we help students soar to new heights.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Hands-on aviation experiences and flight simulations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">STEM curriculum aligned with real-world applications</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Mentorship from industry professionals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
