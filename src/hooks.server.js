// src/hooks.server.js
import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET_KEY } from '$env/static/private';
import crypto from 'crypto';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const adminSecret = ADMIN_SECRET_KEY;
	event.locals.isAdmin = false;

	// Logout logic
	if (event.url.pathname === '/logout') {
		event.cookies.delete('sid', { path: '/' });
		throw redirect(303, '/');
	}

	// Check for the session cookie on every request
	const sid = event.cookies.get('sid');
	if (adminSecret && sid) {
		const parts = sid.split('.');
		if (parts.length === 2) {
			const [sessionValue, signature] = parts;
			const expectedSignature = crypto
				.createHmac('sha256', adminSecret)
				.update(sessionValue)
				.digest('hex');

			// Timing-safe comparison to prevent timing attacks
			const sigBuf = Buffer.from(signature);
			const expSigBuf = Buffer.from(expectedSignature);
			if (
				sigBuf.length === expSigBuf.length &&
				crypto.timingSafeEqual(sigBuf, expSigBuf)
			) {
				const [role, expiresStr] = sessionValue.split(':');
				const expires = parseInt(expiresStr, 10);
				if (role === 'admin' && expires > Date.now()) {
					event.locals.isAdmin = true;
				}
			}
		}
	}

	if ((event.url.pathname.startsWith('/projects/new') || event.url.pathname.startsWith('/dashboard')) && !event.locals.isAdmin) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);
	return response;
}

import { TelemetryLogger } from './lib/services/logger';

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event, status, message }) {
	// Skip logging of client redirects / 404s to telemetry
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
