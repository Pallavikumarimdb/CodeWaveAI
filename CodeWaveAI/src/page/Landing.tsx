import Header from '../components/Header.tsx';
import Hero from '../components/Hero.tsx';
import Benefits from "../components/Benefits.tsx";
import Section from '../components/Section'
import Collaboration from '../components/Collaboration.tsx';
import Services from '../components/Services.tsx';
import Pricing from '../components/Pricing.tsx';
import Footer from '../components/Footer.tsx';

export default function Landing() {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Section>
    <Header />
    <Hero />
    <Benefits />
    <Collaboration/>
    <Services />
    <Pricing/>
    <Footer/>
    </Section>


    </div>
  )
}
