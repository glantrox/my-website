<script>
	export let data;
	const { isAdmin, projects } = data;
	// import { projects } from '$lib/data.js';
	import { X, ExternalLink, Github, Calendar, User, LayoutGrid, Code2 } from 'lucide-svelte';
	import { afterUpdate, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	/**
	 * @typedef {{
	 *   id: string;
	 *   title: string;
	 *   tagline: string;
	 *   date: string;
	 *   role: string;
	 *   status: string;
	 *   techStack: string[];
	 *   links: { live: string; github: string; };
	 *   image: string;
	 *   colSpan: number;
	 *   description: string;
	 * }} Project
	 */

	let showModal = false;
	/** @type {Project | null} */
	let selectedProject = null;
	/** @type {string} */
	let originalBodyOverflow;

	/** @param {Project} project */
	function openModal(project) {
		selectedProject = project;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedProject = null;
	}

	/** @param {KeyboardEvent} event */
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	// Disable/enable body scrolling and attach/detach keydown listener when modal opens/closes
	afterUpdate(() => {
		if (browser) {
			if (showModal) {
				originalBodyOverflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
				window.addEventListener('keydown', handleKeydown);
			} else {
				if (originalBodyOverflow) {
					document.body.style.overflow = originalBodyOverflow;
				}
				window.removeEventListener('keydown', handleKeydown);
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			// Clean up event listener and restore body overflow if component is destroyed while modal is open
			window.removeEventListener('keydown', handleKeydown);
			if (originalBodyOverflow) {
				document.body.style.overflow = originalBodyOverflow;
			}
		}
	});

	/**
	 * @param {string[]} techStack
	 * @returns {string[]}
	 */
	function formatTechStack(techStack) {
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

<div class="max-w-6xl mx-auto px-6 py-12 md:px-16 md:py-24">
	<section>
		<div class="flex justify-between items-center mb-12">
			<h2 class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
				Selected Projects
			</h2>
		</div>

		<!-- Masonry Layout Container -->
		<div class="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
			{#each projects as project (project.id)}
				<button
					type="button"
					class="group cursor-pointer text-left mb-8 break-inside-avoid"
					on:click={() => openModal(project)}
				>
					<!-- Image Container with subtle gray background -->
					<div
						class="bg-zinc-50 dark:bg-zinc-900 rounded-xl overflow-hidden mb-5 border border-zinc-100 dark:border-zinc-800 relative"
					>
						<!-- Placeholder colored block to simulate loading/image presence if img fails -->
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
							<h3 class="text-zinc-900 font-medium  dark:text-white">{project.title}</h3>
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

{#if showModal && selectedProject}
	<!-- Full Modal Overlay and Content -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 150 }}>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
			on:click={closeModal}
			aria-hidden="true"
		></div>

		<!-- Modal Content -->
		<div
			class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white rounded-2xl border border-zinc-900 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
			role="dialog"
			aria-modal="true"
		>
			<!-- Close Button -->
			<button
				on:click={closeModal}
				class="absolute top-4 right-4 z-30 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md"
				aria-label="Close modal"
			>
				<X size={20} />
			</button>

			<!-- Header Image Area with Asymmetric Typography and Mockup alignment -->
			<div class="w-full h-56 sm:h-72 relative shrink-0 overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-900">
				<!-- Large Typographical Backdrop Watermark -->
				<div class="absolute inset-0 select-none overflow-hidden flex flex-col justify-center pl-6 sm:pl-8 opacity-[0.05] pointer-events-none font-extrabold uppercase tracking-tighter leading-none text-white">
					<span class="text-6xl sm:text-7xl block">{selectedProject.title}</span>
					<span class="text-5xl sm:text-6xl block">{selectedProject.tagline?.split(' ')?.[0] || 'Project'}</span>
					<span class="text-4xl sm:text-5xl block">{selectedProject.tagline?.split(' ')?.[1] || 'Design'}</span>
				</div>

				<!-- Mockup Image positioned on the right -->
				{#if selectedProject.image}
					<img
						src={selectedProject.image}
						alt={selectedProject.title}
						class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-[90%] w-[55%] sm:w-[50%] object-contain z-10 transition-transform duration-700 hover:scale-105"
					/>
				{/if}

				<!-- Dark gradient overlay for text readability -->
				<div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent z-10"></div>

				<!-- Project Title and Tagline left-aligned -->
				<div class="absolute bottom-6 left-6 sm:left-8 z-20 max-w-[45%]">
					<h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
						{selectedProject.title}
					</h2>
					<p class="text-zinc-400 text-xs sm:text-sm font-medium tracking-wide">
						{selectedProject.tagline}
					</p>
				</div>
			</div>

			<!-- Body Container -->
			<div class="p-6 sm:p-8 flex flex-col gap-8">
				<!-- Main Description -->
				<section>
					<h3 class="text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
						<LayoutGrid size={18} class="text-blue-500" />
						About the Project
					</h3>
					<p class="text-zinc-300 text-sm sm:text-base leading-relaxed">
						{selectedProject.description}
					</p>
				</section>

				<!-- Details Row (Flat 3-column layout on main background) -->
				<div class="grid grid-cols-3 gap-4 py-6 border-y border-zinc-900">
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
								class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-semibold rounded-xl border border-zinc-850 transition-colors shadow-sm text-xs"
							>
								<Github size={16} />
								Source Code
							</a>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
