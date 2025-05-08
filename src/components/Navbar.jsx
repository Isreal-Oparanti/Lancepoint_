import ZKLogin from "@/lib/ZKlogin";
import React from "react";

const Navbar = () => {
  return (
    <header className="fixed w-full top-0 right-0 bg-white text-white shadow-md  border-gray-700 p-2">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
          
        <nav>
          <ZKLogin />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
