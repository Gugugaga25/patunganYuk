// Alamat Factory yang kamu dapat dari npx hardhat run scripts/deploy.ts
export const FACTORY_ADDRESS = "0x...isi_alamat_factory_kamu...";

export const FACTORY_ABI = [
  "function createRoom(string _title, address _tokenAddress, uint256 _targetAmount, uint256 _duration) external returns (address)",
  "function getAllRooms() external view returns (address[])",
  "event RoomCreated(address indexed roomAddress, address indexed organizer, string title)"
] as const;

export const ESCROW_ABI = [
  "function deposit(uint256 _amount) external",
  "function voteApproval() external",
  "function info() external view returns (string title, address organizer, address tokenAddress, uint256 targetAmount, uint256 currentBalance, uint256 deadline, uint8 status)",
  "function getValidators() external view returns (address[])",
  "event Deposited(address indexed user, uint256 amount)",
  "event ValidatorsSelected(address[] selectedValidators)",
  "event Disbursed(address indexed organizer, uint256 amount)"
] as const;