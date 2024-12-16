import './App.css'
import Header from "./components/Header.tsx";
import Hero from './components/Hero.tsx';
import Benefits from "./components/Benefits.tsx";
import Section from './components/Section'

function App() {
  return (
    <>
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Section>
    <Header />
    <Hero />
    <Benefits />
    </Section>
    </div>
    </>
  )
}

export default App
