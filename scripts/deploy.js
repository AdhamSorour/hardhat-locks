async function main() {
	const Locks = await ethers.getContractFactory("Locks");
	const locks = await Locks.deploy();
	await locks.deployed();
	console.log(`contract deployed to ${locks.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
