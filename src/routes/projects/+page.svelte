<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { ExternalLink, Github, Calendar, User, LayoutGrid, Code2 } from 'lucide-svelte';

	let { data } = $props();

	let showModal = $state(false);
	let selectedProject = $state<any>(null);

	function openModal(project: any) {
		selectedProject = project;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedProject = null;
	}

	function formatTechStack(techStack: string[]) {
		if (!techStack || techStack.length === 0) return ['SvelteKit', 'Tailwind CSS'];
		if (techStack.length === 1 && techStack[0] === 'Web') {
			return ['SvelteKit', 'Tailwind CSS', 'Firebase', 'Nodemailer'];
		}
		if (techStack.length === 1 && techStack[0] === 'Mobile') {
			return ['React Native', 'Expo', 'Firebase', 'Tailwind CSS'];
		}
		return techStack;
	}
</script>

<svelte:head>
	<title>Selected Projects | Hamas Azizan</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<section>
		<div class="flex justify-between items-center mb-12">
			<h2 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
				Selected Projects
			</h2>
		</div>

		<!-- Masonry Layout Container -->
		<div class="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
			{#each data.projects as project (project.id)}
				<button
					type="button"
					class="group cursor-pointer text-left mb-8 break-inside-avoid w-full border-0 bg-transparent p-0 focus:outline-none"
					onclick={() => openModal(project)}
				>
					<!-- Image Container -->
					<div
						class="bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden mb-5 border border-zinc-100 dark:border-zinc-800 relative aspect-video"
					>
						<div class="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 animate-pulse -z-10"></div>
						<img
							src={project.image}
							alt={project.title}
							class="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
							loading="lazy"
						/>
					</div>

					<!-- Project Details -->
					<div class="flex justify-between items-start text-sm px-1">
						<div>
							<h3 class="text-zinc-900 font-medium dark:text-white">{project.title}</h3>
							<p class="text-zinc-500 dark:text-zinc-400 mt-0.5">{project.tagline}</p>
						</div>
						<div class="text-zinc-400 dark:text-zinc-500 text-right">
							<span>{project.date}</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</section>
</div>

<!-- Modal component using Svelte 5 standard wrapper -->
<Modal isOpen={showModal} onClose={closeModal} class="max-w-3xl w-full bg-zinc-950 text-white rounded-2xl border border-zinc-900 shadow-2xl flex flex-col p-0">
	{#if selectedProject}
		<!-- Header Image Area -->
		<div class="w-full h-56 sm:h-72 relative shrink-0 overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-900">
			<!-- Watermark -->
			<div class="absolute inset-0 select-none overflow-hidden flex flex-col justify-center pl-6 sm:pl-8 opacity-[0.05] pointer-events-none font-extrabold uppercase tracking-tighter leading-none text-white">
				<span class="text-6xl sm:text-7xl block">{selectedProject.title}</span>
				<span class="text-5xl sm:text-6xl block">{selectedProject.tagline?.split(' ')?.[0] || 'Project'}</span>
				<span class="text-4xl sm:text-5xl block">{selectedProject.tagline?.split(' ')?.[1] || 'Design'}</span>
			</div>

			<!-- Image -->
			{#if selectedProject.image}
				<img
					src={selectedProject.image}
					alt={selectedProject.title}
					class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-[90%] w-[55%] sm:w-[50%] object-contain z-10 transition-transform duration-700 hover:scale-105"
				/>
			{/if}

			<div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent z-10"></div>

			<div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-20 max-w-[65%] sm:max-w-[50%]">
				<h2 class="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-1 sm:mb-2">
					{selectedProject.title}
				</h2>
				<p class="text-zinc-400 text-xs sm:text-sm font-medium tracking-wide">
					{selectedProject.tagline}
				</p>
			</div>
		</div>

		<!-- Body Container -->
		<div class="p-4 sm:p-8 flex flex-col gap-6 sm:gap-8 text-left">
			<section>
				<h3 class="text-sm sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
					<LayoutGrid size={18} class="text-blue-500" />
					About the Project
				</h3>
				<p class="text-zinc-300 text-xs sm:text-base leading-relaxed">
					{selectedProject.description}
				</p>
			</section>

			<!-- Details Row -->
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 sm:py-6 border-y border-zinc-900">
				<div>
					<span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
						<Calendar size={13} class="text-zinc-500" /> Timeline
					</span>
					<p class="text-zinc-200 font-semibold text-xs sm:text-sm">{selectedProject.date}</p>
				</div>
				
				<div>
					<span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
						<User size={13} class="text-zinc-500" /> Role
					</span>
					<p class="text-zinc-200 font-semibold text-xs sm:text-sm">{selectedProject.role}</p>
				</div>

				<div>
					<span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
						<Code2 size={13} class="text-zinc-500" /> Status
					</span>
					<div>
						<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							{selectedProject.status}
						</span>
					</div>
				</div>
			</div>

			<!-- Tech Stack -->
			<section class="space-y-3">
				<h3 class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
					Technologies Used
				</h3>
				<div class="flex flex-wrap gap-2">
					{#each formatTechStack(selectedProject.techStack) as tech}
						<span class="px-2.5 py-1 bg-zinc-900 text-zinc-300 rounded-md text-xs font-medium select-none">
							{tech}
						</span>
					{/each}
				</div>
			</section>

			<!-- Action Links -->
			{#if selectedProject.links}
				<div class="pt-6 border-t border-zinc-900 flex flex-wrap gap-4 mt-auto">
					{#if selectedProject.links.live}
						<a
							href={selectedProject.links.live}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-xs"
						>
							<ExternalLink size={16} />
							View Live Site
						</a>
					{/if}
					{#if selectedProject.links.github}
						<a
							href={selectedProject.links.github}
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-800 transition-colors shadow-sm text-xs"
						>
							<Github size={16} />
							Source Code
						</a>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</Modal>
