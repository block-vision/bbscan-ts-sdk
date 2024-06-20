# BBScan Typescript SDK for BounceBit

## Usage

Install 
   
```bash
npm install bbscan-ts-sdk ethers
npm install bignumber.js # (optional)
```

Import

```ts
import { BounceBitClient } from "bbscan-ts-sdk";

const bbClient = new BounceBitClient("mainnet");

const provider = bbClient.getProvider()
```

Get validators, APY, and delegations
```ts
const { avgAPY, totalValidators, validators } = await bbClient.getValidators()
const { totalReward, totalStaked, delegations } = await bbClient.getDelegations("<address>")
```

Stake, unstake, claim (with approve)
```ts
// Sign directly
import { Wallet, parseUnits, BrowserProvider} from 'ethers'

const signer = new Wallet("<wallet>", bbClient.getProvider());
// const signer = new BrowserProvider(window.ethereum)

const amount = parseUnits('0.1', 18)
const validator_address = "ethmvaloper1afcsg0x33ssade0mgq4l9cg8e8t4f2p44y0ns8" // bouncebit-1

client.stakeWithApprove(signer, amount, validator_address)
client.unstakeWithApprove(signer, amount, validator_address)

client.claim(signer, validator_address)
```

Stake, unstake (manually check allowance)
```ts
import BigNumber from 'bignumber.js'

// stake
const stakeAllowance = await this.stakeAllowance(signerOrWallet.address)
if (BigNumber(String(stakeAllowance)).isLessThan(String(amount))) {
  const appoveTx = await client.approveAll(signerOrWallet)

  await provider.waitForTransaction(appoveTx.hash)
}

client.stake(signer, amount, validator_address)

// unstake
const unstakeAllowance = await this.unstakeAllowance(signerOrWallet.address)
if (BigNumber(String(unstakeAllowance)).isLessThan(String(amount))) {
  const appoveTx = await client.approveAll(signerOrWallet)

  await provider.waitForTransaction(appoveTx.hash)
}

client.unstake(signer, amount, validator_address)
```

Use tx params and sendTransaction

```ts
const txParams = client.getApproveAllTransaction("<address>")
const txParams = client.getStakeTransaction("<address>", amount, validator_address)
const txParams = client.getUnstakeTransaction("<address>", amount, validator_address)
const txParams = client.getClaimTransaction("<address>", validator_address)

const tx = await wallet.sendTransaction(txParams)
``` 