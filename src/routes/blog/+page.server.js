import { blogPosts } from '$lib/data.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    blogPosts
  };
}
