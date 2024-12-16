// import { brainwaveSymbol, check } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { LeftCurve, RightCurve } from "./design/Collaboration";
import CodeWave from "../assets/CodeWaveAI-logo2.webp";
import tick from "../assets/tick.svg";

const Collaboration = () => {
  return (
    <div className="">
    <Section crosses>
      <div className="container md:flex py-24 md:py-2 lg:py-10 xl:py-20">
        <div className="max-w-[25rem] ">
          <h2 className="h2 mb-4 md:mb-8">
            AI Application for seamless collaboration
          </h2>

          <ul className="max-w-[22rem] mb-10 md:mb-14">
            {collabContent.map((item) => (
              <li className="mb-3 py-3" key={item.id}>
                <div className="flex items-center">
                  <img src={tick} width={24} height={24} alt="check" />
                  <h6 className="body-2 ml-5">{item.title}</h6>
                </div>
                {item.text && (
                  <p className="body-2 mt-3 text-n-4">{item.text}</p>
                )}
              </li>
            ))}
          </ul>

          <Button href="/pricing" white>Try now !!! </Button>
        </div>

        <div className="lg:ml-auto xl:w-[38rem] mt-4">
          <p className="body-2 mb-8 text-n-4 md:mb-16 lg:mb-32 lg:w-[22rem] lg:mx-auto">
            {collabText}
          </p>

          <div className="relative left-1/2 flex w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale:75 md:scale-100">
            <div className="flex w-60 aspect-square m-auto border border-n-6 rounded-full">
              <div className="w-[6rem] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                  <img
                  className="rounded-full inline-block"
                    src={CodeWave}
                    width={58}
                    height={58}
                    alt="brainwave"
                  />
                </div>
              </div>
            </div>
            <ul>
              {collabApps.map((app, index) => (
                <li
                  key={app.id}
                  className={`absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom rotate-${
                    index * 45
                  }`}
                >
                  <div
                    className={`relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-n-1/15 rounded-xl -rotate-${
                      index * 45
                    }`}
                  >
                    <img
                      className="m-auto"
                      width={app.width}
                      height={app.height}
                      alt={app.title}
                      src={app.icon}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>
    </Section>
    </div>
  );
};

export default Collaboration;





 const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter.";

 const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

 const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: "./src/assets/figma.png",
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: "./src/assets/Firebase.png",
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: "./src/assets/mongodb.png",
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: "./src/assets/mui.png",
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: "./src/assets/mysql.png",
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: "./src/assets/node-js.png",
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: "./src/assets/postger.png",
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: "./src/assets/prisma.webp",
    width: 38,
    height: 32,
  },
];
