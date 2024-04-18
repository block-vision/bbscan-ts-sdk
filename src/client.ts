import { ContractTransactionResponse, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'
import { MAINNET_RPC, TESTNET_RPC, getDistributionSignerContract, getStakingSignerContract } from './contact'
import axios from 'axios'
import { ethToEthermint } from '@evmos/address-converter'
import { DelegationsResponse, ValidatorsResponse } from './types'

export class BounceBitClient {
	private network: 'testnet' | 'mainnet'
	private provider: JsonRpcProvider

	constructor(network: 'mainnet' | 'testnet') {
		this.network = network

		if (this.network === 'testnet') {
			this.provider = new JsonRpcProvider(TESTNET_RPC, undefined, { pollingInterval: 2000, staticNetwork: true, batchMaxSize: 1 })
		} else if (this.network === 'mainnet') {
			this.provider = new JsonRpcProvider(MAINNET_RPC, undefined, { pollingInterval: 2000, staticNetwork: true, batchMaxSize: 1 })
		} else throw 'Unknown network'
	}

	getProvider() {
		return this.provider
	}

	async getValidators(): Promise<ValidatorsResponse> {
		if (this.network === 'testnet') {
			const { data } = await axios.get('https://restapi-testnet.bouncebitapi.com/validators')

			return data
		} else if (this.network === 'mainnet') {
			throw new Error('Mainnet not available now')
		}
	}

	async getDelegations(address: string): Promise<DelegationsResponse> {
		if (address.startsWith('0x')) address = ethToEthermint(address)

		if (this.network === 'testnet') {
			const { data } = await axios.get('https://restapi-testnet.bouncebitapi.com/delegations/' + address)

			return data
		} else if (this.network === 'mainnet') {
			throw new Error('Mainnet not available now')
		}
	}

	async stake(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const signerContract = getStakingSignerContract(signerOrWallet)

		return signerContract.delegate(signerOrWallet.address, operator_address, amount)
	}

	async unstake(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const signerContract = getStakingSignerContract(signerOrWallet)

		return signerContract.undelegate(signerOrWallet.address, operator_address, amount)
	}

	async claim(signerOrWallet: JsonRpcSigner | Wallet, operator_address: string) {
		const signerContract = getDistributionSignerContract(signerOrWallet)

		return signerContract.withdrawDelegatorRewards(signerOrWallet.address, operator_address)
	}
}
