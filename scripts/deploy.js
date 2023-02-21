const fs = require('fs');

async function main() {
	const Locks = await ethers.getContractFactory("Locks");
	const locks = await Locks.deploy();

	await locks.deployed();
	console.log(`contract deployed to ${locks.address}`);

	fs.writeFile("contract_deployment.json", JSON.stringify({ address: locks.address }), (err) => {
		if (err) throw err;
		console.log(`contract address written to contract_deployment.json`);
	});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
