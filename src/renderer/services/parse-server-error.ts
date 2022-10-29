
export function parseServerError(error: any) {
	try {
		if (!!error && typeof error === 'object') {
			if (error.networkError) {
				return {
					message: error.networkError.message,
				}
			}
			if (!!error.graphQLErrors) {
				const [e] = error.graphQLErrors;
				return {
					message: e && e.message ? e.message.replace(/String/g, '').replace(/"/g, '') : '',
				};
			}
		}
	} catch (e) { }
	return {
		message: JSON.stringify(error),
	};
}