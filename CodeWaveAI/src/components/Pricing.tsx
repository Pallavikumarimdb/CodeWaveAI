import Section from "./Section";
import  stars  from "../assets/stars.svg";
import smallSphere from "../assets/4-small.png"
import Heading from "./Heading";
import Button from "./Button";

const Pricing = () => {
  return (
    <Section className="" id="pricing" crosses>
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1"
            width={255}
            height={255}
            alt="Sphere"
          />
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
        <p className="block text-center text-n-3 mb-5 text-sm">[ Get started with CodeWaveAI ]</p>
        <Heading
          title="Pay once, use forever"
        />
         <div className="text-center">
         <Button href="/login" white >Try now !!! </Button>
         </div>

        <div className="flex justify-center mt-10">
          <a
            className="text-xs font-code font-bold tracking-wider uppercase border-b"
            href="#"
          >
            See the full details
          </a>
          <br/>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;