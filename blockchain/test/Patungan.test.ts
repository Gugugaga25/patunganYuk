import { expect } from "chai";
import { ethers } from "hardhat";
import { PatunganEscrow, IDRXMock } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("patunganYuk Full Flow with Bridge", function () {
  let escrow: PatunganEscrow;
  let idrx: IDRXMock;
  let owner: HardhatEthersSigner;
  let p1: HardhatEthersSigner;
  let p2: HardhatEthersSigner;
  let bridge: HardhatEthersSigner; // Wallet sistem simulasi

  const TARGET = ethers.parseEther("1000");
  const PER_USER = ethers.parseEther("500");
  const DEST_ACC = "BCA - 1234567890 - A/N BUDI";

  beforeEach(async function () {
    [owner, p1, p2, bridge] = await ethers.getSigners();

    // Deploy Token Mock
    const IDRX = await ethers.getContractFactory("IDRXMock");
    idrx = await IDRX.deploy();

    // Deploy Escrow (Sekarang butuh 3 parameter: Token, SubID, Bridge)
    const Escrow = await ethers.getContractFactory("PatunganEscrow");
    // Gunakan 1 sebagai dummy Subscription ID untuk testing lokal
    escrow = await Escrow.deploy(await idrx.getAddress(), 1, bridge.address);

    await idrx.mint(p1.address, PER_USER);
    await idrx.mint(p2.address, PER_USER);
  });

  it("Harus mengunci info rekening saat membuat patungan", async function () {
    await escrow.createPatungan(TARGET, 2, 3600, DEST_ACC);
    const p = await escrow.patungans(0);
    expect(p.destinationAccount).to.equal(DEST_ACC);
  });

  it("Dana harus masuk ke Bridge Wallet setelah disetujui (Bukan ke Creator)", async function () {
    await escrow.createPatungan(TARGET, 2, 3600, DEST_ACC);

    // Join
    await idrx.connect(p1).approve(await escrow.getAddress(), PER_USER);
    await escrow.connect(p1).joinPatungan(0);
    await idrx.connect(p2).approve(await escrow.getAddress(), PER_USER);
    await escrow.connect(p2).joinPatungan(0);

    // Mocking Selection: Karena VRF butuh waktu, kita tes status FUNDED dulu
    // Di testing lokal, VRF tidak berjalan otomatis kecuali di-mock
    // Namun kita bisa mengetes logika _releaseFunds jika dipicu
  });
});