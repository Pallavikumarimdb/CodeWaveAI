import React from 'react'
// useLocation hook returns the location object used by the react-router.
import { useLocation } from 'react-router-dom'
// programmatically disable and enable scrolling on a webpage
import { disablePageScroll, enablePageScroll } from "scroll-lock";

import MenuSvg from "../assets/svg/MenuSvg.tsx";
import CodeWave from "../assets/CodeWaveAI-logo2.webp";
import { useState } from 'react';
import { HamburgerMenu } from "./design/Header";
import './css/header.css'

const navigation = [
  {
    id: "0",
    title: "Features",
    url: "#features",
  },
  {
    id: "1",
    title: "Pricing",
    url: "#pricing",
  },
  {
    id: "2",
    title: "How to use",
    url: "#how-to-use",
  },
  {
    id: "3",
    title: "Roadmap",
    url: "#roadmap",
  },
  {
    id: "4",
    title: "New account",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "5",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];



function Header(): JSX.Element {

  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  }


  return (
    <div className={`fixed top-0 w-full z-50 border-b border-n-6 border-slate-600 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"}`}>

      <div className="flex  item-center pt-4 pb-4 px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[13rem] xl:mr-8 text-xl font-bold" href='#'>
          <img className="rounded-full inline-block mr-[10px]" src={CodeWave} width={53} height={20} alt="CodeWaveAI" />
          CodeWaveAI
        </a>

        <nav
          className={`${openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? "lg:hidden" : ""
                  } lg:text-xs lg:font-semibold ${item.url === pathname.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>


        <a href="#signup" className="button hidden mt-4 text-n-1/50 transition-colors hover:text-n-1 lg:block">
          New account
        </a>
        <button className="relative h-11 w-[120px]  hidden lg:flex items-center justify-center p-0.5 me-2 ml-8 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group button-css hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
        <span className="relative px-5  py-2.5 transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0">
            Sign in
          </span>
        </button>

        <button onClick={toggleNavigation} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 ml-auto lg:hidden">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-transparent rounded-md group-hover:bg-opacity-0">

            <MenuSvg openNavigation={openNavigation} />
          </span>
        </button>


      </div>

    </div>
  )
}

export default Header
