import { ContractTransaction, ContractTransactionResponse, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'
import { MAINNET_RPC, TESTNET_RPC, getDistributionSignerContract, getStakingSignerContract } from './contract'
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
		let url = 'https://api.bbscan.io/mainnet/api/validators'

		if (this.network === 'testnet') {
			url = 'https://testnet-api.bbscan.io/testnet/api/validators'
		}
		const { data } = await axios.get(url)

		if (Array.isArray(data.result?.validators)) return data.result
		else throw '[Result Error] getValidators'
	}

	async getDelegations(address: string): Promise<DelegationsResponse> {
		if (address.startsWith('0x')) address = ethToEthermint(address)

		let url = 'https://api.bbscan.io/mainnet/api/account/delegations'

		if (this.network === 'testnet') {
			url = 'https://testnet-api.bbscan.io/testnet/api/account/delegations'
		}

		const { data } = await axios.get(url, {
			params: {
				delegator: address
			}
		})

		if (Array.isArray(data.result?.delegations)) return data.result
		else throw '[Result Error] getDelegations'
	}

	async stake(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const signerContract = getStakingSignerContract(signerOrWallet)

		return signerContract.delegate(signerOrWallet.address, operator_address, amount)
	}

	async getStakeTransaction(from: string, amount: string | bigint, operator_address: string): Promise<ContractTransaction> {
		const signerContract = getStakingSignerContract(this.provider)
		const callData = await signerContract.delegate.populateTransaction(from, operator_address, amount, { from })

		return callData
	}

	async unstake(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const signerContract = getStakingSignerContract(signerOrWallet)

		return signerContract.undelegate(signerOrWallet.address, operator_address, amount)
	}
	async getUnstakeTransaction(from: string, amount: string | bigint, operator_address: string): Promise<ContractTransaction> {
		const signerContract = getStakingSignerContract(this.provider)
		const callData = await signerContract.undelegate.populateTransaction(from, operator_address, amount, { from })

		return callData
	}

	async claim(signerOrWallet: JsonRpcSigner | Wallet, operator_address: string) {
		const signerContract = getDistributionSignerContract(signerOrWallet)

		return signerContract.withdrawDelegatorRewards(signerOrWallet.address, operator_address)
	}
	async getClaimTransaction(from: string, operator_address: string): Promise<ContractTransaction> {
		const signerContract = getDistributionSignerContract(this.provider)
		const callData = await signerContract.withdrawDelegatorRewards.populateTransaction(from, operator_address, { from })

		return callData
	}
}
