'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Hook navigasi Next.js
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Logika Redirect otomatis ke Dashboard setelah login sukses
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard'); 
    }
  }, [isConnected, router]);

  const truncatedAddress = address 
    ? `${address.slice(0, 5)}...${address.slice(-4)}` 
    : '';

  const handleConnect = () => {
    const extensionConnector = connectors.find((c) => c.id === 'injected') || connectors[0];
    if (extensionConnector) {
      connect({ connector: extensionConnector });
    }
  };

  if (isConnected) {
    return (
      <button 
        onClick={() => disconnect()}
        className="flex items-center gap-2 bg-[#0a261c] text-[#a7f3d0] px-6 py-2 rounded-full font-bold text-sm border border-[#a7f3d0]/20 hover:bg-[#114030] transition-all"
      >
        <i className="fa-solid fa-wallet"></i>
        {truncatedAddress}
      </button>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="flex items-center gap-2 bg-[#0a261c] text-[#a7f3d0] px-6 py-2 rounded-full font-bold text-sm border border-[#a7f3d0]/20 hover:bg-[#114030] transition-all"
    >
      <i className="fa-solid fa-wallet"></i>
      CONNECT WALLET
    </button>
  );
}