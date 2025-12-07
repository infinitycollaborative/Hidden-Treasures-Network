import Hero from './components/Hero'
import Stats from './components/Stats'
import Mission from './components/Mission'
import SuccessStories from './components/SuccessStories'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Hero />
      <Stats />
      <Mission />
      <SuccessStories />
      <Footer />
    </div>
  )
}

export default App
