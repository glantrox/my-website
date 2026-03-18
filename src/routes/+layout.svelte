<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const sidebarSections = [
		{
			items: [
				{ href: '/', label: 'About' },
				{ href: '/blog', label: 'Blog' },
				{ href: '/cv', label: 'CV' }
			]
		},
		{
			title: 'Work',
			items: [
				{ href: '/projects', label: 'Selected Projects' },
				{ href: '/ternakaja', label: 'TernakAja' }
			]
		},
		{
			title: 'Human Interface',
			items: [
				{ href: '/mobile', label: 'Mobile App' },
				{ href: '/tablet', label: 'Tablet OS' }
			]
		},
		{
			title: 'Web Interface',
			items: [
				{ href: '/saas', label: 'SaaS Dashboards' },
				{ href: '/ecommerce', label: 'E-Commerce' },
				{ href: '/landing', label: 'Landing Pages' }
			]
		},
		{
			title: 'Contact',
			items: [
				{ href: 'mailto:hamas.azizan@gmail.com', label: 'Mail' },
				{ href: 'https://twitter.com/hamasazizan', label: 'Twitter' },
				{ href: 'https://linkedin.com/in/hamasazizan', label: 'LinkedIn' }
			]
		}
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Hamas Azizan</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-white text-zinc-900 font-sans flex flex-col md:flex-row selection:bg-zinc-200 selection:text-zinc-900"
>
	<!-- Sidebar - Fixed on desktop, static top on mobile -->
	<aside
		class="w-full md:w-64 md:fixed md:h-screen border-b md:border-b-0 md:border-r border-zinc-200 bg-white/80 backdrop-blur-md z-10 overflow-y-auto"
	>
		<div class="p-8 pb-12">
			<!-- Logo / Monogram area -->
			<a href="/" class="mb-16 w-12 h-12 border border-zinc-200 flex items-center justify-center rounded bg-zinc-50">
				<span class="font-serif font-medium text-lg tracking-tighter">HA</span>
			</a>

			<nav>
				{#each sidebarSections as section}
					<div class="mb-10">
						{#if section.title}
							<h4 class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-4">
								{section.title}
							</h4>
						{/if}
						<ul class="space-y-2.5 text-sm">
							{#each section.items as item}
								<li>
									<a
										href={item.href}
										class="text-zinc-500 hover:text-zinc-900 cursor-pointer transition-colors duration-200"
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
	<main class="flex-1 md:ml-64 bg-white min-h-screen">
		{@render children()}
	</main>
</div>
