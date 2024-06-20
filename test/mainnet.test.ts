import { Wallet, parseUnits } from 'ethers'
import { BounceBitClient } from '../src'

describe('BounceBitCilent', () => {
	const test_network = process.env.TEST_NETWORK
	if (test_network !== 'mainnet') return it('none', () => {})

	const client = new BounceBitClient('mainnet')

	it('client.getvalidators', async () => {
		const { avgAPY, totalValidators, validators } = await client.getValidators()

		expect(typeof avgAPY).toBe('number')
		expect(typeof totalValidators).toBe('number')
		expect(Array.isArray(validators)).toBe(true)

		expect(validators.every(item => typeof item.operator_address === 'string' && item.operator_address.length > 0)).toBe(true)
	})

	const address = process.env.ADDRESS

	it('client.getDelegations', async () => {
		const { totalReward, totalStaked, delegations } = await client.getDelegations(address)

		expect(typeof totalReward).toBe('string')
		expect(typeof totalStaked).toBe('string')
		expect(Array.isArray(delegations)).toBe(true)
	})

	const testAction: string = 'stakeWithApprove'
	const privateKey = process.env.PRIVATE_KEY

	if (privateKey) {
		const wallet = new Wallet(privateKey, client.getProvider())
		expect(wallet.address.toLowerCase()).toBe(address.toLowerCase())
		const amount = parseUnits('0.1', 18)

		// Validator: MetaOp (ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg)

		if (testAction === 'stake')
			it('client.stake', async () => {
				const tx = await client.stake(wallet, amount, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[stake hash]', tx.hash)
			})

		if (testAction === 'stakeWithApprove')
			it('client.stakeWithApprove', async () => {
				const tx = await client.stakeWithApprove(wallet, amount, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[stake hash]', tx.hash)
			})

		if (testAction === 'getStakeTransaction')
			it('client.getStakeTransaction', async () => {
				const txParams = await client.getStakeTransaction(address, amount, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')
				const tx = await wallet.sendTransaction(txParams)

				console.log('tx', tx.hash)

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[stake hash]', tx.hash)
			})

		if (testAction === 'unstake')
			it('client.unstake', async () => {
				const tx = await client.unstake(wallet, amount, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[unstake hash]', tx.hash)
			})
		if (testAction === 'getUnstakeTransaction')
			it('client.getUnstakeTransaction', async () => {
				const txParams = await client.getUnstakeTransaction(address, amount, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')
				const tx = await wallet.sendTransaction(txParams)

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[unstake hash]', tx.hash)
			})

		if (testAction === 'claim')
			it('client.claim', async () => {
				const tx = await client.claim(wallet, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[claim hash]', tx.hash)
			})

		if (testAction === 'getClaimTransaction')
			it('client.getClaimTransaction', async () => {
				const txParams = await client.getClaimTransaction(address, 'ethmvaloper12rzs4kgcsnjtjqvnewcl62stmdzqklm9atkqpg')
				const tx = await wallet.sendTransaction(txParams)

				const result = await tx.wait()

				expect(result.status).toBe(1)
				console.log('[claim hash]', tx.hash)
			})
	}
})
