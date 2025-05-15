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
          {/* BASED AFRICA */}
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            {/* Uncomment and replace src when ready */}
            {/* <div className="relative h-10 w-10">
              <Image
                src="/icons/superteam.svg"
                alt="BASED AFRICA"
                fill
                className="object-contain"
              />
            </div> */}
            <span className="text-lg sm:text-xl font-semibold">
              BASED AFRICA
            </span>
          </div>

          {/* BASE */}
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            <div className="relative h-10 w-10">
              <Image
                src="/base-logo.png"
                alt="BASE"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-semibold">BASE</span>
          </div>

          {/* ENB */}
          <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition duration-300">
            {/* Uncomment and replace src when ready */}
            {/* <div className="relative h-10 w-10">
              <Image
                src="/icons/wormhole.svg"
                alt="ENB"
                fill
                className="object-contain"
              />
            </div> */}
            <span className="text-lg sm:text-xl font-semibold">ENB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
