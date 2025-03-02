import loading from "../assets/load.png";

//@ts-ignore
const Generating = ({Generating, className }) => {
  return (
    <div
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/90 rounded-[1.7rem] ${
        className || ""
      } text-base`}
    >
      <img className="w-9 h-9 mr-4" src={loading} alt="Loading" />
      {Generating}
    </div>
  );
};

export default Generating;