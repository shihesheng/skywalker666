import { useSmoothScroll } from './animation/useSmoothScroll'
import { AboutSection } from './components/AboutSection'
import { ExperienceJourneySection } from './components/ExperienceJourneySection'
import { FutureSection } from './components/FutureSection'
import { HeroSection } from './components/HeroSection'
import { JourneySection } from './components/JourneySection'
import { MeaningSection } from './components/MeaningSection'
import { OutroSection } from './components/OutroSection'
import { ResponsibilityTransition } from './components/ResponsibilityTransition'

function App() {
  useSmoothScroll()

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <ExperienceJourneySection />
      <MeaningSection />
      <FutureSection />
      <ResponsibilityTransition />
      <OutroSection />
    </main>
  )
}

export default App
