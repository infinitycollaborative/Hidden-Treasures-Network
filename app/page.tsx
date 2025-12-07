import Hero from './components/Hero'
import Mission from './components/Mission'
import SuccessStories from './components/SuccessStories'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Mission />
      <SuccessStories />
      <Footer />
    </main>
  )
}
