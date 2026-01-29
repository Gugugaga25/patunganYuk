"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains"; // GANTI: Pakai baseSepolia
import { coinbaseWallet, injected } from "wagmi/connectors"; // TAMBAH: injected untuk MetaMask
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [baseSepolia], // GANTI: base -> baseSepolia
  connectors: [
    coinbaseWallet({ appName: "PatunganWeb3" }),
    injected(), // TAMBAH: Agar bisa pakai MetaMask/Browser Wallet lain
  ],
  transports: { 
    [baseSepolia.id]: http() // GANTI: base -> baseSepolia
  },
});

export default function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* GANTI: chain di OnchainKitProvider juga harus baseSepolia */}
        <OnchainKitProvider chain={baseSepolia}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}