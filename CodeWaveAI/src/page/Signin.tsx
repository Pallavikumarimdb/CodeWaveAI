import { useRef  } from "react";
import.meta.env.BACKEND_URL;
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export function Signin () {
    const usernameRef = useRef<HTMLInputElement | null>(null); 
    const passwordRef = useRef<HTMLInputElement | null>(null); 
    const navigate = useNavigate();


    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            const response = await axios.post(process.env.BACKEND_URL + "/users/api/v1/signin", {
                username,
                password
            })
            const { token } = response.data; // Extract token and user data

            if (token) {
                localStorage.setItem("token", token); // Save token to localStorage
                navigate("/Home"); // Navigate to the Home page
            }
        } catch (error) {
            console.error("Sign-in failed:", error);
        }
    }
    return <div className="h-screen w-screen bg-n-8 flex justify-between px-[15%] items-center">
        <div className=" text-center rounded-xl border min-w-48 p-8">
            <h1 className="text-2xl mb-10 font-bold text-gray-700">Sign In</h1>
            <input className="p-2 mr-4 rounded-lg" ref={usernameRef} placeholder="Username" />
            <input className="p-2 mr-4 rounded-lg" ref={passwordRef} placeholder="Password" />
            <div className=" justify-center pt-6">
                <button className="p-2 mr-4 bg-gray-700 text-white rounded-lg" onClick={signin}>SignIn</button>
                    <Link to="/signup/" className="">
                    <div className="mt-6"><a className="underline underline-offset-1 mt-10 text-blue-900" href="/signup">Sign Up</a></div>
                    </Link>
            </div>
        </div>
        <div>
        </div>
    </div>
}