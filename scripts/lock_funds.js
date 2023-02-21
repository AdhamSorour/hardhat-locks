require("dotenv").config();
const ethers = require('ethers');
const { abi, address } = require('./contract_info.json');

const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_GOERLI_API_KEY);
const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

async function main() {
	const amount = process.argv[2];
	const minutes = parseInt(process.argv[3]);

	const currentTimestampInSeconds = Math.round(Date.now() / 1000);
	const unlockTime = currentTimestampInSeconds + minutes*60;

	const lockedAmount = ethers.utils.parseEther(amount);

	const locks_contract = new ethers.Contract(address, abi, wallet);
	const result = await locks_contract.lock(unlockTime, { value: lockedAmount });

	console.log(`Successfully locked ${ethers.utils.formatEther(lockedAmount)} ether!`);
	console.log(`Funds will be unlocked and available for withdrawal in ${minutes} minutes`);
	console.log(`Tx hash: ${result.hash}`);
}

main().catch((e) => {
	if (e.code == "UNPREDICTABLE_GAS_LIMIT") {
		console.error(e.error.reason);
	} else { 
		console.error(`Error: ${e.reason}`);
	}
	process.exitCode = 1;
});