## Hardhat Intro Project
This project demonstrates a basic Hardhat use case. It builds upon the sample project provided by hardhat. 

# Locks

### Description
The `Locks` contract has two external functions: `lock` and `withdraw`.
- `lock(uint)` takes in an `unlockTime` (Unix time) and locks the funds sent to it until that time
- `withdraw()` withdraws the locked funds (if any) if the current time is past the `unlockTime`

The contract can maintain any number of locks. A given address can only have one lock at a time.

### Prerequisites
create a `.env` file in the project root and define in it the following:
- `TESTNET_PRIVATE_KEY` - your testnet private key 
- `ALCHEMY_GOERLI_API_KEY` - your alchemy api key
- `ALCHEMY_GOERLI_RPC_URL` - your alchemy https url

#

### Interact with a deployed contract
The project is already set up with a deployed contract. Check it out on [Etherscan](https://goerli.etherscan.io/address/0x7cb5BFF77f8fdC14D7b8F515BF10f264F0FA334c)

- To lock some funds for a set number of minutes
	```
	node scripts/lock_funds.js <funds_in_ether> <number_of_minutes>
	```

- To withdraw your locked funds
	```
	node scripts/withdraw_funds.js
	```

#

### Deploy a new contract 
- Edit `contracts/Locks.sol` as desired
- Update `test/Locks.js` to handle any new cases
- Run the tests (and make sure they all pass!)
	```
	npx hardhat test
	```
- Deploy the contract on Goerli (and copy the contract address returned!)
	```
	npx hardhat run scripts/deploy.js --network goerli
	```
- Update the ABI and the contract address in `contract_info.json`
	- Paste the address returned in the previous step in the `address` field
	- Copy the `abi` in `artifacts/contracts/Lock.sol/Locks.json` into the `abi` field
- Interact with the contract as shown in the previous section
