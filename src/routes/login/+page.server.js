import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const password = data.get('password');
    console.log('Password entered by user:', password);

    const adminSecret = process.env.ADMIN_SECRET_KEY;
    console.log('adminSecret from env:', adminSecret);

    if (!adminSecret) {
      return {
        error: 'Admin authentication is not configured on the server.'
      };
    }

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
