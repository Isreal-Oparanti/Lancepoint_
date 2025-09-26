"use client";

import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
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
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-700 hover:!to-indigo-700 !text-white !font-bold !py-2 !px-6 !rounded-lg !transition-all !transform hover:!scale-105 !duration-300 !shadow-md !shadow-purple-200" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;