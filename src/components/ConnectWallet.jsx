"use client";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
  WalletDropdownBasename,
  WalletDropdownFundLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithBaseAuth } from "@/actions/baseAuth";

export function WalletComponents() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checkingConnection, setCheckingConnection] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined") {
        setCheckingConnection(true);
        try {
          const address = localStorage.getItem(
            "-walletlink:https://www.walletlink.org:Addresses"
          );

          if (address) {
            const slicedAddress = address.slice(0, 10);

            localStorage.setItem("shortWalletAddress", slicedAddress);

            console.log("Connected wallet address:", address);
            console.log("Shortened address stored:", slicedAddress);

            await registerWithBaseAuth(address);
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        } finally {
          setLoading(false);
          setCheckingConnection(false);
        }
      }
    };

    checkWalletConnection();

    const intervalId = setInterval(checkWalletConnection, 1000);

    return () => clearInterval(intervalId);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-sm">Checking wallet connection...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          {checkingConnection && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown className="absolute right-0 z-50 w-full min-w-[350px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="w-full">
            <Identity className="px-4 pt-3 pb-2 w-full" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
              <EthBalance />
            </Identity>
            <div className="w-full py-1">
              <WalletDropdownBasename className="w-full" />
              <WalletDropdownLink
                className="w-full"
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownFundLink className="w-full" />
              <WalletDropdownDisconnect className="w-full" />
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
