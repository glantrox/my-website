<script>
  export let data;
  const { isAdmin } = data;

  import { Book, Link, Github, CalendarDays, User, Code, ImageUp, LayoutGrid, Save, X } from 'lucide-svelte';

  let project = {
    title: '',
    tagline: '',
    date: '',
    role: '',
    status: '',
    techStack: '', // Will be handled as a string for input, then split into array
    links: {
      live: '',
      github: ''
    },
    image: '',
    description: ''
  };

  // Helper to split techStack string into an array for display
  $: techStackArray = project.techStack
    ? project.techStack.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  function handleSubmit() {
    // In a real application, you would handle form submission here,
    // like sending the data to a server or updating a store.
    // For now, we'll just log the data to the console.
    console.log('New Project Data:', {
      ...project,
      techStack: techStackArray
    });
    alert('Project data logged to console. See the browser developer tools.');
  }

  function handleCancel() {
    // Redirect to projects page or show confirmation
    window.location.href = '/projects';
  }
</script>

<div class="min-h-screen bg-slate-50">
  {#if isAdmin}
    <!-- Sticky Header/Action Bar -->
    <header class="sticky top-0 bg-white border-b border-slate-200 z-10">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-800">Add New Project</h1>
        <div class="flex items-center space-x-3">
          <button
            type="button"
            on:click={handleCancel}
            class="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X class="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            form="project-form"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save class="w-4 h-4 mr-2" />
            Save Project
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8 md:py-12">
      <form id="project-form" on:submit|preventDefault={handleSubmit} class="space-y-8">
        <!-- General Information Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <Book class="w-5 h-5 text-blue-500" />
            General Information
          </h2>
          <div class="space-y-5">
            <div>
              <label for="title" class="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                id="title"
                bind:value={project.title}
                class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., My Awesome Project"
                required
              />
            </div>
            <div>
              <label for="tagline" class="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                id="tagline"
                bind:value={project.tagline}
                class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="A short, catchy description"
                required
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                id="description"
                bind:value={project.description}
                rows="4"
                class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Detailed description of the project"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Details Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <LayoutGrid class="w-5 h-5 text-blue-500" />
            Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="date" class="block text-sm font-medium text-slate-700 mb-1">Date / Timeline</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="date"
                  bind:value={project.date}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Jan 2023 - Present"
                />
              </div>
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-slate-700 mb-1">Your Role</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="role"
                  bind:value={project.role}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Lead Developer, UI/UX Designer"
                />
              </div>
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Code class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="status"
                  bind:value={project.status}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Completed, In Progress"
                />
              </div>
            </div>
            <div>
              <label for="image" class="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageUp class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  id="image"
                  bind:value={project.image}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tech Stack Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <Code class="w-5 h-5 text-blue-500" />
            Tech Stack
          </h2>
          <div>
            <label for="techStack" class="block text-sm font-medium text-slate-700 mb-1">Technologies Used (comma-separated)</label>
            <input
              type="text"
              id="techStack"
              bind:value={project.techStack}
              class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., React, TypeScript, Tailwind CSS"
            />
            {#if techStackArray.length > 0}
              <div class="mt-3 flex flex-wrap gap-2">
                {#each techStackArray as tech}
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {tech}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        <!-- Links Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 class="text-lg font-semibold text-slate-700 mb-5 flex items-center gap-2">
            <Link class="w-5 h-5 text-blue-500" />
            Project Links
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label for="liveLink" class="block text-sm font-medium text-slate-700 mb-1">Live Site URL</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  id="liveLink"
                  bind:value={project.links.live}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://live-project.com"
                />
              </div>
            </div>
            <div>
              <label for="githubLink" class="block text-sm font-medium text-slate-700 mb-1">GitHub Repository URL</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Github class="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  id="githubLink"
                  bind:value={project.links.github}
                  class="pl-10 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://github.com/your/project"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
  {:else}
    <div class="text-center py-20">
      <h1 class="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p class="text-lg text-slate-600">You do not have permission to view this page. Please log in as an administrator.</p>
    </div>
  {/if}
</div>
