<script>
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { page } from "$app/stores";
	import Toaster from "$lib/components/ui/toast/Toaster.svelte";
	import { fade, slide } from "svelte/transition";

	let { data, children } = $props();

	let hasDraftCookie = $state(false);
	let isMobileMenuOpen = $state(false);

	function checkDraftCookie() {
		if (typeof document !== 'undefined') {
			hasDraftCookie = document.cookie.includes("contactName=") || 
			                 document.cookie.includes("contactEmail=") ||
			                 document.cookie.includes("companyName=") ||
			                 document.cookie.includes("projectTitle=");
		}
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	$effect(() => {
		// Recheck draft status on page transitions & close mobile menu
		const _url = $page.url;
		checkDraftCookie();
		isMobileMenuOpen = false;
	});

	// Body scroll lock and ESC / resize listener for mobile menu
	$effect(() => {
		if (typeof window !== 'undefined') {
			if (isMobileMenuOpen) {
				const originalOverflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';

				const handleKeyDown = (/** @type {KeyboardEvent} */ e) => {
					if (e.key === 'Escape') {
						closeMobileMenu();
					}
				};

				const handleResize = () => {
					if (window.innerWidth >= 768) {
						closeMobileMenu();
					}
				};

				window.addEventListener('keydown', handleKeyDown);
				window.addEventListener('resize', handleResize);

				return () => {
					document.body.style.overflow = originalOverflow;
					window.removeEventListener('keydown', handleKeyDown);
					window.removeEventListener('resize', handleResize);
				};
			}
		}
	});

	// Helper to check if a navigation route is currently active
	function isActive(/** @type {string} */ href) {
		if (href.startsWith('http') || href.startsWith('mailto')) return false;
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}

	// Derive final draft status from server-side and client-side checks
	const hasDraft = $derived(data.hasDraft || hasDraftCookie);

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
			title: "Services",
			items: [
				{ href: "/mobile-app-service", label: "Mobile App" },
				{ href: "/website-service", label: "Website" }
			]
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
	<!-- Mobile Top Navigation Bar (Only on small screens < md) -->
	<header
		class="md:hidden sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-5 py-3.5 flex items-center justify-between transition-colors duration-200"
	>
		<!-- Brand Monogram -->
		<a
			href="/"
			onclick={closeMobileMenu}
			class="w-10 h-10 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 transition-colors duration-200 shadow-xs"
			aria-label="Home"
		>
			<span class="font-serif font-medium text-base tracking-tighter">HA</span>
		</a>

		<!-- Mobile Header Actions (Theme Toggle + Hamburger) -->
		<div class="flex items-center gap-2">
			<!-- Theme Toggle Button -->
			<button
				onclick={toggleTheme}
				aria-label="Toggle Dark Mode"
				class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 cursor-pointer"
			>
				{#if !isDark}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-zinc-600 dark:text-zinc-300"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-zinc-300"
					>
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" y1="1" x2="12" y2="3"></line>
						<line x1="12" y1="21" x2="12" y2="23"></line>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
						<line x1="1" y1="12" x2="3" y2="12"></line>
						<line x1="21" y1="12" x2="23" y2="12"></line>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
					</svg>
				{/if}
			</button>

			<!-- Hamburger / Close Toggle Button -->
			<button
				onclick={toggleMobileMenu}
				aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
				aria-expanded={isMobileMenuOpen}
				class="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 cursor-pointer shadow-xs"
			>
				{#if isMobileMenuOpen}
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
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
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
					>
						<line x1="4" y1="6" x2="20" y2="6"></line>
						<line x1="4" y1="12" x2="20" y2="12"></line>
						<line x1="4" y1="18" x2="20" y2="18"></line>
					</svg>
				{/if}
			</button>
		</div>
	</header>

	<!-- Mobile Navigation Drawer Overlay (Only on small screens < md) -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden fixed inset-0 top-[65px] z-30 bg-black/40 dark:bg-black/60 backdrop-blur-xs"
			transition:fade={{ duration: 150 }}
			onclick={closeMobileMenu}
			aria-hidden="true"
		></div>

		<div
			class="md:hidden fixed inset-x-0 top-[65px] bottom-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md overflow-y-auto border-b border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-6 pb-12 shadow-2xl"
			transition:slide={{ duration: 200 }}
		>
			<nav class="space-y-8">
				{#each sidebarSections as section}
					<div>
						{#if section.title}
							<h4
								class="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3"
							>
								{section.title}
							</h4>
						{/if}
						<ul class="space-y-2.5 text-base">
							{#each section.items as item}
								{@const active = isActive(item.href)}
								<li>
									<a
										href={item.href}
										onclick={closeMobileMenu}
										target={item.href.startsWith('http') ? '_blank' : undefined}
										rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
										class="block py-1.5 px-3 -mx-3 rounded-lg transition-colors duration-150 {active ? 'text-zinc-900 dark:text-white font-semibold bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}"
									>
										{item.label}
									</a>
								</li>
							{/each}

							<!-- Dynamically display Continue Order link under Services if draft exists -->
							{#if section.title === 'Services' && hasDraft}
								<li>
									<a
										href="/order"
										onclick={closeMobileMenu}
										class="block py-1.5 px-3 -mx-3 rounded-lg text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors duration-150"
									>
										Continue Order
									</a>
								</li>
							{/if}
						</ul>
					</div>
				{/each}

				<!-- Admin Section on Mobile (visible only to admin) -->
				{#if data.isAdmin}
					<div class="pt-6 border-t border-zinc-200 dark:border-zinc-800">
						<h4
							class="text-[11px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-3"
						>
							Admin
						</h4>
						<ul class="space-y-2.5 text-base">
							<li>
								<a
									href="/dashboard"
									onclick={closeMobileMenu}
									class="inline-flex items-center gap-2 py-1.5 px-3 -mx-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
								>
									Dashboard
									{#if data.pendingCount > 0}
										<span class="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">{data.pendingCount}</span>
									{/if}
								</a>
							</li>
							<li>
								<a
									href="/logout"
									onclick={closeMobileMenu}
									class="block py-1.5 px-3 -mx-3 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150"
								>
									Logout
								</a>
							</li>
						</ul>
					</div>
				{/if}
			</nav>

			<div class="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500">
				<p>© {new Date().getFullYear()} Hamas Azizan. All rights reserved.</p>
			</div>
		</div>
	{/if}

	<!-- Desktop Sidebar (Hidden on mobile, Fixed on md screens) -->
	<aside
		class="hidden md:block w-64 md:fixed md:h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-10 overflow-y-auto transition-colors duration-200 shrink-0"
	>
		<div class="p-8 pb-12">
			<div class="flex items-center justify-between mb-16">
				<!-- Logo / Monogram area -->
				<a
					href="/"
					class="w-12 h-12 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800 transition-colors duration-200 shadow-xs"
					aria-label="Home"
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
					class="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 cursor-pointer"
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
								{@const active = isActive(item.href)}
								<li>
									<a
										href={item.href}
										target={item.href.startsWith('http') ? '_blank' : undefined}
										rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
										class="cursor-pointer transition-colors duration-200 {active ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}"
									>
										{item.label}
									</a>
								</li>
							{/each}

							<!-- Dynamically display Continue Order link under Services if draft exists -->
							{#if section.title === 'Services' && hasDraft}
								<li>
									<a
										href="/order"
										class="text-blue-500 dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
									>
										Continue Order
									</a>
								</li>
							{/if}
						</ul>
					</div>
				{/each}
			</nav>

			<!-- Admin Section (visible only to admin) -->
			{#if data.isAdmin}
				<div class="mb-10 pt-4 border-t border-zinc-200 dark:border-zinc-800">
					<h4
						class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4"
					>
						Admin
					</h4>
					<ul class="space-y-2.5 text-sm">
						<li>
							<a
								href="/dashboard"
								class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors duration-200 flex items-center gap-2"
							>
								Dashboard
								{#if data.pendingCount > 0}
									<span class="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">{data.pendingCount}</span>
								{/if}
							</a>
						</li>
						<li>
							<a
								href="/logout"
								class="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors duration-200"
							>
								Logout
							</a>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</aside>

	<!-- Main Content Area -->
	<main
		class="flex-1 md:ml-64 bg-white dark:bg-zinc-900 min-h-screen transition-colors duration-200 w-full min-w-0"
	>
		{@render children()}
	</main>

	<Toaster />
</div>
