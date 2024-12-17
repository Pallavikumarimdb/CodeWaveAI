// import React from "react";
import Section from "./Section";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
        <ul className="flex gap-5 flex-wrap">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default Footer;



 const socials = [
    {
      id: "0",
      title: "Discord",
      iconUrl: "./src/assets/socials/discord.svg",
      url: "#",
    },
    {
      id: "1",
      title: "gitwhite",
      iconUrl: "./src/assets/socials/gitwhite.png",
      url: "https://github.com/Pallavikumarimdb",
    },
    {
      id: "2",
      title: "link",
      iconUrl: "./src/assets/socials/link.svg",
      url: "https://www.linkedin.com/in/pallavisprofile/",
    },
    {
      id: "3",
      title: "twitter",
      iconUrl: "./src/assets/socials/twitter.svg",
      url: "https://x.com/pallavimdb",
    },
  ];