<script>
  import { fade } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import { toast } from '$lib/entities/toast';
  import Spinner from '$lib/components/ui/spinner.svelte';
  import { z } from 'zod';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import {
    LayoutDashboard,
    Search,
    Filter,
    Building2,
    Globe,
    Smartphone,
    Calendar,
    Mail,
    ChevronRight,
    FolderOpen,
    Folder,
    Clock,
    CheckCircle2,
    User,
    Plus,
    Edit2,
    Trash2,
    X,
    AlertTriangle,
    Image as ImageIcon,
    FileCheck,
    Bell
  } from 'lucide-svelte';
  import { notificationStore } from '$lib/entities/notifications/notifications.svelte';

  // 1. Zod Validation Schema
  const ProjectFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    tagline: z.string().min(10, 'Tagline must be at least 10 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    role: z.string().min(2, 'Role must be at least 2 characters'),
    timeline: z.string().min(1, 'Timeline range is required'),
    status: z.enum(['In Progress', 'Completed']),
    imageUrl: z.string().url('Must be a valid URL')
  });

  // 2. Fetch page load data via Svelte 5 props rune
  let { data } = $props();

  // 3. Tab management state
  let activeTab = $state('projects'); // 'projects' or 'consultations'
  
  // Search and Filter states
  let searchQuery = $state('');
  let activeFilter = $state('all'); // consultations status filter

  // Project Modal Form States
  let isModalOpen = $state(false);
  let editingProject = $state(null);
  let formData = $state({
    id: '',
    title: '',
    tagline: '',
    description: '',
    role: '',
    timeline: '',
    status: 'In Progress',
    imageUrl: '',
    techStack: '',
    liveLink: '',
    githubLink: ''
  });
  /** @type {any} */
  let validationErrors = $state({});

  // Loading, custom modal, and tab states
  let isSubmitting = $state(false);
  let deletingProjectId = /** @type {any} */ ($state(null));
  let confirmDeleteOpen = $state(false);
  let projectToDelete = /** @type {any} */ ($state(null));
  let modalActiveTab = $state('core'); // 'core' or 'assets'

  // 4. Reactive derivations (Runes)
  const totalProjects = $derived(data.projects.length);
  const activeBuilds = $derived(data.projects.filter(p => p.status === 'In Progress').length);
  const completedCaseStudies = $derived(data.projects.filter(p => p.status === 'Completed').length);

  const consultationCounts = $derived.by(() => {
    /** @type {Record<string, number>} */
    const counts = { all: data.consultations.length };
    for (const c of data.consultations) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  });

  const filteredProjects = $derived(
    data.projects.filter((project) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (project.title || '').toLowerCase();
        const tagline = (project.tagline || '').toLowerCase();
        const role = (project.role || '').toLowerCase();
        return title.includes(q) || tagline.includes(q) || role.includes(q);
      }
      return true;
    })
  );

  const filteredConsultations = $derived(
    data.consultations.filter((consultation) => {
      if (activeFilter !== 'all' && consultation.status !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (consultation.projectTitle || '').toLowerCase();
        const company = (consultation.companyName || '').toLowerCase();
        const contact = (consultation.contactName || '').toLowerCase();
        return title.includes(q) || company.includes(q) || contact.includes(q);
      }
      return true;
    })
  );

  // Status Presets
  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'consulted', label: 'Consulted' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'review', label: 'Review' },
    { key: 'completed', label: 'Completed' },
    { key: 'archived', label: 'Archived' }
  ];

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    consulted: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    review: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    completed: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    archived: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20'
  };

  const tierColors = {
    basic: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    intermediate: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    industrial: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
  };

  // Helper Formats
  /** @param {string} status */
  function getStatusColor(status) {
    return statusColors[/** @type {keyof typeof statusColors} */(status)] || statusColors.pending;
  }

  /** @param {string} tier */
  function getTierColor(tier) {
    return tierColors[/** @type {keyof typeof tierColors} */(tier)] || tierColors.basic;
  }

  /** @param {string} status */
  function formatStatus(status) {
    if (!status) return 'Pending';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (/** @type {string} */ c) => c.toUpperCase());
  }

  /** @param {string | null | undefined} dateStr */
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  }

  // Modal Actions
  function openAddModal() {
    editingProject = null;
    formData = {
      id: '',
      title: '',
      tagline: '',
      description: '',
      role: '',
      timeline: '',
      status: 'In Progress',
      imageUrl: '',
      techStack: '',
      liveLink: '',
      githubLink: ''
    };
    validationErrors = {};
    modalActiveTab = 'core';
    isModalOpen = true;
  }

  /** @param {any} project */
  function openEditModal(project) {
    editingProject = project;
    formData = {
      id: project.id,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      role: project.role,
      timeline: project.timeline,
      status: project.status,
      imageUrl: project.imageUrl,
      techStack: project.techStack ? project.techStack.join(', ') : '',
      liveLink: project.links?.live || '',
      githubLink: project.links?.github || ''
    };
    validationErrors = {};
    modalActiveTab = 'core';
    isModalOpen = true;
  }

  /** @param {SubmitEvent} event */
  function handleFormSubmit(event) {
    const result = ProjectFormSchema.safeParse({
      title: formData.title,
      tagline: formData.tagline,
      description: formData.description,
      role: formData.role,
      timeline: formData.timeline,
      status: formData.status,
      imageUrl: formData.imageUrl
    });

    if (!result.success) {
      event.preventDefault();
      /** @type {Record<string, string>} */
      const errs = {};
      result.error.errors.forEach((err) => {
        const path = /** @type {string} */(err.path[0]);
        errs[path] = err.message;
      });
      validationErrors = errs;

      // UX Fix: Programmatically switch to the tab containing the first error
      const coreFields = ['title', 'tagline', 'description', 'role', 'timeline'];
      const hasCoreError = Object.keys(errs).some((field) => coreFields.includes(field));
      if (hasCoreError) {
        modalActiveTab = 'core';
      } else {
        modalActiveTab = 'assets';
      }
    } else {
      validationErrors = {};
    }
  }

  /** @param {KeyboardEvent} event */
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      isModalOpen = false;
      confirmDeleteOpen = false;
      projectToDelete = null;
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
  <title>Dashboard | Hamas Azizan</title>
