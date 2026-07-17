<script>
    import { page } from "$app/stores";
    import { 
        CheckCircle2, 
        Calendar, 
        Mail, 
        Sparkles, 
        ArrowRight,
        Building2,
        Info,
        FolderOpen,
        User
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    // Read the query parameters sent from order submission
    $: name = $page.url.searchParams.get("name") || "Klien";
    $: email = $page.url.searchParams.get("email") || "";
    $: tier = $page.url.searchParams.get("tier") || "basic";
    $: serviceType = $page.url.searchParams.get("service_type") || "web_service";

    // Format human-readable names
    $: formattedTier = {
        basic: "Basic MVP Package",
        intermediate: "Intermediate Custom Package",
        industrial: "Industrial / Enterprise Package"
    }[tier] || "Custom Package";

    $: formattedService = {
        web_service: "Website & Web Applications",
        mobile_service: "Mobile App Development"
    }[serviceType] || "Web Engineering";

    $: accentColorClass = serviceType === "mobile_service" ? "text-emerald-500" : "text-blue-500";
    $: accentBorderClass = serviceType === "mobile_service" ? "border-emerald-500/20 bg-emerald-500/5" : "border-blue-500/20 bg-blue-500/5";
</script>

<svelte:head>
    <title>Jadwal Konsultasi Berhasil Terkirim | Hamas Azizan</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
    <!-- Success Badge -->
    <div class="inline-flex items-center justify-center p-3 rounded-full border mb-8 {accentBorderClass} animate-bounce">
        <CheckCircle2 size={40} class={accentColorClass} />
    </div>

    <!-- Title and Subtitle -->
    <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
        Konsultasi Berhasil Terjadwalkan!
    </h1>
    <p class="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-12">
        Briefing kebutuhan teknis Anda telah disimpan. Detail undangan kalender dan briefing lengkap telah dikirimkan ke email Anda.
    </p>

    <!-- Briefing Summary Card -->
    <div class="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 p-8 rounded-2xl max-w-2xl mx-auto text-left mb-12 space-y-6">
        <h3 class="text-lg font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <FolderOpen class="w-5 h-5 text-blue-500" />
            Ringkasan Briefing Konsultasi
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div class="space-y-1">
                <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Nama Kontak Person</span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <User size={14} class="text-zinc-400" />
                    {name}
                </span>
            </div>

            {#if email}
                <div class="space-y-1">
                    <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Email Sinkronisasi</span>
                    <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Mail size={14} class="text-zinc-400" />
                        {email}
                    </span>
                </div>
            {/if}

            <div class="space-y-1">
                <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Jenis Layanan</span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300">
                    {formattedService}
                </span>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Paket Tier Layanan</span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Sparkles size={14} class={accentColorClass} />
                    {formattedTier}
                </span>
            </div>
        </div>

        <div class="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start gap-3 mt-4">
            <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Pastikan Anda memeriksa folder masuk atau folder spam email Anda untuk menerima undangan link zoom/meet (Cal.com Invite) dan detail agenda pengerjaan. Harap persiapkan wireframe atau dokumentasi sistem saat sesi konsultasi berlangsung.
            </p>
        </div>
    </div>

    <!-- Navigation Action Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a 
            href="/" 
            class="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium py-3 px-6 rounded-xl transition-all shadow-sm group hover:scale-[1.02] active:scale-[0.98]"
        >
            Kembali ke Beranda
        </a>
        <a 
            href="/projects" 
            class="w-full sm:w-auto inline-flex items-center justify-center border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 font-medium py-3 px-6 rounded-xl transition-all"
        >
            Lihat Portofolio Proyek
        </a>
    </div>
</div>
