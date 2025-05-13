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
import React, { useEffect, useState } from "react";

const Navbar = () => {
  console.log("Navbar component rendered :", Address);
  return (
    <header className="fixed w-full top-0 right-0 bg-white text-white shadow-md border-gray-700 p-2 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
        <nav>
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown className="absolute right-0 z-50 w-full min-w-[350px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <div className="w-full">
                <Identity
                  className="px-4 pt-3 pb-2 w-full"
                  hasCopyAddressOnClick
                >
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
