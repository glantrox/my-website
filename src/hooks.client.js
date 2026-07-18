import { TelemetryLogger } from '$lib/services/logger';

/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event, status, message }) {
	if (status !== 404 && status !== 303 && status !== 302 && status !== 307 && status !== 308) {
		TelemetryLogger.logError(error, {
			route: event.url.pathname,
			payload: {
				params: event.params,
				status,
				message
			}
		});
	}

	return {
		message: "We're having trouble connecting to our servers. Please check your internet connection or try again in a few moments."
	};
}
