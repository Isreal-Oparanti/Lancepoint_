"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WalletComponent } from "../ConnectWallet";
import { useRouter } from "next/navigation";

const WALLET_KEY = "-walletlink:https://www.walletlink.org:Addresses";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const walletData = localStorage.getItem(WALLET_KEY);
    const isHomePage = router.pathname === "/";

    if (walletData && isHomePage) {
      router.replace("/dashboard");
    }
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/icons/logo.svg"
            alt="Lancepoint Logo"
            width={32}
            height={32}
            className="h-6 w-6 sm:h-8 sm:w-8"
          />
          <a
            href="/"
            className="ml-2 plus-jakarta-sans-myf font-bold text-3xl sm:text-lg text-black"
            style={{ fontSize: "30px" }}
          >
            Lancepoint
          </a>
        </div>

        {!isMobile && <WalletComponent />}

        <div className="md:hidden ml-auto">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && isMobile && (
        <div className="md:hidden mt-4 py-2">
          <nav className="flex flex-col space-y-3">
            <WalletComponent />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
