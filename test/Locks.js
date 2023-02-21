const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Locks", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function createOneYearLockFixture() {
    const Locks = await ethers.getContractFactory("Locks");
    const locks = await Locks.deploy();

    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    await locks.lock(unlockTime, { value: lockedAmount });

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    return { locks, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Locking", function () {
    it("Should receive and store the funds to lock", async function () {
      const { locks, lockedAmount } = await loadFixture(createOneYearLockFixture);

      expect(await ethers.provider.getBalance(locks.address)).to.equal(
        lockedAmount
      );
    });

    it("Should handle mutliple locks", async function () {
      const { locks, lockedAmount, unlockTime, otherAccount } = await loadFixture(createOneYearLockFixture);
      await locks.connect(otherAccount).lock(unlockTime, { value: lockedAmount });

      expect(await ethers.provider.getBalance(locks.address)).to.equal(
        lockedAmount * 2
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const Locks = await ethers.getContractFactory("Locks");
      const locks = await Locks.deploy();
  
      const latestTime = await time.latest();
  
      await expect(locks.lock(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });

    it("Should fail if lock already exists", async function () {
      const { locks, unlockTime } = await loadFixture(createOneYearLockFixture);

      await expect(locks.lock(unlockTime, { value: 1 })).to.be.revertedWith(
        "Lock already exists - only one lock allowed per address"
      )
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { locks } = await loadFixture(createOneYearLockFixture);

        await expect(locks.withdraw()).to.be.revertedWithCustomError(
          locks,
          "earlyWithdrawal"
        );
      });

      it("Should revert with the right error if called from an account with no lock", async function () {
        const { locks, unlockTime, otherAccount } = await loadFixture(createOneYearLockFixture);

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(locks.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You have no locked funds"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { locks, unlockTime } = await loadFixture(createOneYearLockFixture);

        await time.increaseTo(unlockTime);

        await expect(locks.withdraw()).not.to.be.reverted;
      });

      it("Should handle multiple withdrawals", async function () {
        const { locks, lockedAmount, unlockTime, otherAccount } = await loadFixture(createOneYearLockFixture);
        await locks.connect(otherAccount).lock(unlockTime, { value: lockedAmount });

        await time.increaseTo(unlockTime);

        await expect(locks.withdraw()).not.to.be.reverted;
        await expect(locks.connect(otherAccount).withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { locks, unlockTime, lockedAmount, owner } = await loadFixture(createOneYearLockFixture);

        await time.increaseTo(unlockTime);

        await expect(locks.withdraw())
          .to.emit(locks, "Withdrawal")
          .withArgs(owner.address, lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { locks, unlockTime, lockedAmount, owner } = await loadFixture(createOneYearLockFixture);

        await time.increaseTo(unlockTime);

        await expect(locks.withdraw()).to.changeEtherBalances(
          [owner, locks],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
