import React from "react";
import Image from "next/image";

const Partners = () => {
  return (
    <div className="py-5 sm:py-9">
      <div className="font-bold text-3xl mb-10 text-center">
        Trusted by Top Brands
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-24 place-items-center">
          {/* BASE */}

          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            <div className="relative">
              <Image
                src="/Base_Wordmark_Black 1.png"
                alt="BASE"
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            {/* Uncomment and replace src when ready */}
            <div className="relative">
              <Image
                src="/Based Africa.png"
                width={100}
                height={100}
                alt="BASED AFRICA"
              />
            </div>
          </div>

          {/* BASED AFRICA */}

          {/* ENB */}
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            {/* Uncomment and replace src when ready */}
            <div className="relative ">
              <Image src="/ENB.png" width={100} height={100} alt="ENB" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
