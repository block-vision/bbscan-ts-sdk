interface ValidatorsResponse {
	validators: {
		operator_address: string
		jailed: boolean
		status: string
		tokens: string
		delegator_shares: string
		description: {
			moniker: string
			identity: string
			website: string
			security_contact: string
			details: string
		}
		unbonding_height: string
		unbonding_time: string
		commission: {
			commission_rates: {
				rate: string
				max_rate: string
				max_change_rate: string
			}
			update_time: string
		}
		min_self_delegation: string
		unbonding_on_hold_ref_count: string
		unbonding_ids: string[]
	}[]

	pagination: {
		next_key: string | null
		total: string
	}
}

interface DelegationsResponse {
	delegation_responses: {
		delegation: {
			delegator_address: string
			validator_address: string
			shares: string
		}
		balance: {
			denom: string
			amount: string
		}
	}[]

	pagination: {
		next_key: string | null
		total: string
	}
}
