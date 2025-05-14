"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { WalletAdvancedDefault } from "@coinbase/onchainkit/wallet";
import { WalletIsland } from "@coinbase/onchainkit/wallet";

const shortenAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
};

const Navbar = () => {
  const [wallet, setWallet] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const address = localStorage.getItem("fullAddress");
    setWallet(address);
  }, []);

  const copyToClipboard = async () => {
    try {
      if (wallet) {
        await navigator.clipboard.writeText(wallet);
        toast.success("Wallet address copied!");
      }
    } catch (err) {
      toast.error("Failed to copy address.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fullAddress");
    localStorage.removeItem("shortWalletAddress");
    localStorage.removeItem("-walletlink:https://www.walletlink.org:Addresses");

    router.push("/");

    toast.success("Logged out successfully");

    setWallet(null);
  };

  return (
    <header className="fixed w-full top-0 right-0 bg-[#191c21] text-white shadow-md border-gray-700 p-3 z-50 ">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex items-center justify-end">
        <div className="max-w-7xl mx-auto px-4 py-4  justify-end items-center gap-4 hidden">
          {wallet ? (
            <div className="flex items-center gap-3">
              <p className="text-white font-normal text-lg">
                {shortenAddress(wallet)}
              </p>

              {/* Copy icon button */}
              <button
                onClick={copyToClipboard}
                className="text-white"
                aria-label="Copy wallet address"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className=" text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Not connected</p>
          )}
        </div>

        <WalletAdvancedDefault />
        <WalletIsland />
      </div>
    </header>
  );
};

export default Navbar;
