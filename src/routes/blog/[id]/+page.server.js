import { error } from '@sveltejs/kit';
import { blogPosts } from '$lib/data.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const post = blogPosts.find((p) => p.id === Number(params.id));

  if (!post) {
    throw error(404, 'Blog post not found');
  }

  return {
    post
  };
}
