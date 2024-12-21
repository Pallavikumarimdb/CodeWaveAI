import curve from "../assets/curve.png";
import heroBackground from "../assets/robo1.jpeg";
import robot from "../assets/robo1.jpeg"
import Button from "./Button";
import Section from "./Section.tsx";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
// import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";

function Hero() {
    const parallaxRef = useRef(null);

    return (
        <Section
            className="pt-[9rem] -mt-[5.25rem]"
            crosses
            crossesOffset="lg:translate-y-[5.25rem]"
            customPaddings
            id="hero"
        >
            
            <div className="container relative pt-10" ref={parallaxRef}>
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                    <h1 className="h1 mb-6">
                        Explore the Possibilities of&nbsp;AI&nbsp; with {` `}
                        <span className="inline-block relative">
                            CodeWaveAI{" "}
                            {/* <img
                                src={curve}
                                className="absolute top-full left-0 w-full xl:-mt-2"
                                width={624}
                                height={28}
                                alt="Curve"
                            /> */}
                        </span>
                    </h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        Unleash the power of AI within CodeWaveAI. Upgrade your productivity
                        with CodeWaveAI, the open AI Dev Tool.
                    </p>
                    <Button href="/pricing" white>
                       Code Editor
                    </Button>
                    <button className="relative ml-10 mt-2  inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900  rounded-md group-hover:bg-opacity-0">
                        Generat.it
                        </span>
                    </button>
                </div>
                <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
                    
                    <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                        <div className="relative bg-n-8 rounded-[1rem]">
                            <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                            <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/500]">
                                <img
                                    src={robot}
                                    className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                                    width={1024}
                                    height={490}
                                    alt="AI"
                                />

                                <ScrollParallax isAbsolutelyPositioned> 
                                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
                                </ScrollParallax>
                            </div>
                        </div>
                        <Gradient />
                    </div>
                    <div className=" absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%] ">
                        <img
                            src={heroBackground}
                            className="h-[1800px] w-full opacity-5 mt-[70px]"
                            width={1440}
                            height={1800}
                            alt="hero"
                        />
                    </div>
                    <BackgroundCircles />
                </div>
            </div>
            <BottomLine />
        </Section>
    )
}

export default Hero;