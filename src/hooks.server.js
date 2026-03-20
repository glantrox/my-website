// src/hooks.server.js
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const adminSecret = env.ADMIN_SECRET_KEY;

	// Logout logic
	if (event.url.pathname === '/logout') {
		event.cookies.delete('sid', { path: '/' });
		throw redirect(303, '/');
	}

	// Check for the session cookie on every request
	const sid = event.cookies.get('sid');
	if (sid === adminSecret) {
		event.locals.isAdmin = true;
	}

	if (event.url.pathname.startsWith('/projects/new') && !event.locals.isAdmin) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);
	return response;
}
