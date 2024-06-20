import { Contract, ContractTransaction, ContractTransactionResponse, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'
import { MAINNET_RPC, TESTNET_RPC, getDistributionSignerContract, getStakingContract, getStakingSignerContract } from './contract'
import axios from 'axios'
import { ethToEthermint } from '@evmos/address-converter'
import { DelegationsResponse, ValidatorsResponse } from './types'
import BigNumber from 'bignumber.js'

const MAX_APPROVAL_HEX = '0xfffffffffffffffffffffffa0e34bcf70a96e176cbaf886d6228000000000000'

export class BounceBitClient {
	private network: 'testnet' | 'mainnet'
	private provider: JsonRpcProvider
	private stakingContract: Contract

	constructor(network: 'mainnet' | 'testnet') {
		this.network = network

		if (this.network === 'testnet') {
			this.provider = new JsonRpcProvider(TESTNET_RPC, undefined, { pollingInterval: 2000, staticNetwork: true, batchMaxSize: 1 })
		} else if (this.network === 'mainnet') {
			this.provider = new JsonRpcProvider(MAINNET_RPC, undefined, { pollingInterval: 2000, staticNetwork: true, batchMaxSize: 1 })
		} else throw 'Unknown network'

		this.stakingContract = getStakingContract(this.provider)
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

	async approveAll(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint = MAX_APPROVAL_HEX) {
		const signerContract = getStakingSignerContract(signerOrWallet)

		const appoveTx = await signerContract.approve(signerOrWallet.address, amount, [
			'/cosmos.staking.v1beta1.MsgDelegate',
			'/cosmos.staking.v1beta1.MsgUndelegate',
			'/cosmos.staking.v1beta1.MsgBeginRedelegate',
			'/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation'
		])

		return appoveTx as ContractTransactionResponse
	}
	async getApproveAllTransaction(from: string, amount: string | bigint = MAX_APPROVAL_HEX): Promise<ContractTransaction> {
		const callData = await this.stakingContract.approve.populateTransaction(
			from,
			amount,
			[
				'/cosmos.staking.v1beta1.MsgDelegate',
				'/cosmos.staking.v1beta1.MsgUndelegate',
				'/cosmos.staking.v1beta1.MsgBeginRedelegate',
				'/cosmos.staking.v1beta1.MsgCancelUnbondingDelegation'
			],
			{ from }
		)

		return callData
	}

	async stake(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const signerContract = getStakingSignerContract(signerOrWallet)

		return signerContract.delegate(signerOrWallet.address, operator_address, amount)
	}
	async stakeAllowance(address: string) {
		return await this.stakingContract.allowance(address, address, '/cosmos.staking.v1beta1.MsgDelegate')
	}
	async stakeWithApprove(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const allowance = await this.stakeAllowance(signerOrWallet.address)
		const signerContract = getStakingSignerContract(signerOrWallet)

		if (BigNumber(String(allowance)).isLessThan(String(amount))) {
			const appoveTx = await this.approveAll(signerOrWallet)

			await this.provider.waitForTransaction(appoveTx.hash)
		}

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
	async unstakeAllowance(address: string) {
		return await this.stakingContract.allowance(address, address, '/cosmos.staking.v1beta1.MsgUndelegate')
	}
	async unstakeWithApprove(signerOrWallet: JsonRpcSigner | Wallet, amount: string | bigint, operator_address: string): Promise<ContractTransactionResponse> {
		const allowance = await this.unstakeAllowance(signerOrWallet.address)
		const signerContract = getStakingSignerContract(signerOrWallet)

		if (BigNumber(String(allowance)).isLessThan(String(amount))) {
			const appoveTx = await this.approveAll(signerOrWallet)

			await this.provider.waitForTransaction(appoveTx.hash)
		}

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
