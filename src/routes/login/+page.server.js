import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET_KEY } from '$env/static/private';
import { dev } from '$app/environment';
import crypto from 'crypto';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const password = data.get('password');

    const adminSecret = ADMIN_SECRET_KEY;

    if (!adminSecret) {
      return {
        error: 'Admin authentication is not configured on the server.'
      };
    }

    if (password === adminSecret) {
      // Generate a stateless, signed session token: "admin:<expires_timestamp>.<signature>"
      const expires = Date.now() + 60 * 60 * 24 * 7 * 1000; // 1 week
      const sessionValue = `admin:${expires}`;
      const signature = crypto
        .createHmac('sha256', adminSecret)
        .update(sessionValue)
        .digest('hex');
      const sessionToken = `${sessionValue}.${signature}`;

      cookies.set('sid', sessionToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: !dev,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      throw redirect(303, '/projects');
    }

    return {
      error: 'Invalid password'
    };
  }
};
