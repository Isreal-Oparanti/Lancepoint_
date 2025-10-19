"use client";
// import Header from "@/components/Navbar/Header";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";


export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNmY1ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOTEzOSAxLjc5MDg2MS00IDQtNCBoMTZjMi4yMDkxMzkgMCA0IDEuNzkwODYxIDQgNHYxNmMwIDIuMjA5MTM5LTEuNzkwODYxIDQtNCA0SDQwYy0yLjIwOTEzOSAwLTQtMS43OTA4NjEtNC00VjM0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      </div>

      <main className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20">
        <section className="flex flex-col items-center justify-center py-16 md:py-12 text-center">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl">
            Freelancing <span className="text-purple-600 flex flex-"><span>DONE SMARTER</span><span><svg width="44" height="44" viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.737666 39.0511C0.358636 38.8033 0.124578 38.4664 0.0354931 38.0406C-0.0535917 37.6148 0.0263905 37.2114 0.275438 36.8306C0.524486 36.4498 0.861339 36.2157 1.28599 36.1285C1.71065 36.0412 2.11249 36.1214 2.49152 36.3693L32.9194 56.2686C33.3002 56.5176 33.5343 56.8545 33.6216 57.2791C33.7089 57.7038 33.6289 58.1071 33.3816 58.4891C33.1344 58.8711 32.7975 59.1051 32.3711 59.1913C31.9446 59.2774 31.5428 59.1971 31.1655 58.9504L0.737666 39.0511ZM7.87956 32.6795C6.82471 31.9897 6.12205 31.0579 5.77158 29.8843C5.4211 28.7107 5.46825 27.5418 5.91302 26.3777L13.8146 7.30504C13.7018 7.28234 13.5888 7.23652 13.4756 7.16761C13.3595 7.09931 13.2567 7.03593 13.1673 6.97747C12.3252 6.42676 11.8124 5.68294 11.6287 4.74602C11.445 3.8091 11.6198 2.933 12.153 2.11772C12.706 1.27206 13.4559 0.736317 14.4025 0.510501C15.3461 0.285304 16.2399 0.448645 17.0838 1.00052C17.9277 1.5524 18.4526 2.31685 18.6585 3.29387C18.8615 4.27151 18.6865 5.18316 18.1334 6.02882C18.0118 6.21476 17.8918 6.38262 17.7735 6.53238C17.6551 6.68215 17.4995 6.80499 17.3066 6.9009L22.7598 14.721C23.0131 15.0832 23.3456 15.3262 23.7573 15.4499C24.1684 15.5707 24.5948 15.5548 25.0367 15.4022L38.7021 10.3256C38.4801 9.81804 38.3924 9.28081 38.439 8.71395C38.4843 8.14888 38.6649 7.62499 38.9806 7.14226C39.5324 6.29838 40.2978 5.77406 41.2766 5.56929C42.2536 5.36335 43.1649 5.5369 44.0106 6.08995C44.8545 6.64183 45.3803 7.40687 45.588 8.38505C45.7958 9.36324 45.6248 10.2725 45.0753 11.1128C44.7432 11.6205 44.3304 12.004 43.8367 12.2631C43.3408 12.5259 42.8163 12.6564 42.2635 12.6548L43.0907 27.2091C43.128 27.6751 43.2849 28.0713 43.5616 28.3977C43.8376 28.7288 44.1923 28.9378 44.6256 29.0247L53.9777 30.8831C54.023 30.7085 54.0833 30.5246 54.1586 30.3314C54.2351 30.1364 54.3306 29.9512 54.4452 29.776C54.9983 28.9304 55.7472 28.394 56.692 28.167C57.6357 27.9419 58.5295 28.1052 59.3733 28.6571C60.2172 29.2089 60.7421 29.9734 60.9481 30.9504C61.1529 31.9292 60.9787 32.8415 60.4257 33.6871C59.8948 34.4988 59.145 34.9975 58.1761 35.1832C57.2072 35.369 56.299 35.1847 55.4515 34.6305C55.3836 34.5861 55.3137 34.5251 55.2419 34.4475C55.1701 34.3699 55.083 34.2963 54.9805 34.2267L40.7033 49.126C39.811 50.0026 38.7585 50.5152 37.5457 50.664C36.333 50.8127 35.1977 50.5425 34.1399 49.8533L7.87956 32.6795ZM9.68437 30.031L35.8428 47.1381C36.2218 47.386 36.6449 47.4904 37.1121 47.4513C37.5792 47.4122 37.9701 47.2263 38.2848 46.8935L51.235 33.707L43.9854 32.205C42.8127 31.992 41.8364 31.4493 41.0567 30.5769C40.2769 29.7045 39.863 28.6552 39.8148 27.4292L39.0955 13.6115L26.1483 18.4915C25.0057 18.9389 23.8785 18.9802 22.7667 18.6156C21.6549 18.2509 20.7655 17.5736 20.0984 16.5834L15.8163 10.5438L8.92961 27.6958C8.75084 28.1175 8.73718 28.5501 8.88864 28.9938C9.04009 29.4374 9.30534 29.7832 9.68437 30.031Z" fill="#9687FF"/>
                </svg></span></span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl">
            Connect with global talent, get paid instantly in crypto. 
            No borders, no delays, just seamless work on the blockchain.
          </p>
          
          {!connected ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 duration-300 shadow-lg shadow-purple-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Connect Wallet to start
              </button>
              {/* <button className="bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How It Works
              </button> */}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 max-w-md animate-fadeIn">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-bold text-green-700">Wallet Connected!</span>
              </div>
              <p className="text-green-600 font-medium">You're all set to start freelancing or hiring talent worldwide!</p>
              <Link href="/dashboard" className="flex items-center space-x-2"><button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition cursor-pointer" >
                Go to Dashboard
              </button></Link>
            </div>
          )}
          
          <div className="mt-16 w-full max-w-4xl">
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-1 shadow-xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  <img
                    src="/Freelancer-cuate.png"
                    alt="Decentralized Freelancing"
                    width={800}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

     
        <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl mb-16 backdrop-blur-sm bg-opacity-70">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Market Opportunity
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nigeria's Booming Freelance Economy</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                The digital freelancing market in Nigeria is rapidly expanding with massive growth potential
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-80">
                <div className="text-5xl font-bold text-purple-600 mb-4">68%</div>
                <p className="text-gray-700 font-medium">of Nigeria's 12 million freelancers have had problems with payments and dispute resolution</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-80">
                <div className="text-5xl font-bold text-purple-600 mb-4">$2B</div>
                <p className="text-gray-700 font-medium">Nigerian digital freelancers collectively made approximately $2 billion in 2024</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-80">
                <div className="text-5xl font-bold text-purple-600 mb-4">$5B</div>
                <p className="text-gray-700 font-medium">Projected annual value of Nigeria's digital freelancing economy by 2030</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 backdrop-blur-sm bg-opacity-80">
                  
              
            </div>
          </div>
        </section>

        <section className="py-16 mb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Competitive Advantage
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Lancepoint Stands Out</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                We solve the biggest challenges faced by freelancers and clients in the market
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-80">
                <h3 className="text-2xl font-bold mb-6 text-purple-700">Key Advantages</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Easy Onboarding</h4>
                      <p className="text-gray-700">Simple wallet connection and profile setup gets you started in minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Low Fees</h4>
                      <p className="text-gray-700">Transparent fee structure with no hidden costs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Easy Cross-Border Transactions</h4>
                      <p className="text-gray-700">Work with anyone, anywhere without currency conversion hassles</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-80">
                <h3 className="text-2xl font-bold mb-6 text-indigo-700">Competitive Edge</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold mb-4">Dispute Probability</h4>
                    <div className="flex items-center">
                      <div className="w-1/2 pr-4">
                        <div className="text-sm text-gray-600 mb-1">Traditional Platforms</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-red-500 h-4 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="text-right text-sm text-red-500 mt-1">High</div>
                      </div>
                      <div className="w-1/2 pl-4">
                        <div className="text-sm text-gray-600 mb-1">Lancepoint</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-green-500 h-4 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <div className="text-right text-sm text-green-500 mt-1">Low</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-4">Payment Speed</h4>
                    <div className="flex items-center">
                      <div className="w-1/2 pr-4">
                        <div className="text-sm text-gray-600 mb-1">Traditional Platforms</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-yellow-500 h-4 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <div className="text-right text-sm text-yellow-500 mt-1">Days/Weeks</div>
                      </div>
                      <div className="w-1/2 pl-4">
                        <div className="text-sm text-gray-600 mb-1">Lancepoint</div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="bg-green-500 h-4 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <div className="text-right text-sm text-green-500 mt-1">Seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

     
        <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl mb-16 backdrop-blur-sm bg-opacity-70">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Business Model
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Our fee structure is designed to be fair and competitive
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-80">
                <div className="text-5xl font-bold text-purple-600 mb-4">2%</div>
                <h3 className="text-xl font-bold mb-4">Transaction Fee</h3>
                <p className="text-gray-700 mb-6">On orders below $100</p>
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Affordable for small projects
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 backdrop-blur-sm bg-opacity-80">
                <div className="text-5xl font-bold text-purple-600 mb-4">3%</div>
                <h3 className="text-xl font-bold mb-4">Transaction Fee</h3>
                <p className="text-gray-700 mb-6">On orders above $100</p>
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Competitive for larger projects
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-white p-8 rounded-2xl shadow-md border border-gray-100 backdrop-blur-sm bg-opacity-80">
              <h3 className="text-2xl font-bold mb-6 text-center">How We Compare</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left">Platform</th>
                      <th className="py-3 px-4 text-center">Fee Structure</th>
                      <th className="py-3 px-4 text-center">Payment Speed</th>
                      <th className="py-3 px-4 text-center">Dispute Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium">Traditional Platforms</td>
                      <td className="py-3 px-4 text-center">10-20%</td>
                      <td className="py-3 px-4 text-center">Days/Weeks</td>
                      <td className="py-3 px-4 text-center">Complex</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium">Other Blockchain Solutions</td>
                      <td className="py-3 px-4 text-center">5-10%</td>
                      <td className="py-3 px-4 text-center">Minutes/Hours</td>
                      <td className="py-3 px-4 text-center">Limited</td>
                    </tr>
                    <tr className="bg-purple-50">
                      <td className="py-3 px-4 font-bold text-purple-700">Lancepoint</td>
                      <td className="py-3 px-4 text-center font-bold text-purple-700">2-3%</td>
                      <td className="py-3 px-4 text-center font-bold text-purple-700">Seconds</td>
                      <td className="py-3 px-4 text-center font-bold text-purple-700">Automated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

     
        <section className="py-16 mb-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Lancepoint Works</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Start freelancing or hiring in just a few simple steps
              </p>
            </div>
            
            <div className="relative">
             
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-indigo-400 transform md:-translate-x-1/2"></div>
              
              <div className="space-y-12">
                {[
                  { 
                    title: "Connect Your Wallet", 
                    desc: "Link your Solana wallet to get started with Lancepoint",
                    icon: "🔐"
                  },
                  { 
                    title: "Create Your Profile", 
                    desc: "Set up your freelancer or client profile with your skills and needs",
                    icon: "👤"
                  },
                  { 
                    title: "Browse Opportunities", 
                    desc: "Find projects that match your skills or talent that fits your needs",
                    icon: "🔍"
                  },
                  { 
                    title: "Complete Work", 
                    desc: "Submit your work or review and approve submissions",
                    icon: "✅"
                  },
                  { 
                    title: "Get Paid Instantly", 
                    desc: "Receive payment immediately upon approval - no delays!",
                    icon: "💰"
                  }
                ].map((step, index) => (
                  <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-1/2 mb-6 md:mb-0 md:px-8">
                      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-purple-200 transition-all backdrop-blur-sm bg-opacity-80">
                        <div className="flex items-center mb-4">
                          <div className="text-3xl mr-4">{step.icon}</div>
                          <h3 className="text-xl font-bold">{step.title}</h3>
                        </div>
                        <p className="text-gray-700">{step.desc}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start md:px-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg z-10 shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      
        <section className="py-16 mb-16">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-1 shadow-xl">
            <div className="bg-white rounded-3xl p-8 md:p-12">
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                  Join the Revolution
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Freelancing Experience?</h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Join thousands of freelancers and clients already using Lancepoint for seamless work and instant payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 duration-300 shadow-lg shadow-purple-200">
                    Connect Your Wallet Now
                  </button>
                  <button className="bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl transition-all">
                    Schedule a Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100 text-sm sm:text-base backdrop-blur-sm bg-opacity-70">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-purple-100 pb-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">
                  Lancepoint
                </span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center hover:bg-purple-100 transition">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center hover:bg-purple-100 transition">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center hover:bg-purple-100 transition">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-50 flex items-center justify-center hover:bg-purple-100 transition">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 text-gray-600">
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-600 transition">Browse Jobs</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Post a Project</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">How It Works</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-600 transition">Blog</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Community</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Tutorials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-600 transition">About Us</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Careers</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Contact</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Partners</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-600 transition">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-purple-100 text-center text-gray-500">
              © {new Date().getFullYear()} Lancepoint. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}