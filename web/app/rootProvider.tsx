"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ReactNode, useState } from "react";
import { FlashProvider } from "./FlashContext";

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({ target: "metaMask" }),
    injected(),
  ],
  transports: {
    // RPC eksplisit agar lebih stabil & tidak mudah rate limit
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});

export default function RootProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Hemat RPC quota
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia}>
          <FlashProvider>
            {children}
          </FlashProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
