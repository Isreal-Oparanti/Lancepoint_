"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ZKLogin from "@/lib/ZKlogin";

const Hero = () => {
  const profiles = [
    {
      id: 1,
      imgSrc: "/images/profile1.png",
      position: "top-15 left-1/2 -translate-x-1/2",
      size: "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
    }, // Top center
    {
      id: 2,
      imgSrc: "/images/profile2.png",
      position: "top-1/4 left-1/2 translate-x-8",
      size: "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
      isSelected: true,
    }, // Top right with blue border
    {
      id: 3,
      imgSrc: "/images/profile3.png",
      position: "top-1/3 right-[10%] -translate-x-4",
      size: "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20",
    }, // Right side
    {
      id: 4,
      imgSrc: "/images/profile4.png",
      position: "bottom-1/3 right-1/3",
      size: "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
    }, // Bottom right
    {
      id: 5,
      imgSrc: "/images/profile5.png",
      position: "bottom-[8%] left-1/2 -translate-x-1/3",
      size: "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20",
    }, // Bottom
    {
      id: 6,
      imgSrc: "/images/profile6.png",
      position: "left-[30%] top-1/2",
      size: "w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14",
    }, // Left side
    {
      id: 7,
      imgSrc: "/images/profile7.png",
      position: "left-[12%] top-1/2",
      size: "w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18",
    }, // Left top
  ];

  return (
    <div className="relative flex items-center justify-between flex-col md:flex-row py-8 sm:py-12 bg-transparent min-h-[400px] sm:min-h-[500px]">
      {/* Main content */}
      <div className="max-w-xs sm:max-w-sm md:max-w-lg mb-20 md:mb-0">
        <h1 className="text-3xl text-center sm:text-left sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
          Where Talent
          <br />
          Meets
          <br />
          Opportunity
        </h1>
        <p className="text-[16px] font-[600] text-center sm:text-left sm:text-base text-black my-10 sm:mb-8">
          Match with top talent or clients, submit your work with confidence,
          and get paid seamlessly, all in one platform
        </p>
      </div>

      {/* Profile images floating around */}

      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex justify-center items-center">
        {/* <div className="absolute w-[160px] h-[160px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] rounded-full border border-white/50"></div>
          <div className="absolute w-[320px] h-[320px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] rounded-full border border-white/50"></div> */}

        {/* Play button */}
        {/* <button 
            className="absolute z-20 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
          >
            <div className="text-purple-500">
              <Image 
                src={"/icons/play.svg"} 
                alt={"play button"} 
                layout="fill" 
                objectFit="cover"
              />
            </div>
          </button> */}

        {/* Profiles */}
        {/* {profiles.map((profile) => (
            <div 
              key={profile.id}
              className={`absolute ${profile.position} ${profile.size} rounded-full overflow-hidden z-10 ${profile.isSelected ? 'border-2 border-blue-400' : ''}`}
            >
              <Image 
                src={profile.imgSrc} 
                alt={`Profile ${profile.id}`} 
                layout="fill" 
                objectFit="cover"
              />
              {profile.isSelected && (
                <div className="absolute -bottom-6 left-0 w-full text-center text-xs text-blue-400">59 × 59</div>
              )}
            </div>
          ))} */}

        <div className="atom-container flex items-center justify-center">
          {" "}
          {/* Add a container element */}
          <div className="atom-orbit w-full h-full">
            <div className="electron"></div>
            <div className="electron2"></div>
            <div className="electron3"></div>
            <div className="electron4"></div>
            <div className="electron5"></div>
            <div className="electron6"></div>
            <div className="electron7"></div>
          </div>
          <div className="atom-nucleus"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
