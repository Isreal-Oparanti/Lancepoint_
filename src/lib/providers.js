"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { getConfig } from "./wagmi";
import { base } from "wagmi/chains";

export function Providers({ children }) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          config={{
            appearance: {
              name: "Lancepoint",
              mode: "auto",
              theme: "default",
            },
            wallet: {
              display: "modal",
              termsUrl: "https://lancepoint-v2.vercel.app/",
              privacyUrl: "https://lancepoint-v2.vercel.app/",
            },
          }}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
