## Hardhat Intro Project:
# Lock

This project demonstrates a basic Hardhat use case. It builds upon the sample contract provided by hardhat. 

### The project contains
- a solidity contract `contracts/Lock.sol`
- a test for that contract `test/Lock.js`
- a script that deploys that contract `scripts/deploy.js`

### Prerequisites
- create a .env in the project root and define the following:
	- `TESTNET_PRIVATE_KEY` - your testnet private key 
	- `ALCHEMY_GOERLI_API_KEY` - your alchemy api key
	- `ALCHEMY_GOERLI_RPC_URL` - your alchemy https url

### Configuration
This contract locks the funds sent to it until a given `unlockTime` that is passed to the constructor. By default the locking interval is 10 minutes from contract deployment. To change the locking interval edit the `LOCK_MINS` variable at the top of the `deploy.js` script.

#

To run the tests
```
npx hardhat test
```

To deploy to the local hardhat network (this deployment is gone as soon as the program returns)
```
npx hardhat run scripts/deploy.js
```

To deploy to Goerli
```
npx hardhat run scripts/deploy.js --network goerli
```
