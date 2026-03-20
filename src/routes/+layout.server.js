/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  return {
    isAdmin: locals.isAdmin,
  };
}