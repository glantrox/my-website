<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { 
        CheckCircle2, 
        Calendar, 
        Mail, 
        Sparkles, 
        ArrowRight, 
        Building2, 
        Info, 
        FolderOpen, 
        User,
        Copy,
        Check,
        ExternalLink,
        BookmarkCheck,
        ShieldCheck
    } from "lucide-svelte";
    import { toast } from "$lib/entities/toast";

    // Read the query parameters sent from order submission
    $: projectId = $page.url.searchParams.get("id") || "";
    $: name = $page.url.searchParams.get("name") || "Klien";
    $: email = $page.url.searchParams.get("email") || "";
    $: projectTitle = $page.url.searchParams.get("title") || "Project Specification";
    $: tier = $page.url.searchParams.get("tier") || "basic";
    $: serviceType = $page.url.searchParams.get("service_type") || "web_service";
    $: consultationDate = $page.url.searchParams.get("date") || "";
    $: consultationTime = $page.url.searchParams.get("time") || "";

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

    /** @param {string | null | undefined} d */
    function formatDateDisplay(d) {
        if (!d) return "Sesuai kesepakatan";
        try {
            return new Date(d).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return d;
        }
    }

    $: accentColorClass = serviceType === "mobile_service" ? "text-emerald-500" : "text-blue-500";
    $: accentBorderClass = serviceType === "mobile_service" ? "border-emerald-500/20 bg-emerald-500/5" : "border-blue-500/20 bg-blue-500/5";

    let copiedId = false;
    let copiedUrl = false;

    // Automatically save project to localStorage for quick tracking on this browser
    onMount(() => {
        if (projectId) {
            try {
                const savedRaw = localStorage.getItem("saved_tracked_projects");
                let list = savedRaw ? JSON.parse(savedRaw) : [];
                if (!Array.isArray(list)) list = [];
                
                // Add or update entry
                list = list.filter((/** @type {any} */ p) => p.id !== projectId);
                list.unshift({
                    id: projectId,
                    title: projectTitle,
                    clientName: name,
                    email: email,
                    serviceType: serviceType,
                    date: new Date().toISOString()
                });

                localStorage.setItem("saved_tracked_projects", JSON.stringify(list.slice(0, 10)));
            } catch (err) {
                console.error("Failed to save project to localStorage:", err);
            }
        }
    });

    async function copyProjectId() {
        if (!projectId) return;
        try {
            await navigator.clipboard.writeText(projectId);
            copiedId = true;
            toast.success("Project ID berhasil disalin ke clipboard!");
            setTimeout(() => (copiedId = false), 2500);
        } catch (e) {
            toast.error("Gagal menyalin Project ID.");
        }
    }

    async function copyTrackingUrl() {
        if (!projectId) return;
        try {
            const url = `${$page.url.origin}/status/${projectId}`;
            await navigator.clipboard.writeText(url);
            copiedUrl = true;
            toast.success("Tautan pelacakan berhasil disalin ke clipboard!");
            setTimeout(() => (copiedUrl = false), 2500);
        } catch (e) {
            toast.error("Gagal menyalin tautan.");
        }
    }
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
        Permintaan Proyek Berhasil Terkirim!
    </h1>
    <p class="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-10">
        Briefing kebutuhan teknis dan jadwal pertemuan Anda telah tersimpan langsung ke database. Kami juga telah mengirimkan konfirmasi ke inbox email Anda.
    </p>

    <!-- Prominent Project Tracking ID & Save Block -->
    {#if projectId}
        <div class="bg-gradient-to-b from-zinc-50 to-zinc-100/50 dark:from-zinc-900/60 dark:to-zinc-900/20 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto text-left mb-8 shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/70 dark:border-zinc-800/80 pb-5">
                <div>
                    <span class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Project Tracking ID</span>
                    <div class="font-mono text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-wider mt-1 select-all">
                        {projectId}
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        onclick={copyProjectId}
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-2xs"
                    >
                        {#if copiedId}
                            <Check size={14} class="text-emerald-500" />
                            <span>Tersalin</span>
                        {:else}
                            <Copy size={14} class="text-zinc-400" />
                            <span>Salin ID</span>
                        {/if}
                    </button>

                    <button
                        type="button"
                        onclick={copyTrackingUrl}
                        class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all cursor-pointer shadow-2xs"
                    >
                        {#if copiedUrl}
                            <Check size={14} class="text-emerald-500" />
                            <span>Tersalin</span>
                        {:else}
                            <ExternalLink size={14} class="text-zinc-400" />
                            <span>Salin Link</span>
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Primary Action for Tracking -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <div class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex items-start gap-2">
                    <BookmarkCheck size={16} class="text-emerald-500 shrink-0 mt-0.5" />
                    <span>ID ini telah otomatis disimpan di browser Anda untuk akses cepat melalui portal <strong>Track Project</strong>.</span>
                </div>

                <a
                    href="/status/{projectId}"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm shrink-0"
                >
                    <span>Lacak Proyek Sekarang</span>
                    <ArrowRight size={14} />
                </a>
            </div>
        </div>
    {/if}

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
                    <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Email Kontak</span>
                    <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Mail size={14} class="text-zinc-400" />
                        {email}
                    </span>
                </div>
            {/if}

            <div class="space-y-1">
                <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Jenis Layanan & Tier</span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Sparkles size={14} class={accentColorClass} />
                    {formattedService} ({formattedTier})
                </span>
            </div>

            <div class="space-y-1">
                <span class="text-xs text-zinc-400 dark:text-zinc-500 block">Jadwal Pertemuan</span>
                <span class="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Calendar size={14} class="text-blue-500" />
                    {formatDateDisplay(consultationDate)} {consultationTime ? `(${consultationTime})` : ''}
                </span>
            </div>
        </div>
        <div class="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start gap-3 mt-4">
            <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Jadwal konsultasi Anda telah dicatat di sistem kami. Link Google Meet dan update progress akan terus diperbarui melalui portal status serta dikirimkan ke email Anda sebelum sesi dimulai.
            </p>
        </div>
    </div>
</div>
