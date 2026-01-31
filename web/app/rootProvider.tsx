"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({ target: "metaMask" }),
    injected(),
  ],
  transports: {
    // Gunakan RPC yang lebih reliabel jika http() default terkena limit
    // Kamu bisa ganti http() dengan URL dari Alchemy atau Infura di sini
    [baseSepolia.id]: http("https://sepolia.base.org"), 
  },
});

export default function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Matikan auto-refetch saat pindah jendela untuk menghemat RPC quota
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia}>{children}</OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}