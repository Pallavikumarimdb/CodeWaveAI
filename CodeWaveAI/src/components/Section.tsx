import React from "react";
import SectionSvg from "../assets/svg/SectionSvg";

interface SectionProps {
  className?: string;
  id?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: boolean;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  className = "",
  id,
  crosses = false,
  crossesOffset = "",
  customPaddings = "",
  children,
}) => {
  return (
    <div
      id={id}
      className={`
        relative 
        ${
          customPaddings ||
          `py-0 lg:py-0 xl:py-0 ${crosses ? "lg:py-22 xl:py-20" : ""}`
        } 
        ${className}`}
    >
      {children}

      <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:left-7.5 xl:left-10" />
      <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />

      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.2 h-0.25 bg-stroke-1 ${
              crossesOffset || ""
            } pointer-events-none lg:block xl:left-10 right-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default Section;
