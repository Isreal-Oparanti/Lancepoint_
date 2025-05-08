"use client";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm sm:text-base">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-800 pb-10">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <Image src="/icons/logo.svg" alt="Lancepoint Logo" width={28} height={28} />
            <span className="text-lg font-semibold tracking-wide">Lancepoint</span>
          </div>

          {/* Scroll to top */}
          <button
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 text-gray-400">
          <div>
            <h3 className="text-white font-semibold mb-3">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="hover:text-white transition">Jobs</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">For Clients</h3>
            <ul className="space-y-2">
              <li><Link href="/for-customers" className="hover:text-white transition">Why Lancepoint?</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-white transition">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center text-lg text-gray-500">
          © {new Date().getFullYear()} Lancepoint. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
