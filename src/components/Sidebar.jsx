"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "3.png" },
    { href: "/browse-gigs", label: "Browse Gigs", icon: "/4.png" },
    { href: "/live-gigs", label: "Live Gigs", icon: "/2.png" },
    { href: "/applications", label: "Applications", icon: "/1.png" },
    {
      href: "/create-new-gig",
      label: "Create Gigs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        className="md:hidden fixed top-4 left-4 z-30 rounded-md p-2"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
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
          <div className="bg-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
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
            <a
              href="/"
              className="flex items-center justify-center ml-1 text-2xl font-bold"
            >
              <img
                src="/Lance@3x3.png"
                alt="Logo"
                className="w-7 h-7 app-font mr-2"
              />{" "}
              Lancepoint
            </a>
          </div>
        )}
      </button>

      <button
        className="hidden md:block fixed top-4 left-4 z-30 bg-[#191c21] rounded-md p-2"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        )}
      </button>

      <aside
        className={`font-plus bg-[#191c21] shadow-md h-screen fixed z-20 transition-all duration-300 ease-in-out
          ${
            isMobile
              ? sidebarOpen
                ? "w-[18rem] left-0"
                : "w-[18rem] -left-[18rem]"
              : isCollapsed
              ? "w-[4.5rem]"
              : "w-[18rem]"
          }`}
      >
        <div
          className={`text-2xl p-6 text-white font-bold flex items-center mt-[7rem] ${
            isCollapsed && !isMobile ? "justify-center" : "space-x-2"
          }`}
        >
          {(!isCollapsed || isMobile) && (
            <a href="/" className="flex items-center ml-9">
              <img
                src="/Lance@3x3.png"
                alt="Logo"
                className="w-6 h-6 app-font mr-2"
              />{" "}
              Lancepoint
            </a>
          )}
        </div>
        <ul className="space-y-4 flex flex-col p-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex app-font items-center ${
                  isCollapsed && !isMobile ? "justify-center" : "gap-3"
                } p-4 rounded-md text-[16px] font-medium
                  ${
                    pathname === link.href
                      ? "bg-black text-white"
                      : "text-white hover:bg-gray-700"
                  } transition-colors duration-200
                `}
              >
                {typeof link.icon === "string" ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img
                      src={link.icon}
                      alt={`${link.label} icon`}
                      className="w-full h-full filter brightness-0 invert"
                    />
                  </div>
                ) : (
                  link.icon
                )}
                {(!isCollapsed || isMobile) && link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div
        className={`transition-all duration-300 ease-in-out
          ${isMobile ? "ml-0" : isCollapsed ? "ml-[4.5rem]" : "ml-[18rem]"}`}
      />
    </>
  );
}
