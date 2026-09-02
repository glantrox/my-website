<script>
    import { onMount } from 'svelte';
    import { termsOfService } from "$lib/data/legal.js";

    // Cast dataset to any[] to bypass union type checking in templates
    const dataset = /** @type {any[]} */(termsOfService);

    let activeSection = 'scope';

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
    <title>Terms of Service | Hamas Azizan</title>
    <meta name="description" content="Terms of Service governing web application and mobile development services provided by Hamas Azizan." />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 py-12 md:py-24">
    <!-- Header -->
    <header class="mb-16 border-b border-zinc-100 dark:border-zinc-800/80 pb-10">
        <a href="/order" class="inline-flex items-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-8 transition-colors">
            Kembali ke Formulir Pengajuan
        </a>

        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
            Terms of Service
        </h1>
        
        <div class="text-xs text-zinc-400 dark:text-zinc-500">
            <span>Terakhir Diperbarui: 17 Juli 2026</span>
        </div>
    </header>

    <!-- Main Content Grid -->
    <div class="flex flex-col lg:flex-row gap-12 items-start relative">
        <!-- Sidebar Navigation (Fixed / Sticky) -->
        <aside class="w-full lg:w-64 lg:shrink-0 sticky top-8 self-start hidden lg:block border-r border-zinc-100 dark:border-zinc-800/80 pr-6 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <span class="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block mb-4 px-3">Daftar Isi</span>
            {#each dataset as section}
                <button
                    type="button"
                    class="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all block focus:outline-none cursor-pointer
                        {activeSection === section.id 
                            ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-semibold' 
                            : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 hover:text-zinc-700 dark:hover:text-zinc-300'}"
                    on:click={() => scrollToSection(section.id)}
                >
                    {section.title.split('. ')[1] || section.title}
                </button>
            {/each}
        </aside>

        <!-- Terms Content Pane -->
        <main class="w-full lg:flex-1 space-y-16 text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans text-sm md:text-base">
            
            <!-- Introduction Panel -->
            <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/10">
                <p class="mb-4">
                    Selamat datang di <strong>Hamas Azizan Web Engineering</strong>. Syarat dan Ketentuan Layanan ini mengatur penggunaan semua layanan pengembangan website, aplikasi web (SaaS/Dashboard), dan aplikasi mobile yang kami sediakan.
                </p>
                <p class="font-serif italic text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                    Dengan menyetujui proposal resmi (Quotation), membayar uang muka (Down Payment), atau menandatangani kontrak kerja sama dengan kami, Anda (selanjutnya disebut sebagai "Klien") secara hukum menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh semua ketentuan yang tercantum di bawah ini.
                </p>
            </div>

            <!-- Dynamic Sections Render -->
            {#each dataset as section}
                <section id={section.id} class="space-y-6 scroll-mt-28">
                    <div class="border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
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
                                        <li>{item}</li>
                                    {/each}
                                </ul>
                            {/if}
                            {#if sub.warning}
                                <p class="text-xs text-red-500/80 dark:text-red-400/80 font-medium">
                                    * {sub.warning}
                                </p>
                            {/if}
                        </div>
                    {/each}
                </section>
            {/each}

            <!-- Consent Callout -->
            <div class="p-6 border-t-2 border-blue-500/20 bg-blue-500/[0.02] dark:bg-blue-500/[0.01] rounded-2xl space-y-3">
                <h4 class="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                    Konfirmasi Persetujuan
                </h4>
                <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                    Dengan melanjutkan proses pemesanan layanan, mengisi kuesioner briefing awal, dan melakukan penjadwalan sesi konsultasi di website kami, Klien secara tegas mengakui bahwa mereka memahami dan setuju untuk terikat secara hukum oleh Syarat dan Ketentuan Layanan ini.
                </p>
            </div>
        </main>
    </div>
</div>
