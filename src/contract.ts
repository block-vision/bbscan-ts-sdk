import { Contract, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'
import stakingAbi from './abi/staking.json'
import distributionAbi from './abi/distribution.json'

export { stakingAbi, distributionAbi }

export const TESTNET_RPC = 'https://fullnode-testnet.bouncebitapi.com/'

export const MAINNET_RPC = 'https://fullnode-mainnet.bouncebitapi.com/'

export const DEVNET_RPC = 'https://fullnode-devnet.bouncebitapi.com/'

export function getStakingSignerContract(signer: JsonRpcSigner | Wallet | JsonRpcProvider) {
	return new Contract('0x0000000000000000000000000000000000000800', stakingAbi, signer)
}

export function getDistributionSignerContract(signer: JsonRpcSigner | Wallet | JsonRpcProvider) {
	return new Contract('0x0000000000000000000000000000000000000801', distributionAbi, signer)
}

export function getStakingContract(provider: JsonRpcProvider): Contract {
	return new Contract('0x0000000000000000000000000000000000000800', stakingAbi, provider)
}

export function getDistributionContract(provider: JsonRpcProvider): Contract {
	return new Contract('0x0000000000000000000000000000000000000801', distributionAbi, provider)
}
