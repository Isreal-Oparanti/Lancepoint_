"use client";

import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Link from "next/link";
import Image from "next/image";

const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const lamports = await connection.getBalance(publicKey);
          setBalance(lamports / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [connection, publicKey]);

  if (!publicKey) return null;

  return (
    <div className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-lg">
      {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
    </div>
  );
};

const CustomWalletButton = () => {
  const { connected, publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const baseButtonClass = "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 duration-300 shadow-md shadow-purple-200";

  if (connecting) {
    return (
      <button className={baseButtonClass} disabled>
        Connecting...
      </button>
    );
  }

  if (connected) {
    return (
      <div className="relative group">
        <button 
          className={baseButtonClass}
          onClick={() => setVisible(true)}
        >
          {publicKey && `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`}
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={() => setVisible(true)}
          >
            Change Wallet
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      className={baseButtonClass}
      onClick={() => setVisible(true)}
    >
      Connect Wallet
    </button>
  );
};

const Header = () => {
  const { connected } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center p-1.5">
                <Image
                  src="/image.png"
                  alt="Lancepoint Logo"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">Lancepoint</span>
            </Link>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            <WalletBalance />
            <CustomWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;