import Section from "./Section";
import Heading from "./Heading";
import tick from "../assets/tick.svg";
// import service1 from "../assets/robo3.jpg";
import service11 from "../assets/fix-issue.png";
// import service2 from "../assets/web2.webp";
import service22 from "../assets/web6.png";
// import service3 from "../assets/web1.webp";
import service33 from "../assets/web4.png";
import { GradientLight } from "./design/Benefits";
import { ScrollParallax } from "react-just-parallax";
import aibrain from "../assets/benefits/ai-brain.svg";
import ai from "../assets/benefits/ai.svg";
import bug from "../assets/benefits/bug.svg";
import copy from "../assets/benefits/copy.svg";
import transfer from "../assets/benefits/transfer.svg";

import {
  PhotoChatMessage,
  Gradient,
  VideoChatMessage,
} from "./design/Services";

import Generating from "./Generating";

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="container mb-20">
        <Heading
          title="Generative AI made for Coder."
          text="CodeWaveAI unlocks the potential of AI-powered applications"
        />
        <GradientLight />
        <div className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-contain md:object-right"
                width={800}
                height={730}
                alt="Smartest AI"
                src={service11}
              />
            </div>

            <div className="relative z-1 bg-slate-200/60 p-8 mt-20 rounded-lg max-w-[19rem] ml-auto">
              <h4 className="h4 text-black font-bold mb-4">Smartest AI</h4>
              <p className="body-2 mb-[3rem] text-n-3 text-black">
                CodeWaveAI unlocks the potential of AI-powered applications
              </p>
              <ul className="body-2">
                {brainwaveServices.map((item, index) => (
                  <li
                    key={index}
                    className="flex text-black items-start py-4 border-t border-n-6"
                  >
                    <img width={24} height={24} src={tick} />
                    <p className="ml-4">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <ScrollParallax isAbsolutelyPositioned>
              <Generating className="absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" Generating={"AI is editing . . . ."} />
            </ScrollParallax>
          </div>
          <div className="relative z-1 grid gap-5  lg:grid-cols-2">
            <div className="relative min-h-[20rem] border border-n-1/10 rounded-3xl overflow-hidden">
              <div className="mb-20 absolute inset-0">
                <img
                  src={service22}
                  className="h-full w-full object-contain"
                  width={630}
                  height={550}
                  alt="robot"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-n-8/0 to-n-8/90 lg:p-15">
                <h4 className="h4 mb-4">Code editing</h4>
                <p className="body-2  text-n-3">
                  Automatically enhance your coding speed our AI app&apos;s
                  code editing feature. Try it now!
                </p>
              </div>
              <ScrollParallax isAbsolutelyPositioned>
                <PhotoChatMessage />
              </ScrollParallax>
            </div>
            <div className="p-4 bg-n-7 rounded-3xl bg-transparent border border-n-1/10  overflow-hidden lg:min-h-[36rem]">
              <div className="py-12 px-4 xl:px-8">
                <h4 className="h4 mb-4">Code generation</h4>
                <p className="body-2  text-n-3">
                  Powerful AI code and text generation
                  engine. What will you create?
                </p>
                <ul className="flex items-center justify-between">
                  {brainwaveServicesIcons.map((item, index) => (
                    <li
                      key={index}
                      className={`rounded-2xl flex items-center justify-center ${index === 2
                          ? "w-[3rem] h-[3rem] p-0.25 bg-conic-gradient md:w-[4.5rem] md:h-[4.5rem]"
                          : "flex w-10 h-10 bg-n-6 md:w-15 md:h-15"
                        }`}
                    >
                      <div
                        className={
                          index === 2
                            ? "flex items-center justify-center w-full h-full bg-n-7 rounded-[1rem]"
                            : ""
                        }
                      >
                        <img src={item} width={44} height={44} alt={item} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[18rem] rounded-xl overflow-hidden md:h-[20rem]">
                <img
                  src={service33}
                  className="w-full h-full object-contain"
                  width={520}
                  height={400}
                  alt="Scary robot"
                />
                <VideoChatMessage />
              </div>
            </div>
          </div>
          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;



const brainwaveServices = [
  "Code generating",
  "Code enhance",
  "Seamless Integration",
];

const brainwaveServicesIcons = [
  aibrain,
  ai,
  bug,
  copy,
  transfer,
];