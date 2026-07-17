<script>
  import { invalidateAll } from "$app/navigation";
  import { superForm } from "sveltekit-superforms";
  import {
    Book,
    Link,
    Github,
    CalendarDays,
    User,
    Code,
    ImageUp,
    LayoutGrid,
    Save,
    X,
  } from "lucide-svelte";

  // Shadcn Components
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  export let data;
  const { isAdmin } = data;

  // Initialize superForm
  const { form, errors, enhance, message } = superForm(data.form, {
    dataType: "json",
    onResult({ result }) {
      if (result.type === "success") {
        invalidateAll();
      }
    },
  });

  $: techStackArray = $form.techStack
    ? $form.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  function handleCancel() {
    history.back();
  }
</script>

<div class="min-h-screen bg-background">
  {#if isAdmin}
    <header class="sticky top-0 bg-background border-b border-border z-10">
      <div
        class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between"
      >
        <h1 class="text-xl font-bold text-foreground">Add New Project</h1>
        <div class="flex items-center space-x-3">
          <Button variant="outline" on:click={handleCancel}>
            <X class="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" form="project-form">
            <Save class="w-4 h-4 mr-2" />
            Save Project
          </Button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-8 md:py-12">
      {#if $message}
        <div
          class="p-4 mb-6 text-sm rounded-md {$message.includes('successfully')
            ? 'bg-green-100 text-green-800'
            : 'bg-destructive/10 text-destructive'}"
        >
          {$message}
        </div>
      {/if}

      <form id="project-form" method="POST" use:enhance class="space-y-8">
        <Card.Root>
          <Card.Header>
            <Card.Title class="flex items-center gap-2 text-lg">
              <Book class="w-5 h-5 text-primary" />
              General Information
            </Card.Title>
          </Card.Header>
          <Card.Content class="space-y-5">
            <div class="space-y-2">
              <Label for="title">Project Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                bind:value={$form.title}
                placeholder="e.g., My Awesome Project"
                required
              />
              {#if $errors.title}
                <p class="text-[0.8rem] font-medium text-destructive">
                  {$errors.title}
                </p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="tagline">Tagline</Label>
              <Input
                type="text"
                id="tagline"
                name="tagline"
                bind:value={$form.tagline}
                placeholder="A short, catchy description"
                required
              />
              {#if $errors.tagline}
                <p class="text-[0.8rem] font-medium text-destructive">
                  {$errors.tagline}
                </p>
              {/if}
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <textarea
                id="description"
                name="description"
                bind:value={$form.description}
                rows={4}
                placeholder="Detailed description of the project"
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
              {#if $errors.description}
                <p class="text-[0.8rem] font-medium text-destructive">
                  {$errors.description}
                </p>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="flex items-center gap-2 text-lg">
              <LayoutGrid class="w-5 h-5 text-primary" />
              Details
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <Label for="date">Date / Timeline</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <CalendarDays class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="date"
                    name="date"
                    bind:value={$form.date}
                    class="pl-10"
                    placeholder="e.g., Jan 2023 - Present"
                  />
                </div>
                {#if $errors.date}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.date}
                  </p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="role">Your Role</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <User class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="role"
                    name="role"
                    bind:value={$form.role}
                    class="pl-10"
                    placeholder="e.g., Lead Developer, UI/UX Designer"
                  />
                </div>
                {#if $errors.role}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.role}
                  </p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="status">Status</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Code class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="status"
                    name="status"
                    bind:value={$form.status}
                    class="pl-10"
                    placeholder="e.g., Completed, In Progress"
                  />
                </div>
                {#if $errors.status}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.status}
                  </p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="image">Image URL</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <ImageUp class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="url"
                    id="image"
                    name="image"
                    bind:value={$form.image}
                    class="pl-10"
                    placeholder="https://example.com/project-image.jpg"
                  />
                </div>
                {#if $errors.image}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.image}
                  </p>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="flex items-center gap-2 text-lg">
              <Code class="w-5 h-5 text-primary" />
              Tech Stack
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="space-y-2">
              <Label for="techStack">Technologies Used (comma-separated)</Label>
              <Input
                type="text"
                id="techStack"
                name="techStack"
                bind:value={$form.techStack}
                placeholder="e.g., React, TypeScript, Tailwind CSS"
              />
              {#if $errors.techStack}
                <p class="text-[0.8rem] font-medium text-destructive">
                  {$errors.techStack}
                </p>
              {/if}
              {#if techStackArray.length > 0}
                <div class="mt-3 flex flex-wrap gap-2">
                  {#each techStackArray as tech}
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="flex items-center gap-2 text-lg">
              <Link class="w-5 h-5 text-primary" />
              Project Links
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-2">
                <Label for="liveLink">Live Site URL</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Link class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="url"
                    id="liveLink"
                    name="links.live"
                    bind:value={$form.links.live}
                    class="pl-10"
                    placeholder="https://live-project.com"
                  />
                </div>
                {#if $errors.links?.live}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.links.live}
                  </p>
                {/if}
              </div>

              <div class="space-y-2">
                <Label for="githubLink">GitHub Repository URL</Label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Github class="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="url"
                    id="githubLink"
                    name="links.github"
                    bind:value={$form.links.github}
                    class="pl-10"
                    placeholder="https://github.com/your/project"
                  />
                </div>
                {#if $errors.links?.github}
                  <p class="text-[0.8rem] font-medium text-destructive">
                    {$errors.links.github}
                  </p>
                {/if}
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </form>
    </main>
  {:else}
    <div
      class="text-center flex flex-col items-center justify-center min-h-[50vh] py-20"
    >
      <h1 class="text-3xl font-bold text-destructive mb-4">Access Denied</h1>
      <p class="text-lg text-muted-foreground">
        You do not have permission to view this page. Please log in as an
        administrator.
      </p>
    </div>
  {/if}
</div>
