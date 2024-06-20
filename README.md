# BBScan Typescript SDK for BounceBit

## Usage

Install 
   
```bash
npm install bbscan-ts-sdk
```

Import

```ts
import { BounceBitClient } from "bbscan-ts-sdk";

const bbClient = new BounceBitClient("mainnet");

```

Get validators, APY, and delegations
```ts
const { avgAPY, totalValidators, validators } = await bbClient.getValidators()
const { totalReward, totalStaked, delegations } = await bbClient.getDelegations("<address>")
```

Stake, unstake, claim
```ts
// Sign directly
import { Wallet, parseUnits, BrowserProvider} from 'ethers'

const signer = new Wallet("<wallet>", bbClient.getProvider());
// const signer = new BrowserProvider(window.ethereum)

const amount = parseUnits('0.1', 18)
const validator_address = "ethmvaloper1afcsg0x33ssade0mgq4l9cg8e8t4f2p44y0ns8" // bouncebit-1

client.stake(signer, amount, validator_address)
client.unstake(signer, amount, validator_address)
client.claim(signer, validator_address)

// Or

// Get tx params and sendTransaction
const txParams = client.getStakeTransaction("<address>", amount, validator_address)
// const txParams = client.getUnstakeTransaction("<address>", amount, validator_address)
// const txParams = client.getClaimTransaction("<address>", validator_address)

const tx = await wallet.sendTransaction(txParams)

``` 