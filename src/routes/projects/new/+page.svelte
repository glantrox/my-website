<script>
  import { page } from '$app/stores';

  let project = {
    title: '',
    tagline: '',
    date: '',
    role: '',
    status: '',
    techStack: '',
    links: {
      live: '',
      github: ''
    },
    image: '',
    description: ''
  };

  function handleSubmit() {
    // In a real application, you would handle form submission here,
    // like sending the data to a server or updating a store.
    // For now, we'll just log the data to the console.
    console.log('New Project Data:', {
      ...project,
      techStack: project.techStack.split(',').map(s => s.trim())
    });
    alert('Project data logged to console. See the browser developer tools.');
  }
</script>

<div class="max-w-4xl mx-auto px-6 py-12 md:px-16 md:py-24">
  {#if $page.url.searchParams.get('admin') === 'true'}
    <h1 class="text-3xl font-bold mb-8">Add New Project</h1>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" bind:value={project.title} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
      </div>
      <div>
        <label for="tagline" class="block text-sm font-medium text-gray-700">Tagline</label>
        <input type="text" id="tagline" bind:value={project.tagline} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
      </div>
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input type="text" id="date" bind:value={project.date} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <input type="text" id="role" bind:value={project.role} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <input type="text" id="status" bind:value={project.status} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="techStack" class="block text-sm font-medium text-gray-700">Tech Stack (comma-separated)</label>
        <input type="text" id="techStack" bind:value={project.techStack} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="liveLink" class="block text-sm font-medium text-gray-700">Live Link</label>
        <input type="url" id="liveLink" bind:value={project.links.live} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="githubLink" class="block text-sm font-medium text-gray-700">GitHub Link</label>
        <input type="url" id="githubLink" bind:value={project.links.github} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
        <input type="url" id="image" bind:value={project.image} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" bind:value={project.description} rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add Project
        </button>
      </div>
    </form>
  {:else}
    <div class="text-center">
      <h1 class="text-3xl font-bold text-red-600">Access Denied</h1>
      <p class="mt-4 text-gray-600">You do not have permission to view this page.</p>
    </div>
  {/if}
</div>
