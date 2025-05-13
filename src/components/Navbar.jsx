"use client";

import { WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const shortenAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
};

const Navbar = () => {
  const [wallet, setWallet] = useState(null);

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

  return (
    <header className="fixed w-full top-0 right-0 bg-white text-white shadow-md border-gray-700 p-2 z-50">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end items-center gap-4">
        {wallet ? (
          <>
            <p className="text-gray-800 font-normal text-lg">
              {shortenAddress(wallet)}
            </p>
            <button onClick={copyToClipboard} className="text-black">
              Copy
            </button>
            <WalletDropdownDisconnect className="w-[10rem]">
              <button className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-400">
                Logout
              </button>
            </WalletDropdownDisconnect>
          </>
        ) : (
          <p className="text-gray-500">Not connected</p>
        )}
      </div>
    </header>
  );
};

export default Navbar;
