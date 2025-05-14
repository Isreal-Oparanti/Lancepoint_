"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains"; // add baseSepolia for testing
import { useState } from "react";
import { getConfig } from "./wagmi";
import { WagmiProvider } from "wagmi";
// import { getConfig } from "@/wagmi"; // your import path may vary

export function OnchainProviders(props) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  const apiKey =
    typeof window !== "undefined"
      ? window.ENV?.NEXT_PUBLIC_ONCHAINKIT_API_KEY
      : undefined;

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={apiKey}
          chain={base} // add baseSepolia for testing
          config={{
            appearance: {
              name: "Lancepoint", // Displayed in modal header
              mode: "auto", // 'light' | 'dark' | 'auto'
              theme: "default", // 'default' or custom theme
            },
            wallet: {
              display: "modal",
              termsUrl: "#",
              privacyUrl: "#",
            },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
