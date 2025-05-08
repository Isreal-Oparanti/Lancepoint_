const About = () => {
  return (
    <section className="py-16 px-6 sm:px-10 lg:px-20 text-center  rounded-3xl">
      <div className="max-w-5xl mx-auto">
        {/* Label Pill */}
        <div className="inline-block mb-8 px-5 py-2 border border-black rounded-full shadow-md  ">
          <h2 className="text-lg sm:text-xl font-medium text-black">What is Lancepoint?</h2>
        </div>

        {/* Main Heading */}
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900">
          Your Freelance Career, <br className="hidden sm:inline" />
          Supercharged by Web3 & AI
        </h3>

        {/* Paragraph */}
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          LancePoint is a next-generation freelancing platform designed for trust, speed, and global freedom. 
          Built on blockchain, powered by AI, and integrated with seamless crypto-to-fiat systems, 
          LancePoint bridges the gap between modern freelancing and future-forward technology.
        </p>
      </div>
    </section>
  );
};

export default About;
