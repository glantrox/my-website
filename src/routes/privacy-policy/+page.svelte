<script>
    import { onMount } from 'svelte';
    import { ShieldCheck, Clock, ArrowLeft } from "lucide-svelte";
    import { privacyPolicy } from "$lib/data/legal.js";

    // Cast dataset to any[] to bypass union type checking in templates
    const dataset = /** @type {any[]} */(privacyPolicy);

    let activeSection = 'collect';

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeSection = entry.target.id;
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        dataset.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    });

    /**
     * @param {string} id
     */
    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            activeSection = id;
        }
    }
</script>

<svelte:head>
    <title>Kebijakan Privasi | Hamas Azizan</title>
    <meta name="description" content="Kebijakan Privasi mengenai pengumpulan, keamanan, dan kerahasiaan data proyek Klien oleh Hamas Azizan." />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 md:py-24">
    <!-- Header -->
    <header class="mb-16 border-b border-zinc-100 dark:border-zinc-800/80 pb-10">
        <a href="/order" class="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-8 transition-colors group">
            <ArrowLeft size={14} class="group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Formulir Pengajuan
        </a>
        
        

        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
            Privacy Policy
        </h1>
        
        <div class="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <Clock size={14} />
            <span>Terakhir Diperbarui: 17 Juli 2026</span>
        </div>
    </header>

    <!-- Main Content Grid -->
    <div class="flex flex-col lg:flex-row gap-12 items-start relative">
        <!-- Sidebar Navigation (Sticky) -->
        <nav class="w-full lg:w-1/4 sticky top-24 hidden lg:block border-r border-zinc-100 dark:border-zinc-800/80 pr-6 space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4 px-3">Daftar Isi</span>
            {#each dataset as section}
                <button
                    type="button"
                    class="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2.5 focus:outline-none
                        {activeSection === section.id 
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-semibold' 
                            : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-700 dark:hover:text-zinc-300'}"
                    on:click={() => scrollToSection(section.id)}
                >
                    <svelte:component this={section.icon} size={14} class={activeSection === section.id ? 'text-blue-500' : ''} />
                    {section.title.split('. ')[1]}
                </button>
            {/each}
        </nav>

        <!-- Privacy Policy Content -->
        <main class="w-full lg:w-3/4 space-y-16 text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans text-sm md:text-base">
            
            <!-- Introduction Panel -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/10">
                <p class="mb-4">
                    Di <strong>Hamas Azizan Web Engineering</strong>, kami berkomitmen untuk melindungi privasi, keamanan, dan kerahasiaan data yang diberikan oleh klien, mitra, dan pengunjung website kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkap, dan melindungi informasi pribadi serta bisnis Anda saat menggunakan platform kami atau menggunakan layanan kami.
                </p>
                <p class="font-serif italic text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                    Dengan mengakses platform kami, mengisi formulir briefing awal, atau menggunakan layanan kami, Anda menyetujui praktik pengolahan data yang dijelaskan dalam kebijakan privasi ini.
                </p>
            </div>

            <!-- Dynamic Sections Render -->
            {#each dataset as section}
                <section id={section.id} class="space-y-6 scroll-mt-28">
                    <div class="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                        <svelte:component this={section.icon} class="text-blue-500" size={20} />
                        <h2 class="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-100">{section.title}</h2>
                    </div>
                    
                    {#each section.subsections as sub}
                        <div class="space-y-4">
                            {#if sub.title}
                                <h3 class="font-semibold text-zinc-800 dark:text-zinc-200">{sub.title}</h3>
                            {/if}
                            {#if sub.content}
                                <p>{sub.content}</p>
                            {/if}
                            {#if sub.items}
                                <ul class="list-disc pl-6 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    {#each sub.items as item}
                                        <li>
                                            {#if item.includes(': ')}
                                                <strong>{item.split(': ')[0]}:</strong> {item.split(': ')[1]}
                                            {:else}
                                                {item}
                                            {/if}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    {/each}
                </section>
            {/each}
        </main>
    </div>
</div>
