# AgriChain Blockchain

Hardhat project for the AgriChain smart contract.

## Network

The remote testnet is Ethereum Sepolia.

Required environment variables in `blockchain/.env`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=deployed_contract_address
ETHERSCAN_API_KEY=optional_for_verification
```

`RPC_URL` is still supported as a fallback, but `SEPOLIA_RPC_URL` is preferred.

## Commands

Compile:

```powershell
npm run compile
```

Deploy to Sepolia:

```powershell
npm run deploy
```

Interact with the deployed Sepolia contract:

```powershell
npm run interact
```

After deployment, copy the printed `CONTRACT_ADDRESS` into both `blockchain/.env`
and `backend/.env`.
