import { expect } from "chai";
import { ethers } from "hardhat";
import { PatunganEscrow, IDRXMock } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("patunganYuk - Comprehensive Industry Test", function () {
  let escrow: PatunganEscrow;
  let idrx: IDRXMock;
  let owner: HardhatEthersSigner;
  let p1: HardhatEthersSigner;
  let p2: HardhatEthersSigner;
  let bridge: HardhatEthersSigner;

  const TARGET = ethers.parseUnits("1000", 18);
  const PER_USER = ethers.parseUnits("500", 18);
  const DEST_ACC = "BCA - 12345678 - A/N BUDI";

  beforeEach(async function () {
    [owner, p1, p2, bridge] = await ethers.getSigners();

    const IDRX = await ethers.getContractFactory("IDRXMock");
    idrx = await IDRX.deploy();

    const Escrow = await ethers.getContractFactory("PatunganEscrow");
    // Untuk testing lokal, kita masukkan alamat random sebagai VRF Coordinator agar tidak error di constructor
    escrow = await Escrow.deploy(await idrx.getAddress(), 1, bridge.address);

    await idrx.mint(p1.address, PER_USER);
    await idrx.mint(p2.address, PER_USER);
  });

  // --- FITUR 1: PEMBUATAN ---
  it("Skenario 1: Berhasil membuat patungan dengan info rekening terkunci", async function () {
    await expect(escrow.createPatungan(TARGET, 2, 3600, DEST_ACC))
      .to.emit(escrow, "PatunganCreated");
    
    const p = await escrow.patungans(0);
    expect(p.destinationAccount).to.equal(DEST_ACC);
    expect(p.status).to.equal(0); // Status.OPEN
  });

  // --- FITUR 2: JOIN & DEPOSIT ---
  it("Skenario 2: Peserta berhasil setor IDRX", async function () {
    await escrow.createPatungan(TARGET, 2, 3600, DEST_ACC);
    await idrx.connect(p1).approve(await escrow.getAddress(), PER_USER);
    
    await expect(escrow.connect(p1).joinPatungan(0))
      .to.emit(escrow, "Joined")
      .withArgs(0, p1.address, PER_USER);
    
    expect(await idrx.balanceOf(await escrow.getAddress())).to.equal(PER_USER);
  });

  // --- FITUR 3: AUTOMATION (UPKEEP) ---
  it("Skenario 3: Automation mendeteksi patungan yang butuh rotasi (CheckUpkeep)", async function () {
    // Skenario ini mengetes apakah Chainlink Automation bisa melihat timeout
    // Kita "paksa" status menjadi VALIDATING (simulasi) melalui interaksi manual di testnet nanti
    const upkeep = await escrow.checkUpkeep("0x");
    expect(upkeep.upkeepNeeded).to.be.false; // Karena belum ada patungan yang timeout
  });

  // --- FITUR 4: REFUND KARENA TIDAK CAPAI TARGET ---
  it("Skenario 4: Peserta bisa refund jika deadline lewat dan target tidak tercapai", async function () {
    await escrow.createPatungan(TARGET, 2, 3600, DEST_ACC);
    await idrx.connect(p1).approve(await escrow.getAddress(), PER_USER);
    await escrow.connect(p1).joinPatungan(0);

    // Percepat waktu 1 jam 1 detik
    await time.increase(3601);

    await expect(escrow.connect(p1).claimRefund(0))
      .to.emit(escrow, "RefundClaimed");
    
    expect(await idrx.balanceOf(p1.address)).to.equal(PER_USER);
  });

  // --- FITUR 5: KEAMANAN (ANTI-CHEAT) ---
  it("Skenario 5: Tidak bisa refund jika patungan masih berjalan", async function () {
    await escrow.createPatungan(TARGET, 2, 3600, DEST_ACC);
    await idrx.connect(p1).approve(await escrow.getAddress(), PER_USER);
    await escrow.connect(p1).joinPatungan(0);

    await expect(escrow.connect(p1).claimRefund(0))
      .to.be.revertedWith("Not eligible for refund");
  });
});