</svelte:head>

<div class="p-6 md:p-10 max-w-7xl mx-auto space-y-10 selection:bg-zinc-200 dark:selection:bg-zinc-800">
  
  <!-- ==========================================
      HEADER & TABS (STICKY)
      ========================================== -->
  <header class="sticky top-14 md:top-0 z-30 flex flex-col md:flex-row md:items-end justify-between gap-6 -mx-6 md:-mx-10 px-6 md:px-10 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-colors">
    <div class="space-y-1">
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
        Project Management
      </h1>
      <p class="text-sm text-zinc-500 dark:text-zinc-400 font-light">
        Configure portfolio case studies and track client consultation leads.
      </p>
    </div>

    <!-- Actions / Tab Toggles -->
    <div class="flex items-center gap-3">
      <!-- Notification Bell Button -->
      <button
        type="button"
        onclick={() => notificationStore.toggleOpen()}
        class="relative p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs flex items-center justify-center"
        aria-label="Notifikasi Lead"
        title="Notifikasi"
      >
        <Bell size={16} />
        {#if notificationStore.unreadCount > 0}
          <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-xs animate-pulse">
            {notificationStore.unreadCount}
          </span>
        {/if}
      </button>

      <div class="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
        <button
          onclick={() => { activeTab = 'projects'; searchQuery = ''; }}
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition-all
            {activeTab === 'projects'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        >
          Portfolio Projects
        </button>
        <button
          onclick={() => { activeTab = 'consultations'; searchQuery = ''; }}
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5
            {activeTab === 'consultations'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}"
        >
          Client Leads
          {#if data.pendingCount > 0}
            <span class="inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- ==========================================
      TAB CONTENT: PORTFOLIO PROJECTS
      ========================================== -->
  {#if activeTab === 'projects'}
    <!-- Bento Metric Strip -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Projects -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div class="space-y-1">
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Total Projects</span>
          <span class="text-3xl font-extrabold text-zinc-900 dark:text-white block">{totalProjects}</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shadow-inner">
          <Folder size={20} />
        </div>
      </div>

      <!-- Active Builds -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div class="space-y-1">
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Active Builds</span>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-zinc-900 dark:text-white block">{activeBuilds}</span>
            {#if activeBuilds > 0}
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                Live Builds
              </span>
            {/if}
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
          <Clock size={20} />
        </div>
      </div>

      <!-- Completed Studies -->
      <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div class="space-y-1">
          <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Completed Case Studies</span>
          <span class="text-3xl font-extrabold text-zinc-900 dark:text-white block">{completedCaseStudies}</span>
        </div>
        <div class="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shadow-inner">
          <CheckCircle2 size={20} />
        </div>
      </div>
    </section>

    <!-- Search Bar & Add Project Action -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search projects by title, tagline, or role..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900/40 focus:ring-1 focus:ring-zinc-400 transition-colors"
        />
      </div>
      <button
        onclick={openAddModal}
        class="inline-flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
      >
        <Plus size={14} strokeWidth={2.5} />
        Add Project
      </button>
    </div>

    <!-- Component-driven Projects Bento Grid -->
    <section class="space-y-4">
      {#if filteredProjects.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredProjects as project (project.id)}
            <div class="group bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between h-full overflow-hidden transition-all duration-300 relative shadow-sm hover:border-zinc-350 dark:hover:border-zinc-700 {deletingProjectId === project.id ? 'pointer-events-none opacity-40' : ''}">
              
              <!-- Hover Action buttons -->
              <div class="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onclick={() => openEditModal(project)}
                  class="p-2 rounded-lg bg-white/95 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                  title="Edit Project"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  onclick={() => {
                    projectToDelete = project;
                    confirmDeleteOpen = true;
                  }}
                  disabled={deletingProjectId === project.id}
                  class="p-2 rounded-lg bg-white/95 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Project"
                >
                  {#if deletingProjectId === project.id}
                    <div class="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-800 dark:border-zinc-600 dark:border-t-zinc-300"></div>
                  {:else}
                    <Trash2 size={12} />
                  {/if}
                </button>
              </div>

              <!-- Cover Image Aspect-Video frame -->
              <div class="aspect-video w-full overflow-hidden relative bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900">
                {#if project.imageUrl}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    class="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-all duration-700 scale-100 group-hover:scale-105"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon size={32} />
                  </div>
                {/if}

                <!-- Status Badge -->
                <span 
                  class="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                    {project.status === 'Completed'
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shadow-sm'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}"
                >
                  {project.status}
                </span>
              </div>

              <!-- Card description block -->
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div class="space-y-2.5">
                  <h3 class="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                    {project.title}
                  </h3>
                  <p class="text-xs font-semibold text-zinc-450 dark:text-zinc-400">
                    {project.tagline}
                  </p>
                  <p class="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <!-- Metadata Row Divider and Footer -->
                <div class="mt-6 pt-4 border-t border-zinc-200/50 dark:border-white/[0.04]">
                  <div class="grid grid-cols-2 gap-4 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    <span class="flex items-center gap-1.5 truncate" title={project.role}>
                      <User size={12} class="text-zinc-400 shrink-0" />
                      <span class="truncate">{project.role}</span>
                    </span>
                    <span class="flex items-center justify-end gap-1.5 text-right">
                      <Calendar size={12} class="text-zinc-400 shrink-0" />
                      <span class="truncate">{project.timeline}</span>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-20 bg-zinc-50/50 dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <FolderOpen size={40} class="mx-auto text-zinc-400" />
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-zinc-700 dark:text-zinc-300">No projects found</h3>
            <p class="text-xs text-zinc-400 max-w-xs mx-auto">
              {#if searchQuery}
                No projects match your search query "{searchQuery}".
              {:else}
                Get started by creating your first portfolio case study.
              {/if}
            </p>
            {#if searchQuery}
              <button
                onclick={() => (searchQuery = '')}
                class="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Clear Search
              </button>
            {/if}
          </div>
        </div>
      {/if}
    </section>

  <!-- ==========================================
      TAB CONTENT: CLIENT LEADS
      ========================================== -->
  {:else if activeTab === 'consultations'}
    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200/60 dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Filter class="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
      {#each statusFilters as filter}
        <button
          onclick={() => (activeFilter = filter.key)}
          class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-150
            {activeFilter === filter.key
              ? 'bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}"
        >
          {filter.label}
          <span class="ml-1 opacity-60 font-bold">{consultationCounts[filter.key] || 0}</span>
        </button>
      {/each}
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search leads by client name, company, or project title..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/20 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900/40 focus:ring-1 focus:ring-zinc-400 transition-colors"
      />
    </div>

    <!-- Lead Cards Grid -->
    <section class="space-y-4">
      {#if filteredConsultations.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredConsultations as lead (lead.id)}
            <a
              href="/dashboard/{lead.id}"
              class="group block"
            >
              <Card.Root class="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200">
                <Card.Header class="pb-3">
                  <div class="flex items-start justify-between gap-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider {getStatusColor(lead.status)}">
                      {formatStatus(lead.status)}
                    </span>
                    <ChevronRight class="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                  </div>
                  <Card.Title class="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2 line-clamp-2 leading-snug">
                    {lead.projectTitle || 'Untitled Project'}
                  </Card.Title>
                </Card.Header>
                <Card.Content class="pt-0 space-y-3">
                  <!-- Company -->
                  {#if lead.companyName || lead.industry}
                    <div class="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Building2 class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">
                        {lead.companyName || '—'}
                        {#if lead.industry}
                          <span class="text-zinc-400 dark:text-zinc-600"> · {lead.industry}</span>
                        {/if}
                      </span>
                    </div>
                  {/if}

                  <!-- Tiers and Types -->
                  <div class="flex items-center gap-2 flex-wrap">
                    {#if lead.serviceType}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        {lead.serviceType === 'mobile_service'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'}">
                        {#if lead.serviceType === 'mobile_service'}
                          <Smartphone class="w-3 h-3" />
                          Mobile
                        {:else}
                          <Globe class="w-3 h-3" />
                          Web
                        {/if}
                      </span>
                    {/if}

                    {#if lead.projectTier}
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider {getTierColor(lead.projectTier)}">
                        {lead.projectTier}
                      </span>
                    {/if}

                    {#if lead.paymentProofUrl}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <FileCheck class="w-3 h-3" />
                        Bukti Bayar
                      </span>
                    {/if}
                  </div>

                  <!-- Contact -->
                  {#if lead.contactEmail}
                    <div class="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Mail class="w-3.5 h-3.5 flex-shrink-0" />
                      <span class="truncate">{lead.contactEmail}</span>
                    </div>
                  {/if}

                  <!-- Date -->
                  <div class="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                    <Calendar class="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </Card.Content>
              </Card.Root>
            </a>
          {/each}
        </div>
      {:else}
        <div class="text-center py-20 bg-zinc-50/50 dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
          <FolderOpen size={40} class="mx-auto text-zinc-400" />
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-zinc-700 dark:text-zinc-300">No leads found</h3>
            <p class="text-xs text-zinc-400 max-w-xs mx-auto">
              {#if searchQuery}
                No client leads match your query "{searchQuery}".
              {:else}
                No consultation requests are currently in the queue.
              {/if}
            </p>
            {#if searchQuery}
              <button
                onclick={() => (searchQuery = '')}
                class="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Clear Search
              </button>
            {/if}
          </div>
        </div>
      {/if}
    </section>
  {/if}
</div>

<!-- ==========================================
    PORTFOLIO PROJECT INTAKE FORM (MODAL)
    ========================================== -->
{#if isModalOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
    <!-- Backdrop overlay -->
    <button 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
      onclick={() => (isModalOpen = false)}
      aria-label="Close modal"
    ></button>

    <!-- Modal Box -->
    <div class="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-6 pb-4">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white">
          {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
        </h3>
        <button
          onclick={() => (isModalOpen = false)}
          class="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <!-- Tab Headers -->
      <div class="flex border-b border-zinc-100 dark:border-zinc-900 px-6 mb-4">
        <button
          type="button"
          onclick={() => (modalActiveTab = 'core')}
          class="flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all {modalActiveTab === 'core' 
            ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}"
        >
          Core Details
        </button>
        <button
          type="button"
          onclick={() => (modalActiveTab = 'assets')}
          class="flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all {modalActiveTab === 'assets' 
            ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' 
            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}"
        >
          Assets & Links
        </button>
      </div>

      <!-- Action-based Form Enhancer -->
      <form
        method="POST"
        action={editingProject ? '?/updateProject' : '?/createProject'}
        use:enhance={() => {
          isSubmitting = true;
          const toastId = toast.loading(editingProject ? 'Memperbarui proyek...' : 'Membuat proyek...');
          return async ({ result, update }) => {
            isSubmitting = false;
            if (result.type === 'success') {
              isModalOpen = false;
              toast.update(toastId, {
                type: 'success',
                message: editingProject ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil dibuat!',
                duration: 3000
              });
              await update();
            } else if (result.type === 'failure') {
              validationErrors = result.data?.errors || { _server: 'Gagal memproses data. Silakan periksa input Anda.' };
              toast.update(toastId, {
                type: 'error',
                message: 'Gagal memproses data. Silakan periksa input Anda.',
                duration: 4000
              });
            } else {
              validationErrors = { _server: 'Terjadi kesalahan sistem. Silakan coba lagi nanti.' };
              toast.update(toastId, {
                type: 'error',
                message: 'Terjadi kesalahan sistem. Silakan coba lagi nanti.',
                duration: 4000
              });
            }
          };
        }}
        onsubmit={handleFormSubmit}
        class="p-6 pt-2 space-y-4 max-h-[60vh] overflow-y-auto"
      >
        {#if editingProject}
          <input type="hidden" name="id" value={formData.id} />
        {/if}

        {#if validationErrors._server}
          <div class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
            <AlertTriangle size={14} />
            {validationErrors._server}
          </div>
        {/if}

        <!-- Tab: Core Details -->
        <div class="space-y-4 {modalActiveTab === 'core' ? 'block' : 'hidden'}">
          <!-- Project Title -->
          <div class="space-y-1.5">
            <Label for="title">Project Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              bind:value={formData.title}
              placeholder="e.g., Berkeleytime Hub"
            />
            {#if validationErrors.title}
              <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} />
                {validationErrors.title}
              </p>
            {/if}
          </div>

          <!-- Tagline -->
          <div class="space-y-1.5">
            <Label for="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              type="text"
              bind:value={formData.tagline}
              placeholder="e.g., Streamlining academic planning for students."
            />
            {#if validationErrors.tagline}
              <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} />
                {validationErrors.tagline}
              </p>
            {/if}
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <Label for="description">Detailed Description</Label>
            <textarea
              id="description"
              name="description"
              rows="3"
              bind:value={formData.description}
              placeholder="Outline objectives, solutions, backend integrations, and core tech achievements..."
              class="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl p-3 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 transition-colors"
            ></textarea>
            {#if validationErrors.description}
              <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} />
                {validationErrors.description}
              </p>
            {/if}
          </div>

          <!-- Role & Timeline in Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="role">My Role</Label>
              <Input
                id="role"
                name="role"
                type="text"
                bind:value={formData.role}
                placeholder="e.g., Lead Developer"
              />
              {#if validationErrors.role}
                <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {validationErrors.role}
                </p>
              {/if}
            </div>

            <div class="space-y-1.5">
              <Label for="timeline">Timeline</Label>
              <Input
                id="timeline"
                name="timeline"
                type="text"
                bind:value={formData.timeline}
                placeholder="e.g., Jan 2026 - Present"
              />
              {#if validationErrors.timeline}
                <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {validationErrors.timeline}
                </p>
              {/if}
            </div>
          </div>

          <!-- Status selection (Styled Toggle Radio Cards) -->
          <div class="space-y-1.5">
            <Label>Development Status</Label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                onclick={() => (formData.status = 'In Progress')}
                class="flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all {formData.status === 'In Progress' 
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white' 
                  : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'}"
              >
                <Clock size={13} />
                In Progress
              </button>
              <button
                type="button"
                onclick={() => (formData.status = 'Completed')}
                class="flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all {formData.status === 'Completed' 
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white' 
                  : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'}"
              >
                <CheckCircle2 size={13} />
                Completed
              </button>
            </div>
            <input type="hidden" name="status" value={formData.status} />
          </div>
        </div>

        <!-- Tab: Assets & Links -->
        <div class="space-y-4 {modalActiveTab === 'assets' ? 'block' : 'hidden'}">
          <!-- Cover Image URL -->
          <div class="space-y-1.5">
            <Label for="imageUrl">Cover Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              bind:value={formData.imageUrl}
              placeholder="https://images.unsplash.com/..."
            />
            {#if validationErrors.imageUrl}
              <p class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <AlertTriangle size={12} />
                {validationErrors.imageUrl}
              </p>
            {/if}
          </div>

          <!-- Tech Stack -->
          <div class="space-y-1.5">
            <Label for="techStack">Tech Stack (comma-separated)</Label>
            <Input
              id="techStack"
              name="techStack"
              type="text"
              bind:value={formData.techStack}
              placeholder="e.g., Svelte, TypeScript, PostgreSQL"
            />
          </div>

          <!-- Links Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <Label for="liveLink">Live Site URL</Label>
              <Input
                id="liveLink"
                name="liveLink"
                type="url"
                bind:value={formData.liveLink}
                placeholder="https://example.com"
              />
            </div>
            <div class="space-y-1.5">
              <Label for="githubLink">GitHub Repository URL</Label>
              <Input
                id="githubLink"
                name="githubLink"
                type="url"
                bind:value={formData.githubLink}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-900">
          <button
            type="button"
            onclick={() => (isModalOpen = false)}
            class="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            class="px-4 py-2 rounded-xl text-xs font-bold text-white dark:text-zinc-950 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {#if isSubmitting}
              <Spinner size={12} class="text-white dark:text-zinc-950" />
              Saving...
            {:else}
              Save Project
            {/if}
          </button>
        </div>
      </form>

    </div>
  </div>
{/if}

<!-- Custom Delete Confirmation Dialog Modal -->
{#if confirmDeleteOpen && projectToDelete}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
    <!-- Backdrop overlay -->
    <button 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default"
      onclick={() => { confirmDeleteOpen = false; projectToDelete = null; }}
      aria-label="Cancel deletion"
    ></button>

    <!-- Modal Box -->
    <div class="relative w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200 text-center space-y-4">
      <div class="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
        <AlertTriangle size={20} />
      </div>
      
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-white">Delete Portfolio Project</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Are you sure you want to delete <span class="font-semibold text-zinc-900 dark:text-zinc-200">"{projectToDelete.title}"</span>? This action is permanent.
        </p>
      </div>

      <form
        method="POST"
        action="?/deleteProject"
        use:enhance={() => {
          const targetId = projectToDelete?.id;
          deletingProjectId = targetId;
          confirmDeleteOpen = false;
          projectToDelete = null;
          const toastId = toast.loading('Menghapus proyek...');
          return async ({ result, update }) => {
            deletingProjectId = null;
            if (result.type === 'success') {
              toast.update(toastId, {
                type: 'success',
                message: 'Proyek berhasil dihapus!',
                duration: 3000
              });
              await update();
            } else {
              toast.update(toastId, {
                type: 'error',
                message: 'Gagal menghapus proyek. Silakan coba lagi.',
                duration: 4000
              });
            }
          };
        }}
        class="flex gap-3 justify-center pt-2"
      >
        <input type="hidden" name="id" value={projectToDelete.id} />
        <button
          type="button"
          onclick={() => { confirmDeleteOpen = false; projectToDelete = null; }}
          class="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20"
        >
          Yes, Delete Project
        </button>
      </form>
    </div>
  </div>
{/if}
