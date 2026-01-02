"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains"; 
import { coinbaseWallet, injected } from "wagmi/connectors"; // Tambahkan injected
import { ReactNode, useState } from "react";

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    // 1. injected() mendeteksi wallet extension secara umum (MetaMask, Rabby, dll)
    injected(), 
    // 2. coinbaseWallet dengan preference 'all' akan mendeteksi extension 
    // sekaligus mendukung Smart Wallet (Gasless) jika extension tidak ada.
    coinbaseWallet({ 
      appName: "PatunganYuk",
      preference: 'all', 
    })
  ],
  transports: { [baseSepolia.id]: http() },
});

export default function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          chain={baseSepolia}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          config={{
            paymaster: process.env.NEXT_PUBLIC_PAYMASTER_URL,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}