import './App.css'
import Landing from './page/Landing.tsx';
import Home from './page/Home.tsx';
import { Signup } from './page/Signup.tsx';
import { Signin } from './page/Signin.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Signin />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
