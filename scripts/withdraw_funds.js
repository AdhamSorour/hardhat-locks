require("dotenv").config();
const ethers = require('ethers');
const { abi, address } = require('./contract_info.json');

const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_GOERLI_API_KEY);
const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, provider);

async function main() {
	const locks_contract = new ethers.Contract(address, abi, wallet);
	const result = await locks_contract.withdraw();

	console.log(`Successfully withdrew funds!`);
	console.log(`Tx hash: ${result.hash}`);
}

main().catch((e) => {
	if (e.code === "UNPREDICTABLE_GAS_LIMIT") {
		if (e.error.reason === "execution reverted") {
			const secondsRemaining = parseInt('0x' + e.error.error.error.data.slice(66));
			console.error(`execution reverted: You can't withdraw yet`);
			console.error(`funds will unlock in ${secondsRemaining} seconds (${secondsRemaining/60} minutes)`);
		} else {
			console.error(e.error.reason);
		}
	} else { 
		console.error(`Error: ${e.reason}`);
	}
	process.exitCode = 1;
});