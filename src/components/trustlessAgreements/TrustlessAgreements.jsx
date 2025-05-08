import React from 'react';
import Image from 'next/image';

const TrustlessAgreements = () => {
  const features = [
    {
      id: 1,
      title: "Smart Contract-Based Agreements",
    },
    {
      id: 2,
      title: "AI-Powered Submission Reviews",
    },
    {
      id: 3,
      title: "Automatic Approval Based on Contract Terms",
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left column - Text */}
        <div>
          <h3 className="text-[40px] sm:text-[39px] font-bold mb-6">
            Experience freelancing<br />
            with trustless agreements
          </h3>
          
          <p className="mb-6 text-[40px] sm:text-base">
            At Lancepoint, every contract between client and freelancer is recorded on-chain. We use AI to review deliverables based on agreed terms—automatically approving or flagging submissions for human review. No middlemen. Just pure, transparent resolution.
          </p>
          
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.id} className="flex items-center text-[16px] sm:text-base">
                <span className="text-purple-600 mr-2">
                  <Image 
                    src="/icons/star.svg" 
                    alt="Star"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </span>
                {feature.title}
              </li>
            ))}
          </ul>
        </div>
        
        
        <div className="relative w-full h-64 md:h-80">
          <Image 
            src="/images/ai-brain.png" 
            alt="AI-powered trustless agreements"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default TrustlessAgreements;