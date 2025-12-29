import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PatunganYuk: Unit Testing", function () {
  async function deployFixture() {
    const [admin, organizer, user1, user2, user3] = await ethers.getSigners();

    // 1. Deploy Mock IDRX
    const MockIDRX = await ethers.getContractFactory("MockIDRX");
    const idrx = await MockIDRX.deploy();

    // 2. Deploy Factory
    const Factory = await ethers.getContractFactory("PatunganFactory");
    const factory = await Factory.deploy();

    // 3. Create Room (Target 1.000.000 IDRX, 6 Decimals)
    const target = ethers.parseUnits("1000000", 6);
    const duration = 3600; // 1 jam
    await factory.connect(organizer).createRoom("Project Web3", await idrx.getAddress(), target, duration);
    
    const rooms = await factory.getAllRooms();
    const escrow = await ethers.getContractAt("PatunganEscrow", rooms[0]);

    return { idrx, factory, escrow, admin, organizer, user1, user2, user3, target };
  }

  describe("Logika Deposit & Validator", function () {
    it("Harus mengunci dana dan memilih validator saat target tercapai", async function () {
      const { idrx, escrow, user1, user2, target } = await loadFixture(deployFixture);

      const amount = target / 2n;
      await idrx.mint(user1.address, amount);
      await idrx.mint(user2.address, amount);

      await idrx.connect(user1).approve(await escrow.getAddress(), amount);
      await idrx.connect(user2).approve(await escrow.getAddress(), amount);

      await escrow.connect(user1).deposit(amount);
      await expect(escrow.connect(user2).deposit(amount))
        .to.emit(escrow, "ValidatorsSelected");

      const validators = await escrow.getValidators();
      // Karena < 10 peserta, Micro Tier: 50% dari 2 peserta = 1 validator, tapi min kita 2.
      expect(validators.length).to.be.at.least(2);
    });
  });

  describe("Logika 100% Unanimous Voting", function () {
    it("Tidak boleh cair jika hanya sebagian validator yang setuju", async function () {
      const { idrx, escrow, user1, user2, target } = await loadFixture(deployFixture);

      // Pakai 2 user supaya ada 2 peserta
      const half = target / 2n;
      await idrx.mint(user1.address, half);
      await idrx.mint(user2.address, half);

      await idrx.connect(user1).approve(await escrow.getAddress(), half);
      await idrx.connect(user2).approve(await escrow.getAddress(), half);

      await escrow.connect(user1).deposit(half);
      await escrow.connect(user2).deposit(half); // Di sini 2 validator terpilih

      const validators = await escrow.getValidators();
      expect(validators.length).to.equal(2); // Pastikan ada 2 validator

      // HANYA 1 validator yang vote (50%)
      const v1 = await ethers.getSigner(validators[0]);
      await escrow.connect(v1).voteApproval();

      // Status HARUS tetap 1 (Funded), tidak boleh jadi 2 (Disbursed)
      const info = await escrow.info();
      expect(info.status).to.equal(1); 
      console.log("Berhasil: Dana tetap tertahan karena baru 50% suara.");
    });

    it("Harus cair ke penyelenggara jika 100% validator setuju", async function () {
      const { idrx, escrow, user1, target, organizer, admin } = await loadFixture(deployFixture);

      await idrx.mint(user1.address, target);
      await idrx.connect(user1).approve(await escrow.getAddress(), target);
      await escrow.connect(user1).deposit(target);

      const validators = await escrow.getValidators();
      
      // Semua validator memberikan suara
      for (const vAddress of validators) {
        const signer = await ethers.getSigner(vAddress);
        await escrow.connect(signer).voteApproval();
      }

      // Cek apakah status berubah jadi Disbursed (2)
      const info = await escrow.info();
      expect(info.status).to.equal(2); // 2 = Disbursed

      // Cek saldo penyelenggara (setelah potong fee 1%)
      const organizerBalance = await idrx.balanceOf(organizer.address);
      expect(organizerBalance).to.be.greaterThan(0);
      console.log("Dana diterima penyelenggara:", ethers.formatUnits(organizerBalance, 6));
    });
  });
});