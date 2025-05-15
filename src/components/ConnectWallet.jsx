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
import "@coinbase/onchainkit/styles.css";

import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { registerWithBaseAuth } from "@/actions/baseAuth";
import Link from "next/link";

export function WalletComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const checkWalletConnection = async () => {
    if (typeof window === "undefined") return;

    setLoading(true);
    try {
      let address = localStorage.getItem(
        "-walletlink:https://www.walletlink.org:Addresses"
      );

      if (address) {
        const cleanAddress = address.replace(/[\[\]"]/g, "");
        const slicedAddress = cleanAddress.slice(0, 10);

        setWalletAddress(cleanAddress);
        localStorage.setItem("shortWalletAddress", slicedAddress);
        localStorage.setItem("fullAddress", cleanAddress);
        setIsConnected(true);

        const registrationResult = await registerWithBaseAuth(cleanAddress);

        if (registrationResult?.error) {
          console.error("Registration error:", registrationResult.error);
        }

        if (
          pathname === "/" &&
          registrationResult?.success &&
          !registrationResult?.isNewUser
        ) {
          router.push("/dashboard");
        }
      } else {
        setWalletAddress(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setWalletAddress(null);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWalletConnection();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        checkWalletConnection();
      } else {
        setWalletAddress(null);
        setIsConnected(false);
        localStorage.removeItem("shortWalletAddress");
        localStorage.removeItem("fullAddress");
      }
    };

    const handleChainChanged = () => {
      checkWalletConnection();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-sm">Checking wallet connection...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center gap-4">
      {isConnected && (
        <>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 p-3 bg-white rounded-md"
          >
            Dashboard
          </Link>
          <span className="text-sm text-gray-600">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
        </>
      )}
      <Wallet>
        {!isConnected && (
          <ConnectWallet
            className="bg-blue-800 text-white p-2 rounded-md"
            disconnectedLabel="Connect Wallet"
            onClick={() =>
              window.open("https://wallet.coinbase.com/", "_blank")
            }
          >
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        )}
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
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownLink
                className="w-full"
                icon="wallet"
                href="/dashboard"
                rel="noopener noreferrer"
              >
                Dashboard
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
