# BBScan Typescript SDK for BounceBit

## Usage

Install :
   
```bash
npm install bbscan-ts-sdk
```

Import:

```ts
import { BounceBitClient } from "bbscan-ts-sdk";

const bbClient = new BounceBitClient("testnet");

bbClient.getValidators()
bbClient.getDelegations("<your-address>")

// Sign
import { Wallet, parseUnits} from 'ethers'

const signer = new Wallet("<your-wallet>", bbClient.getProvider());

const amount = parseUnits('0.1', 18)
const validator_address = "ethmvaloper1xyua8wcdw96f8z9x7g6vck3l0z2cysxwzrt39f"

client.stake(signer, amount, validator_address)
client.unstake(signer, amount, validator_address)
client.claim(signer, validator_address)

``` 