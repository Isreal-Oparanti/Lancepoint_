"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();
  const { publicKey } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getShortAddress = () => {
    if (!publicKey) return "Not Connected";
    const address = publicKey.toString();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleCopy = useCallback(async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toString());
    toast.success("Wallet address copied to clipboard!");
  }, [publicKey]);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      )
    },
    {
      name: "Create Gig",
      href: "/create-gig",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Browse Gigs",
      href: "/browse-gigs",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Orders",
      href: "/orders",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      )
    },
    // {
    //   name: "Earnings",
    //   href: "/earnings",
    //   icon: (
    //     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    //       <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    //       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    //     </svg>
    //   )
    // }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:top-16 lg:bottom-0 lg:bg-gradient-to-b lg:from-purple-900 lg:to-indigo-900 lg:border-r lg:border-purple-700 shadow-2xl">
        {/* User Profile Section */}
        <div className="p-6 border-b border-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">

              <p
                onClick={handleCopy}
                title="Click to copy"
                className="text-xs text-purple-400 truncate cursor-pointer hover:text-purple-600 transition-colors"
              >
                {getShortAddress()}
              </p>

            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-2 flex-1 px-3 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                      ? "bg-white text-purple-900 shadow-lg transform scale-105"
                      : "text-purple-100 hover:bg-purple-800 hover:text-white hover:shadow-md"
                    }`}
                >
                  <span className={`mr-3 transition-colors duration-200 ${isActive ? "text-purple-600" : "text-purple-300 group-hover:text-white"
                    }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 to-indigo-900 border-t border-purple-700 z-50 shadow-2xl">
        <nav className="flex justify-around py-3">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center py-1 px-3 text-xs transition-all duration-200 rounded-lg ${isActive
                    ? "bg-white text-purple-900 shadow-lg transform -translate-y-1"
                    : "text-purple-100 hover:text-white"
                  }`}
              >
                <span className={`mb-1 transition-colors duration-200 ${isActive ? "text-purple-600" : "text-purple-300"
                  }`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Button for Extra Items */}
      <div className="lg:hidden fixed top-20 right-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full shadow-lg border border-purple-500 text-white hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute right-0 top-14 bg-gradient-to-b from-purple-800 to-indigo-800 border border-purple-600 rounded-xl shadow-2xl py-2 w-48 backdrop-blur-sm">
            {menuItems.slice(5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${isActive
                      ? "bg-white text-purple-900 font-semibold"
                      : "text-purple-100 hover:bg-purple-700 hover:text-white"
                    }`}
                >
                  <span className={`mr-3 ${isActive ? "text-purple-600" : "text-purple-300"
                    }`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar; 