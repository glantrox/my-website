<script>
    import { onMount } from "svelte";
    import { superForm } from "sveltekit-superforms";
    import { 
        ArrowLeft, 
        ArrowRight, 
        Calendar, 
        Building2, 
        Globe, 
        Wrench, 
        CheckSquare, 
        Info, 
        Lock, 
        Sparkles, 
        Clock, 
        User, 
        Mail,
        ChevronRight
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";

    /** @type {import('./$types').PageData} */
    export let data;

    // Initialize superForm
    const { form, errors, enhance, message } = superForm(data.form, {
        dataType: "json",
        validators: false // handled via custom client validation + server side Zod schema validation
    });

    // Dynamic Feature Checkboxes presets
    const featurePresets = /** @type {any} */({
        web_service: {
            basic: [
                "Landing Page (1-3 Halaman)",
                "Company Profile Statis",
                "Integrasi Blog / CMS (Sederhana)",
                "Desain Responsif (Mobile Friendly)",
                "SEO Setup Dasar & Google Analytics"
            ],
            intermediate: [
                "E-commerce / Toko Online Lokal",
                "Portal Berita / Blog Kompleks",
                "Dashboard Admin Kustom (Multi-role)",
                "Integrasi Database SQL/NoSQL",
                "Sistem Autentikasi User (Auth)"
            ],
            industrial: [
                "B2B SaaS Dashboard",
                "Platform FinTech / Pembayaran Kompleks",
                "Integrasi Multi-API Lanjutan",
                "Dashboard Real-time Telemetri & IoT",
                "Infrastruktur Cloud Autoscaling (AWS/GCP)"
            ]
        },
        mobile_service: {
            basic: [
                "Aplikasi MVP (Minimum Viable Product)",
                "Fungsionalitas Sederhana & UI Standar",
                "Integrasi Database Basic (Firebase/Supabase)",
                "Offline Caching Sederhana",
                "Notifikasi Push Dasar"
            ],
            intermediate: [
                "Aplikasi Bisnis Kustom",
                "Integrasi Payment Gateway (Midtrans/Xendit)",
                "Fitur Geolokasi & Peta (Maps)",
                "Real-time Push Notifications",
                "Arsitektur Dedicated Backend Server"
            ],
            industrial: [
                "Aplikasi IoT & Hardware Tracking",
                "Keamanan Data Berlapis (JWT / OAuth)",
                "High-performance App Engine (Fluid Animations)",
                "Skalabilitas Infrastruktur Cloud",
                "Sistem Offline-First & Sync Queue"
            ]
        }
    });

    // Client-side step navigation: 1 = Details Form, 2 = Calendar Sync
    let step = 1;

    /** @type {any} */
    let clientErrors = {};

    // Local state for infrastructure ack checkbox to bypass strict store type bindings
    let localInfraAck = false;
    let localTermsAck = false;
    onMount(() => {
        localInfraAck = $form.infrastructureAck || false;
        localTermsAck = $form.termsAck || false;
    });

    // Sync local ack with store value
    $: {
        $form.infrastructureAck = localInfraAck;
        $form.termsAck = localTermsAck;
    }

    /**
     * @param {string} name
     * @param {string} value
     * @param {number} days
     */
    function setCookie(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + expires + '; SameSite=Lax';
    }

    // Auto-save form inputs to cookies
    $: {
        if (typeof document !== 'undefined') {
            setCookie('contactName', $form.contactName || '');
            setCookie('contactEmail', $form.contactEmail || '');
            setCookie('companyName', $form.companyName || '');
            setCookie('industry', $form.industry || '');
            setCookie('websiteUrl', $form.websiteUrl || '');
            setCookie('projectTitle', $form.projectTitle || '');
            setCookie('serviceType', $form.serviceType || 'web_service');
            setCookie('projectTier', $form.projectTier || 'basic');
            setCookie('coreObjective', $form.coreObjective || '');
            setCookie('keyFeatures', JSON.stringify($form.keyFeatures || []));
        }
    }

    // Dynamically retrieve features based on current form selection
    $: currentFeatures = featurePresets[$form.serviceType]?.[$form.projectTier] || [];

    function handleResetFeatures() {
        $form.keyFeatures = [];
    }

    function validateStep1() {
        clientErrors = {};
        if (!$form.contactName || $form.contactName.trim().length < 2) {
            clientErrors.contactName = "Nama kontak minimal 2 karakter";
        }
        if (!$form.contactEmail || !/^\S+@\S+\.\S+$/.test($form.contactEmail)) {
            clientErrors.contactEmail = "Format email tidak valid";
        }
        if (!$form.companyName || $form.companyName.trim().length < 2) {
            clientErrors.companyName = "Nama perusahaan minimal 2 karakter";
        }
        if (!$form.industry || $form.industry.trim().length < 2) {
            clientErrors.industry = "Bidang industri wajib diisi";
        }
        if (!$form.projectTitle || $form.projectTitle.trim().length < 3) {
            clientErrors.projectTitle = "Judul proyek minimal 3 karakter";
        }
        if (!$form.coreObjective || $form.coreObjective.trim().length < 20) {
            clientErrors.coreObjective = "Tujuan utama minimal 20 karakter";
        }
        if ($form.keyFeatures.length === 0) {
            clientErrors.keyFeatures = "Pilih minimal 1 fitur yang dibutuhkan";
        }
        if (!$form.infrastructureAck) {
            clientErrors.infrastructureAck = "Anda wajib menyetujui tanggung jawab biaya infrastruktur";
        }
        if (!$form.termsAck) {
            clientErrors.termsAck = "Anda wajib menyetujui Syarat dan Ketentuan Layanan";
        }

        // Trigger Svelte reactivity for object mutations
        clientErrors = clientErrors;

        if (Object.keys(clientErrors).length === 0) {
            step = 2;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Scroll to the first error
            const firstError = Object.keys(clientErrors)[0];
            const el = document.getElementById(firstError);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    function goBack() {
        step = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Dynamic briefing notes to pre-populate Cal.com meeting description
    $: briefingText = `Briefing Awal:\n- Perusahaan: ${$form.companyName} (${$form.industry})\n- Proyek: ${$form.projectTitle} (Tier: ${$form.projectTier})\n- Tujuan: ${$form.coreObjective}\n- Fitur Utama: ${$form.keyFeatures.join(", ")}`;

    $: calIframeUrl = `https://cal.com/hamasazeezan/15min?name=${encodeURIComponent($form.contactName)}&email=${encodeURIComponent($form.contactEmail)}&notes=${encodeURIComponent(briefingText)}`;
</script>

<svelte:head>
    <title>Jadwalkan Konsultasi Proyek | Hamas Azizan</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12 md:py-20">
    <!-- Progress Indicator Header -->
    <div class="w-full mb-12">
        <div class="grid grid-cols-3 gap-6 text-left">
            <!-- Step 1: Selection -->
            <div class="space-y-2 opacity-60">
                <div class="h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Selection</span>
                </div>
            </div>

            <!-- Step 2: Requirements -->
            <div class="space-y-2 {step === 1 ? '' : 'opacity-60'}">
                <div class="h-0.5 rounded-full transition-all duration-300 {step === 1 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'}"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Requirements</span>
                </div>
            </div>

            <!-- Step 3: Schedule -->
            <div class="space-y-2 {step === 2 ? '' : 'opacity-40'}">
                <div class="h-0.5 rounded-full transition-all duration-300 {step === 2 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'}"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Schedule</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Container -->
    <div class="space-y-8">
        <div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-2">
                Jadwalkan Konsultasi Proyek
            </h1>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
                Isi detail kebutuhan bisnis Anda agar pertemuan awal kita berjalan efisien dan berfokus langsung pada solusi teknis.
            </p>
        </div>

        {#if $message}
            <div class="p-4 mb-6 text-sm rounded-md {$message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-destructive/10 text-destructive'}">
                {$message}
            </div>
        {/if}

        <form method="POST" use:enhance class="space-y-8">
            {#if step === 1}
                <!-- SECTION 1: Intake Form Details -->
                <div class="space-y-8">
                    <!-- Section A: Corporate Context -->
                    <Card.Root class="border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
                        <Card.Header>
                            <Card.Title class="flex items-center gap-2 text-lg text-zinc-800 dark:text-zinc-200">
                                <Building2 class="w-5 h-5 text-blue-500" />
                                Hubungan Kontak & Informasi Klien
                            </Card.Title>
                            <Card.Description>Berikan detail kontak dan nama entitas bisnis Anda.</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div class="space-y-2" id="contactName">
                                    <Label for="contactNameInput">Nama Kontak Person</Label>
                                    <div class="relative">
                                        <Input 
                                            type="text" 
                                            id="contactNameInput" 
                                            name="contactName" 
                                            bind:value={$form.contactName} 
                                            placeholder="e.g. Hamas Azizan" 
                                        />
                                        <span class="absolute right-3 top-3 text-zinc-400"><User size={16} /></span>
                                    </div>
                                    {#if clientErrors.contactName || $errors.contactName}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.contactName || $errors.contactName}</p>
                                    {/if}
                                </div>

                                <div class="space-y-2" id="contactEmail">
                                    <Label for="contactEmailInput">Email Kontak</Label>
                                    <div class="relative">
                                        <Input 
                                            type="email" 
                                            id="contactEmailInput" 
                                            name="contactEmail" 
                                            bind:value={$form.contactEmail} 
                                            placeholder="e.g. client@company.com" 
                                        />
                                        <span class="absolute right-3 top-3 text-zinc-400"><Mail size={16} /></span>
                                    </div>
                                    {#if clientErrors.contactEmail || $errors.contactEmail}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.contactEmail || $errors.contactEmail}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div class="space-y-2" id="companyName">
                                    <Label for="companyNameInput">Nama Perusahaan / Organisasi</Label>
                                    <Input 
                                        type="text" 
                                        id="companyNameInput" 
                                        name="companyName" 
                                        bind:value={$form.companyName} 
                                        placeholder="e.g. TernakAja Group" 
                                    />
                                    {#if clientErrors.companyName || $errors.companyName}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.companyName || $errors.companyName}</p>
                                    {/if}
                                </div>

                                <div class="space-y-2" id="industry">
                                    <Label for="industryInput">Bidang Industri / Sektor</Label>
                                    <Input 
                                        type="text" 
                                        id="industryInput" 
                                        name="industry" 
                                        bind:value={$form.industry} 
                                        placeholder="e.g. AgTech, FinTech, E-commerce" 
                                    />
                                    {#if clientErrors.industry || $errors.industry}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.industry || $errors.industry}</p>
                                    {/if}
                                </div>
                            </div>

                            <div class="space-y-2" id="websiteUrl">
                                <Label for="websiteUrlInput">URL Platform / Website Saat Ini (Jika ada)</Label>
                                <div class="relative">
                                    <Input 
                                        type="text" 
                                        id="websiteUrlInput" 
                                        name="websiteUrl" 
                                        bind:value={$form.websiteUrl} 
                                        placeholder="https://company.com" 
                                    />
                                    <span class="absolute right-3 top-3 text-zinc-400"><Globe size={16} /></span>
                                </div>
                                {#if clientErrors.websiteUrl || $errors.websiteUrl}
                                    <p class="text-xs text-destructive mt-1">{clientErrors.websiteUrl || $errors.websiteUrl}</p>
                                {/if}
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Section B: Project Specifications -->
                    <Card.Root class="border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
                        <Card.Header>
                            <Card.Title class="flex items-center gap-2 text-lg text-zinc-800 dark:text-zinc-200">
                                <Wrench class="w-5 h-5 text-blue-500" />
                                Spesifikasi Kebutuhan Proyek
                            </Card.Title>
                            <Card.Description>Tentukan tier layanan, fitur utama, dan target pengembangan.</Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div class="space-y-2">
                                    <Label for="serviceTypeSelect">Tipe Layanan</Label>
                                    <select 
                                        id="serviceTypeSelect"
                                        name="serviceType" 
                                        bind:value={$form.serviceType} 
                                        on:change={handleResetFeatures}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                    >
                                        <option value="web_service">Website & Web Applications</option>
                                        <option value="mobile_service">Mobile App Development</option>
                                    </select>
                                </div>

                                <div class="space-y-2">
                                    <Label for="projectTierSelect">Paket Tier</Label>
                                    <select 
                                        id="projectTierSelect"
                                        name="projectTier" 
                                        bind:value={$form.projectTier} 
                                        on:change={handleResetFeatures}
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                    >
                                        <option value="basic">Basic MVP Package</option>
                                        <option value="intermediate">Intermediate Custom Package</option>
                                        <option value="industrial">Industrial / Enterprise Package</option>
                                    </select>
                                </div>
                            </div>

                            <div class="space-y-2" id="projectTitle">
                                <Label for="projectTitleInput">Judul Sementara Proyek</Label>
                                <Input 
                                    type="text" 
                                    id="projectTitleInput" 
                                    name="projectTitle" 
                                    bind:value={$form.projectTitle} 
                                    placeholder="e.g. Redesign Web TernakAja / Mobile App AttendMe" 
                                />
                                {#if clientErrors.projectTitle || $errors.projectTitle}
                                    <p class="text-xs text-destructive mt-1">{clientErrors.projectTitle || $errors.projectTitle}</p>
                                {/if}
                            </div>

                            <div class="space-y-2" id="coreObjective">
                                <Label for="coreObjectiveInput">Deskripsi Tujuan Utama Proyek</Label>
                                <textarea 
                                    id="coreObjectiveInput" 
                                    name="coreObjective" 
                                    bind:value={$form.coreObjective} 
                                    placeholder="Masalah apa yang ingin Anda selesaikan lewat aplikasi/website ini bagi bisnis atau target user Anda?" 
                                    class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                ></textarea>
                                {#if clientErrors.coreObjective || $errors.coreObjective}
                                    <p class="text-xs text-destructive mt-1">{clientErrors.coreObjective || $errors.coreObjective}</p>
                                {/if}
                            </div>

                            <!-- Dynamic Scope Checkboxes -->
                            <div class="space-y-3" id="keyFeatures">
                                <Label class="block mb-1">Pilih Fitur yang Dibutuhkan (Sesuai Paket Tier):</Label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {#each currentFeatures as feature}
                                        <label class="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all select-none">
                                            <input 
                                                type="checkbox" 
                                                name="keyFeatures" 
                                                value={feature} 
                                                bind:group={$form.keyFeatures} 
                                                class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                            />
                                            <span class="text-xs text-zinc-600 dark:text-zinc-300 leading-normal">{feature}</span>
                                        </label>
                                    {/each}
                                </div>
                                {#if clientErrors.keyFeatures || $errors.keyFeatures}
                                    <p class="text-xs text-destructive mt-1">{clientErrors.keyFeatures || $errors.keyFeatures}</p>
                                {/if}
                            </div>

                            <div class="space-y-5">
                                <div class="space-y-2">
                                    <Label for="targetTimelineSelect">Target Timeline Pengerjaan</Label>
                                    <select 
                                        id="targetTimelineSelect"
                                        name="targetTimeline" 
                                        bind:value={$form.targetTimeline} 
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                    >
                                        <option value="under_1_month">Di bawah 1 Bulan (Sangat Cepat)</option>
                                        <option value="1_to_3_months">1 - 3 Bulan (Rekomendasi MVP)</option>
                                        <option value="3_to_6_months">3 - 6 Bulan (Menengah/Kompleks)</option>
                                        <option value="flexible">Fleksibel / Sesuai Kesepakatan</option>
                                    </select>
                                </div>

                                <!-- Infrastructure Ack Checkbox (Full Width, bottom of the card) -->
                                <div class="pt-2" id="infrastructureAck">
                                    <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all select-none w-full">
                                        <input 
                                            type="checkbox" 
                                            name="infrastructureAck" 
                                            bind:checked={localInfraAck} 
                                            class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                        />
                                        <div class="space-y-0.5">
                                            <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Acknowledge Server & Domain Costs</span>
                                            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Saya memahami bahwa biaya domain dan VPS/Cloud hosting berkelanjutan adalah tanggung jawab klien langsung.</p>
                                        </div>
                                    </label>
                                    {#if clientErrors.infrastructureAck || $errors.infrastructureAck}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.infrastructureAck || $errors.infrastructureAck}</p>
                                    {/if}
                                </div>

                                <!-- Terms of Service Checkbox (Full Width, bottom of the card) -->
                                <div class="" id="termsAck">
                                    <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all select-none w-full">
                                        <input 
                                            type="checkbox" 
                                            name="termsAck" 
                                            bind:checked={localTermsAck} 
                                            class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                        />
                                        <div class="space-y-0.5">
                                            <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Setuju dengan <a href="/terms-of-service" target="_blank" class="text-blue-500 hover:underline">Ketentuan Layanan</a> & <a href="/privacy-policy" target="_blank" class="text-blue-500 hover:underline">Kebijakan Privasi</a></span>
                                            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Saya menyetujui pengumpulan data kebutuhan proyek ini untuk keperluan analisis sebelum sesi konsultasi.</p>
                                        </div>
                                    </label>
                                    {#if clientErrors.termsAck || $errors.termsAck}
                                        <p class="text-xs text-destructive mt-1">{clientErrors.termsAck || $errors.termsAck}</p>
                                    {/if}
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Submit Details to go to Step 2 Calendar -->
                    <div class="flex justify-end pt-4">
                        <Button type="button" class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 group py-5 px-6 rounded-xl text-sm font-medium" on:click={validateStep1}>
                            Lanjut Pilih Jadwal
                            <ArrowRight size={16} class="group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            {:else if step === 2}
                <!-- SECTION 2: Calendar & Submit Form -->
                <div class="space-y-8">
                    <Card.Root class="border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
                        <Card.Header>
                            <Card.Title class="flex items-center gap-2 text-lg text-zinc-800 dark:text-zinc-200">
                                <Calendar class="w-5 h-5 text-blue-500" />
                                Sinkronisasi Jadwal Pertemuan
                            </Card.Title>
                            <Card.Description>
                                Pilih waktu konsultasi 1-on-1 gratis selama 15 menit menggunakan widget Cal.com di bawah.
                            </Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-6">
                            <!-- Notice -->
                            <div class="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start gap-3">
                                <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div class="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                                    <p class="font-semibold text-zinc-700 dark:text-zinc-300">Bagaimana cara booking?</p>
                                    <p>1. Pilih slot waktu Anda langsung di dalam widget kalender di bawah.</p>
                                    <p>2. Data nama, email, dan deskripsi kebutuhan Anda akan langsung tersinkronisasi otomatis.</p>
                                    <p>3. Setelah memilih slot, klik tombol <strong>"Kirim Briefing & Simpan Jadwal"</strong> di bawah untuk menyimpan pengajuan Anda di database kami.</p>
                                </div>
                            </div>

                            <!-- Embedded Cal.com scheduler -->
                            <div class="w-full h-[600px] border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                                <iframe 
                                    src={calIframeUrl} 
                                    title="Konsultasi Pertemuan Hamas Azizan" 
                                    class="w-full h-full border-0"
                                ></iframe>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Navigation Action Buttons -->
                    <div class="flex justify-between items-center pt-4">
                        <Button type="button" variant="outline" class="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center gap-1 py-5 px-6 rounded-xl text-sm font-medium" on:click={goBack}>
                            <ArrowLeft size={16} />
                            Kembali Edit Briefing
                        </Button>

                        <Button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 group py-5 px-6 rounded-xl text-sm font-medium">
                            Kirim Briefing & Simpan Jadwal
                            <ChevronRight size={16} class="group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            {/if}
        </form>
    </div>
</div>
