import { ethers } from "hardhat";

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

  console.log("Menjalankan deployment dengan akun:", deployer.address);

  // 1. Deploy Mock IDRX
  const MockIDRX = await ethers.getContractFactory("MockIDRX");
  const idrx = await MockIDRX.deploy();
  await idrx.waitForDeployment();
  const idrxAddress = await idrx.getAddress();
  console.log("Mock IDRX deployed ke:", idrxAddress);

  // 2. Deploy PatunganFactory
  const PatunganFactory = await ethers.getContractFactory("PatunganFactory");
  const factory = await PatunganFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("PatunganFactory deployed ke:", factoryAddress);

  // --- SIMULASI ALUR KERJA ---
  console.log("\n--- Menjalankan Simulasi ---");

  // User1 ingin membuat patungan "Liburan Bali"
  // Target: 1.000.000 IDRX (dengan 6 desimal)
  const targetAmount = ethers.parseUnits("1000000", 6);
  const duration = 7 * 24 * 60 * 60; // 7 hari dalam detik

  const tx = await factory.connect(user1).createRoom(
    "Liburan Bali",
    idrxAddress,
    targetAmount,
    duration
  );
  const receipt = await tx.wait();

  // Ambil alamat room yang baru dibuat dari event
  const allRooms = await factory.getAllRooms();
  const roomAddress = allRooms[0];
  console.log("Kamar Patungan Baru (Liburan Bali) dibuat di:", roomAddress);

  // 3. User2 ikut patungan
  const patunganRoom = await ethers.getContractAt("PatunganEscrow", roomAddress);
  
  // Kirim token ke User2 dulu agar bisa bayar
  await idrx.mint(user2.address, ethers.parseUnits("500000", 6));
  
  // User2 harus 'Approve' token agar kontrak bisa ambil
  await idrx.connect(user2).approve(roomAddress, ethers.parseUnits("500000", 6));
  
  // User2 Deposit
  await patunganRoom.connect(user2).deposit(ethers.parseUnits("500000", 6));
  console.log("User2 berhasil deposit 500.000 IDRX");

  // Cek Status
  const info = await patunganRoom.info();
  console.log("Saldo saat ini di kamar patungan:", ethers.formatUnits(info.currentBalance, 6), "IDRX");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});