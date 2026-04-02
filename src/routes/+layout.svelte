<script>
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();

	const sidebarSections = [
		{
			items: [
				{ href: "/", label: "About" },
				{ href: "/blog", label: "Blog" },
				{ href: "/cv", label: "CV" },
			],
		},
		{
			title: "Work",
			items: [
				{ href: "/projects", label: "Selected Projects" },
				{ href: "/ternakaja", label: "TernakAja" },
			],
		},
		{
			title: "Contact",
			items: [
				{ href: "mailto:hamasazeezan@gmail.com", label: "Mail" },
				{
					href: "https://www.instagram.com/hamasified/",
					label: "Instagram",
				},
				{
					href: "https://www.linkedin.com/in/hamas-azizan-6924aa266/",
					label: "LinkedIn",
				},
				{ href: "https://github.com/glantrox", label: "GitHub" },
			],
		},
	];

	// Theme Toggle Logic
	let isDark = $state(false);

	$effect(() => {
		isDark = document.documentElement.classList.contains("dark");
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Hamas Azizan</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 font-sans flex flex-col md:flex-row selection:bg-zinc-200 dark:selection:bg-zinc-700 selection:text-zinc-900 dark:selection:text-zinc-100 transition-colors duration-200"
>
	<!-- Sidebar - Fixed on desktop, static top on mobile -->
	<aside
		class="w-full md:w-64 md:fixed md:h-screen border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 overflow-y-auto transition-colors duration-200"
	>
		<div class="p-8 pb-12">
			<div class="flex items-center justify-between mb-16">
				<!-- Logo / Monogram area -->
				<a
					href="/"
					class="w-12 h-12 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center rounded bg-zinc-50 dark:bg-zinc-800 transition-colors duration-200"
				>
					<span
						class="font-serif font-medium text-lg tracking-tighter"
						>HA</span
					>
				</a>

				<!-- Theme Toggle -->
				<button
					onclick={toggleTheme}
					aria-label="Toggle Dark Mode"
					class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
				>
					{#if !isDark}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
							></path></svg
						>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="12" r="5"></circle><line
								x1="12"
								y1="1"
								x2="12"
								y2="3"
							></line><line x1="12" y1="21" x2="12" y2="23"
							></line><line
								x1="4.22"
								y1="4.22"
								x2="5.64"
								y2="5.64"
							></line><line
								x1="18.36"
								y1="18.36"
								x2="19.78"
								y2="19.78"
							></line><line x1="1" y1="12" x2="3" y2="12"
							></line><line x1="21" y1="12" x2="23" y2="12"
							></line><line
								x1="4.22"
								y1="19.78"
								x2="5.64"
								y2="18.36"
							></line><line
								x1="18.36"
								y1="5.64"
								x2="19.78"
								y2="4.22"
							></line></svg
						>
					{/if}
				</button>
			</div>

			<nav>
				{#each sidebarSections as section}
					<div class="mb-10">
						{#if section.title}
							<h4
								class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4"
							>
								{section.title}
							</h4>
						{/if}
						<ul class="space-y-2.5 text-sm">
							{#each section.items as item}
								<li>
									<a
										href={item.href}
										class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors duration-200"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main
		class="flex-1 md:ml-64 bg-white dark:bg-zinc-900 min-h-screen transition-colors duration-200"
	>
		{@render children()}
	</main>
</div>
