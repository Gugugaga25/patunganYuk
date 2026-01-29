"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains"; 
import { injected } from "wagmi/connectors"; // Cukup pakai injected
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [baseSepolia], 
  // Pakai injected agar otomatis mendeteksi MetaMask/Browser Wallet
  connectors: [
    injected({ target: 'metaMask' }), // Memaksa fokus ke MetaMask jika ada
    injected(), 
  ],
  transports: { 
    [baseSepolia.id]: http() 
  },
});

export default function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={baseSepolia}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}