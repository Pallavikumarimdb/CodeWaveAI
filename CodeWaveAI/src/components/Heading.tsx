// import TagLine from "./Tagline";

import React from "react";

interface HeadingProps {
  className?: string;
  title?: string;
  text?: string;
  tag?: keyof JSX.IntrinsicElements; // Allows specifying a valid HTML tag
}

const Heading: React.FC<HeadingProps> = ({ className = "", title, text, tag: Tag = "div" }) => {
  return (
    <Tag className={`${className} max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center`}>
      {title && <h2 className="h2">{title}</h2>}
      {text && <p className="body-2 mt-4 text-n-4">{text}</p>}
    </Tag>
  );
};

export default Heading;
