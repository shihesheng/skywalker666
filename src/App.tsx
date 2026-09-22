import { AboutSection } from './components/AboutSection'
import { FutureSection } from './components/FutureSection'
import { HeroSection } from './components/HeroSection'
import { JourneySection } from './components/JourneySection'
import { MeaningSection } from './components/MeaningSection'
import { OutroSection } from './components/OutroSection'
import { ResponsibilityTransition } from './components/ResponsibilityTransition'

function App() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <MeaningSection />
      <FutureSection />
      <ResponsibilityTransition />
      <OutroSection />
    </main>
  )
}

export default App
