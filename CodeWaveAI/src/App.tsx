import { useState } from 'react'
import './App.css'
import Header from "./components/Header.tsx";
import Hero from './components/Hero.tsx';
import Button from "./components/Button.tsx";
import ButtonSvg from "./assets/svg/ButtonSvg.tsx";


function App() {
  return (
    <>
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Header />
    <Hero />
    </div>
    </>
  )
}

export default App
