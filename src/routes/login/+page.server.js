import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const password = data.get('password');

    const adminSecret = env.ADMIN_SECRET_KEY;

    if (password === adminSecret) {
      cookies.set('sid', adminSecret, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      throw redirect(303, '/projects');
    }

    return {
      error: 'Invalid password'
    };
  }
};
