import { Wallet, parseUnits } from 'ethers'
import { BounceBitClient } from '../src'

describe('BounceBitCilent', () => {
	const client = new BounceBitClient('testnet')

	it('client.getvalidators', async () => {
		const { pagination, validators } = await client.getValidators()

		expect(!!pagination).toBe(true)
		expect(Array.isArray(validators)).toBe(true)
		// console.log('validators.length', validators.length)
		expect(validators.every(item => typeof item.operator_address === 'string' && item.operator_address.length > 0)).toBe(true)
	})

	it('client.getDelegations', async () => {
		const address = '0x0dA17B38c9A5Ce0f6A69e392D2bC73D027D53797'

		const { pagination, delegation_responses } = await client.getDelegations(address)

		expect(!!pagination).toBe(true)
		expect(Array.isArray(delegation_responses) && delegation_responses.length > 0).toBe(true)
		// console.log('delegation_responses.length', delegation_responses.length)
		expect(delegation_responses.every(item => typeof item.delegation.validator_address === 'string')).toBe(true)
	})

	const testAction: string = 'unstake'
	const privateKey = process.env.PRIVATE_KEY
	const address = process.env.ADDRESS
	if (privateKey) {
		const wallet = new Wallet(privateKey, client.getProvider())
		expect(wallet.address.toLowerCase()).toBe(address.toLowerCase())
		const amount = parseUnits('0.1', 18)

		if (testAction === 'stake')
			it('client.stake', async () => {
				// Validator: BlockHunters
				const tx = await client.stake(wallet, amount, 'ethmvaloper1xyua8wcdw96f8z9x7g6vck3l0z2cysxwzrt39f')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('stake hash', tx.hash)
			})

		if (testAction === 'unstake')
			it('client.unstake', async () => {
				// Validator: BlockHunters
				const tx = await client.unstake(wallet, amount, 'ethmvaloper1xyua8wcdw96f8z9x7g6vck3l0z2cysxwzrt39f')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('unstake hash', tx.hash)
			})

		if (testAction === 'claim')
			it('client.claim', async () => {
				// Validator: BlockHunters
				const tx = await client.claim(wallet, 'ethmvaloper1xyua8wcdw96f8z9x7g6vck3l0z2cysxwzrt39f')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('claim hash', tx.hash)
			})
	}
})
