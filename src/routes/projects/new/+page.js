/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
  const { isAdmin } = await parent();
  return { isAdmin };
}
