"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ZKLogin from "@/lib/ZKlogin";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="flex items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/icons/logo.svg"
            alt="Lancepoint Logo"
            width={32}
            height={32}
            className="h-6 w-6 sm:h-8 sm:w-8"
          />
          <span className="ml-2 font-semibold text-base sm:text-lg">
            Lancepoint
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 ml-20 mr-auto">
          <Link
            href="/"
            className="header-nav-color hover:text-gray-600 text-[16px] font-semibold lg:text-base"
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className="header-nav-color hover:text-gray-600 text-[16px] font-semibold lg:text-base"
          >
            Jobs
          </Link>
          <Link
            href="/payments"
            className="header-nav-color hover:text-gray-600 text-[16px] font-semibold lg:text-base"
          >
            Payments
          </Link>
        </nav>

        {/* Sign Up Button */}
        <div className="hidden md:block">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <ZKLogin />
          </div>
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 py-2">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-black hover:text-gray-600 text-[16px] font-semibold"
            >
              Home
            </Link>
            <Link
              href="/jobs"
              className="text-black hover:text-gray-600 text-[16px] font-semibold"
            >
              Jobs
            </Link>
            <Link
              href="/payments"
              className="text-black hover:text-gray-600 text-[16px] font-semibold"
            >
              Payments
            </Link>
          </nav>
          <div className="mt-4">
            <Link
              href="/signup"
              className="inline-block bg-black text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-gray-800 transition duration-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
