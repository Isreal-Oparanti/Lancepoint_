import React from 'react';
import Image from 'next/image';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: 'Superteam',
      logo: '/icons/superteam.svg'
    },
    {
      id: 2,
      name: 'Solana',
      logo: '/icons/solana.svg'
    },
    {
      id: 3,
      name: 'Wormhole',
      logo: '/icons/wormhole.svg'
    }
  ];

  return (
    <div className="py-5 sm:py-9">
      <div className='font-bold text-3xl mb-10 text-center'>Trusted by Top Brands</div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-24 place-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 transition duration-300">
              <div className="relative h-6 sm:h-8 md:h-10 w-32 sm:w-40">
                <Image 
                  src={partner.logo} 
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;