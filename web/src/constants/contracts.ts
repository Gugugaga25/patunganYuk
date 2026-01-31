import factoryAbi from './abis/FactoryABI.json';
import escrowAbi from './abis/EscrowABI.json';
import idrxAbi from './abis/MockIDRXABI.json';

// Pastikan alamat di .env.local diawali dengan 0x...
export const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x0') as `0x${string}`;
export const IDRX_ADDRESS = (process.env.NEXT_PUBLIC_IDRX_ADDRESS || '0x0') as `0x${string}`;

export const CONTRACTS = {
  factory: {
    address: FACTORY_ADDRESS,
    abi: factoryAbi, // casting as const untuk type-safety
  },
  idrx: {
    address: IDRX_ADDRESS,
    abi: idrxAbi,
  },
  escrow: {
    // Alamat escrow akan didapat secara dinamis dari blockchain
    abi: escrowAbi,
  }
};