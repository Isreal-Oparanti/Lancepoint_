const Hero = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center md:items-start md:justify-between gap-y-8 md:gap-y-0 md:gap-x-8 py-12 px-4 md:px-16 min-h-[500px] ">
      <div className="w-full md:w-7/12 text-center mt-[3rem]">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-snug mb-6">
          Web3 Enhanced Environment
          <br></br>
          Where talents meets Opportunities
        </h1>
        <p className="text-xl text-gray-700  mb-6">
          Connect with top-tier Web3 professionals and forward-thinking
          projects. Our platform empowers developers, designers, strategists,
          and visionaries to collaborate seamlessly, build real-world solutions,
          and get rewarded fairly.
        </p>
      </div>

      <div className="w-full mt-8 md:w-5/12 flex justify-center">
        <div className="atom-container">
          <div className="atom-orbit"></div>
          <div className="electron-wrapper">
            <div className="electron electron1"></div>
            <div className="electron electron2"></div>
            <div className="electron electron3"></div>
            <div className="electron electron7"></div>
            <div className="electron electron4"></div>
            <div className="electron electron5"></div>
            <div className="electron electron6"></div>
          </div>
          <div className="atom-nucleus"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
