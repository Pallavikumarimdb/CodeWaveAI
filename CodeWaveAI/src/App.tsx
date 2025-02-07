import './App.css'
import Landing from './page/Landing.tsx';
import Home from './page/Home.tsx';
import { Signup } from './page/Signup.tsx';
import { Signin } from './page/Signin.tsx';
import { UserProvider } from './context/user.context';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import  Builder  from './page/Builder.tsx';


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/builder/:roomId" element={<Builder />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
