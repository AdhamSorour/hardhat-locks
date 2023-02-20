const LOCK_MINS = 10;

async function main() {
	const currentTimestampInSeconds = Math.round(Date.now() / 1000);
	const ONE_MIN_IN_SECS = 60;
	const unlockTime = currentTimestampInSeconds + LOCK_MINS*ONE_MIN_IN_SECS;

	const lockedAmount = ethers.utils.parseEther("0.1");

	const Lock = await ethers.getContractFactory("Lock");
	const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

	await lock.deployed();

	console.log(
		`Lock with 0.1 ETH deployed to ${lock.address}\n`,
		`Lock timestamp:   ${currentTimestampInSeconds}\n`,
		`Unlock timestamp: ${unlockTime}`
	);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
