// import React from 'react'
import Section from './Section'
import Heading from './Heading'
import ClipPath from "../assets/svg/ClipPath.tsx";
import benefitImage2 from "../assets/robo4.jpeg"
import "./css/benefits.css"
import { GradientLight } from "./design/Benefits";
import aibrain from "../assets/benefits/ai-brain.svg";
import ai from "../assets/benefits/ai.svg";
import bug from "../assets/benefits/bug.svg";
import copy from "../assets/benefits/copy.svg";
import transfer from "../assets/benefits/transfer.svg";
import joystick from "../assets/benefits/joystick.svg";

function Benefits() {
  return (
    <div>
      <Section id="features">
        <div className="container relative z-2">
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="Work Smarter, Not Harder with CodeWaveAI"
          />
          <div className="flex flex-wrap gap-10 mb-10">
            {benefits.map((item) => (
              <div
                className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                style={{
                  backgroundImage: `url(${item.backgroundUrl})`,
                }}
                key={item.id}
              >
                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] ">
                  <h5 className="h5 mb-5">{item.title}</h5>
                  <p className="body-2 mb-6 text-n-3">{item.text}</p>
                  <div className="flex items-center mt-auto">
                    <img
                      src={item.iconUrl}
                      width={48}
                      height={48}
                      alt={item.title}
                    />
                    <a href='#' className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                      Explore more
                    </a>
                  </div>
                </div>
                {item.light && <GradientLight />}
                <div
                  className="absolute inset-0.5 bg-n-8 "
                  style={{ clipPath: "url(#benefits)" }}
                >
                  <div className="absolute inset-0 ">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        width={380}
                        height={362}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                      />
                    )}
                  </div>
                </div>
                <ClipPath />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}


export default Benefits



const benefits = [
  {
    id: "0",
    title: "Ask anything",
    text: "Lets users quickly find answers to their questions without having to search through multiple sources.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: aibrain,
    imageUrl: benefitImage2,
  },
  {
    id: "1",
    title: "Improve everyday",
    text: "The app uses natural language processing to understand user queries and provide accurate and relevant responses.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: ai,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "2",
    title: "Connect everywhere",
    text: "Connect with the AI chatbot from anywhere, on any device, making it more accessible and convenient.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: bug,
    imageUrl: benefitImage2,
  },
  {
    id: "3",
    title: "Fast responding",
    text: "Lets users quickly find answers to their questions without having to search through multiple sources.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: copy,
    imageUrl: benefitImage2,
    light: true,
  },
  {
    id: "4",
    title: "Ask anything",
    text: "Lets users quickly find answers to their questions without having to search through multiple sources.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl:joystick,
    imageUrl: benefitImage2,
    //   light: true,
  },
  {
    id: "5",
    title: "Improve everyday",
    text: "The app uses natural language processing to understand user queries and provide accurate and relevant responses.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: transfer,
    imageUrl: benefitImage2,
    // light: true,
  },
];


