import { useRef } from "react";
import axios from "axios";
import.meta.env.BACKEND_URL;
import { Link, useNavigate } from "react-router-dom";
import Section from "../components/Section";
import stars from "../assets/stars.svg";


export function Signup() {
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        await axios.post(process.env.BACKEND_URL + "/users/api/v1/signup", {
            username,
            password
        })
        navigate("/login")
        alert("You have signed up!")
    }

    return <Section className="" crosses>
        <div className="container relative z-2">
            <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
                <div className="absolute top-1/4 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <img
                        src={stars}
                        className="w-full"
                        width={950}
                        height={400}
                        alt="Stars"
                    />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="bg-[#0E161B] rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-200 mb-8 text-center">Sign up</h1>

                    <div className="mb-6">
                        <input
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            ref={usernameRef}
                            placeholder="Username"
                        />
                    </div>

                    <div className="mb-6">
                        <input
                            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            ref={passwordRef}
                            type="password"
                            placeholder="Password"
                        />
                    </div>

                    <button className=" h-11 w-[100%]  hidden lg:flex items-center justify-center p-0.5 mt-10 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group button-css hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                        onClick={signup}
                    >
                        Sign Up
                    </button>


                    <div className="mt-6 text-center">
                        <span className="text-gray-400">Don't have an account? </span>
                        <Link to="/login" className="text-blue-500 hover:text-blue-800 font-semibold underline underline-offset-2 transition-all">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            <br />
        </div>
    </Section>
}