<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { 
        ArrowLeft, 
        ArrowRight, 
        Calendar, 
        Building2, 
        Globe, 
        Wrench, 
        Info, 
        User, 
        Mail,
        ChevronRight
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import { initConsultationState } from "$lib/entities/consultation/context";
    import { toast } from "$lib/entities/toast";
    import Spinner from "$lib/components/ui/spinner.svelte";

    let { data } = $props();

    let isSubmitting = $state(false);
    let activeToastId = $state("");

    // Initialize superForm
    const { form, errors, enhance, message } = superForm(data.form, {
        dataType: "json",
        validators: false, // handled via custom client validation + server side Zod schema validation
        onSubmit: () => {
            isSubmitting = true;
            activeToastId = toast.loading("Mengirimkan briefing dan menyimpan jadwal...");
        },
        onResult: ({ result }) => {
            isSubmitting = false;
            if (result.type === "redirect") {
                toast.update(activeToastId, {
                    type: "success",
                    message: "Briefing dan jadwal berhasil disimpan! Mengalihkan...",
                    duration: 2000
                });
            } else if (result.type === "failure" || result.type === "error") {
                toast.update(activeToastId, {
                    type: "error",
                    message: "Gagal menyimpan pengajuan. Silakan coba lagi.",
                    duration: 4000
                });
            }
        }
    });

    // Initialize domain state class with superform store
    const consultationState = initConsultationState(form);

    function goBack() {
        consultationState.step = 1;
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
</script>

<svelte:head>
    <title>Jadwalkan Konsultasi Proyek | Hamas Azizan</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12 md:py-20">
    <!-- Progress Indicator Header -->
    <div class="w-full mb-12">
        <div class="grid grid-cols-3 gap-6 text-left">
            <!-- Step 1: Selection (Completed) -->
            <div class="space-y-2 opacity-60">
                <div class="h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Selection</span>
                </div>
            </div>

            <!-- Step 2: Requirements (Active on Step 1, Completed on Step 2) -->
            <div class="space-y-2 transition-opacity duration-300 {consultationState.step === 1 ? 'opacity-100' : 'opacity-60'}">
                <div class="h-0.5 rounded-full transition-all duration-300 bg-zinc-900 dark:bg-zinc-100"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium uppercase tracking-wider {consultationState.step === 1 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-500 dark:text-zinc-400'}">Requirements</span>
                </div>
            </div>

            <!-- Step 3: Schedule (Active on Step 2, Pending on Step 1) -->
            <div class="space-y-2 transition-opacity duration-300 {consultationState.step >= 2 ? 'opacity-100' : 'opacity-40'}">
                <div class="h-0.5 rounded-full transition-all duration-300 {consultationState.step >= 2 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'}"></div>
                <div class="text-[10px] md:text-xs">
                    <span class="font-medium uppercase tracking-wider {consultationState.step >= 2 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-500 dark:text-zinc-400'}">Schedule</span>
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
            {#if consultationState.step === 1}
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
                                            bind:value={consultationState.contactName} 
                                            placeholder="e.g. Hamas Azizan" 
                                        />
                                        <span class="absolute right-3 top-3 text-zinc-400"><User size={16} /></span>
                                    </div>
                                    {#if consultationState.errors.contactName || $errors.contactName}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.contactName || $errors.contactName}</p>
                                    {/if}
                                </div>

                                <div class="space-y-2" id="contactEmail">
                                    <Label for="contactEmailInput">Email Kontak</Label>
                                    <div class="relative">
                                        <Input 
                                            type="email" 
                                            id="contactEmailInput" 
                                            name="contactEmail" 
                                            bind:value={consultationState.contactEmail} 
                                            placeholder="e.g. client@company.com" 
                                        />
                                        <span class="absolute right-3 top-3 text-zinc-400"><Mail size={16} /></span>
                                    </div>
                                    {#if consultationState.errors.contactEmail || $errors.contactEmail}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.contactEmail || $errors.contactEmail}</p>
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
                                        bind:value={consultationState.companyName} 
                                        placeholder="e.g. Jaya Group" 
                                    />
                                    {#if consultationState.errors.companyName || $errors.companyName}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.companyName || $errors.companyName}</p>
                                    {/if}
                                </div>

                                <div class="space-y-2" id="industry">
                                    <Label for="industryInput">Bidang Industri / Sektor</Label>
                                    <Input 
                                        type="text" 
                                        id="industryInput" 
                                        name="industry" 
                                        bind:value={consultationState.industry} 
                                        placeholder="e.g. AgTech, FinTech, E-commerce" 
                                    />
                                    {#if consultationState.errors.industry || $errors.industry}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.industry || $errors.industry}</p>
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
                                        bind:value={consultationState.websiteUrl} 
                                        placeholder="https://company.com" 
                                    />
                                    <span class="absolute right-3 top-3 text-zinc-400"><Globe size={16} /></span>
                                </div>
                                {#if consultationState.errors.websiteUrl || $errors.websiteUrl}
                                    <p class="text-xs text-destructive mt-1">{consultationState.errors.websiteUrl || $errors.websiteUrl}</p>
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
                                        bind:value={consultationState.serviceType} 
                                        onchange={() => consultationState.resetFeatures()}
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
                                        bind:value={consultationState.projectTier} 
                                        onchange={() => consultationState.resetFeatures()}
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
                                    bind:value={consultationState.projectTitle} 
                                    placeholder="e.g. Redesign Web Venue / Mobile App AttendMe" 
                                />
                                {#if consultationState.errors.projectTitle || $errors.projectTitle}
                                    <p class="text-xs text-destructive mt-1">{consultationState.errors.projectTitle || $errors.projectTitle}</p>
                                {/if}
                            </div>

                            <div class="space-y-2" id="coreObjective">
                                <Label for="coreObjectiveInput">Deskripsi Tujuan Utama Proyek</Label>
                                <textarea 
                                    id="coreObjectiveInput" 
                                    name="coreObjective" 
                                    bind:value={consultationState.coreObjective} 
                                    placeholder="Masalah apa yang ingin Anda selesaikan lewat aplikasi/website ini bagi bisnis atau target user Anda?" 
                                    class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                ></textarea>
                                {#if consultationState.errors.coreObjective || $errors.coreObjective}
                                    <p class="text-xs text-destructive mt-1">{consultationState.errors.coreObjective || $errors.coreObjective}</p>
                                {/if}
                            </div>

                            <!-- Dynamic Scope Checkboxes -->
                            <div class="space-y-3" id="keyFeatures">
                                <Label class="block mb-1">Pilih Fitur yang Dibutuhkan (Sesuai Paket Tier):</Label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {#each consultationState.currentFeaturesPreset as feature}
                                        <label class="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-all select-none">
                                            <input 
                                                type="checkbox" 
                                                name="keyFeatures" 
                                                value={feature} 
                                                bind:group={consultationState.keyFeatures} 
                                                class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                            />
                                            <span class="text-xs text-zinc-600 dark:text-zinc-300 leading-normal">{feature}</span>
                                        </label>
                                    {/each}
                                </div>
                                {#if consultationState.errors.keyFeatures || $errors.keyFeatures}
                                    <p class="text-xs text-destructive mt-1">{consultationState.errors.keyFeatures || $errors.keyFeatures}</p>
                                {/if}
                            </div>

                            <div class="space-y-5">
                                <div class="space-y-2">
                                    <Label for="targetTimelineSelect">Target Timeline Pengerjaan</Label>
                                    <select 
                                        id="targetTimelineSelect"
                                        name="targetTimeline" 
                                        bind:value={consultationState.targetTimeline} 
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                    >
                                        <option value="under_1_month">Di bawah 1 Bulan (Sangat Cepat)</option>
                                        <option value="1_to_3_months">1 - 3 Bulan (Rekomendasi MVP)</option>
                                        <option value="3_to_6_months">3 - 6 Bulan (Menengah/Kompleks)</option>
                                        <option value="flexible">Fleksibel / Sesuai Kesepakatan</option>
                                    </select>
                                </div>

                                <!-- Infrastructure Ack Checkbox -->
                                <div class="pt-2" id="infrastructureAck">
                                    <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all select-none w-full">
                                        <input 
                                            type="checkbox" 
                                            name="infrastructureAck" 
                                            bind:checked={consultationState.infrastructureAck} 
                                            class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                        />
                                        <div class="space-y-0.5">
                                            <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Acknowledge Server & Domain Costs</span>
                                            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Saya memahami bahwa biaya domain dan VPS/Cloud hosting berkelanjutan adalah tanggung jawab klien langsung.</p>
                                        </div>
                                    </label>
                                    {#if consultationState.errors.infrastructureAck || $errors.infrastructureAck}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.infrastructureAck || $errors.infrastructureAck}</p>
                                    {/if}
                                </div>

                                <!-- Terms of Service Checkbox -->
                                <div class="" id="termsAck">
                                    <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all select-none w-full">
                                        <input 
                                            type="checkbox" 
                                            name="termsAck" 
                                            bind:checked={consultationState.termsAck} 
                                            class="mt-1 rounded text-blue-500 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 bg-transparent" 
                                        />
                                        <div class="space-y-0.5">
                                            <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Setuju dengan <a href="/terms-of-service" target="_blank" class="text-blue-500 hover:underline">Ketentuan Layanan</a> & <a href="/privacy-policy" target="_blank" class="text-blue-500 hover:underline">Kebijakan Privasi</a></span>
                                            <p class="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Saya menyetujui pengumpulan data kebutuhan proyek ini untuk keperluan analisis sebelum sesi konsultasi.</p>
                                        </div>
                                    </label>
                                    {#if consultationState.errors.termsAck || $errors.termsAck}
                                        <p class="text-xs text-destructive mt-1">{consultationState.errors.termsAck || $errors.termsAck}</p>
                                    {/if}
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Submit Details to go to Step 2 Calendar -->
                    <div class="flex justify-end pt-4">
                        <Button type="button" class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 group py-5 px-6 rounded-xl text-sm font-medium" onclick={() => consultationState.validateStep1()}>
                            Lanjut Pilih Jadwal
                            <ArrowRight size={16} class="group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            {:else if consultationState.step === 2}
                <!-- SECTION 2: Meeting Schedule & Direct Submission -->
                <div class="space-y-8">
                    <!-- Project Briefing Summary Card -->
                    <Card.Root class="border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
                        <Card.Header class="pb-3">
                            <Card.Title class="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <Building2 class="w-4 h-4 text-blue-500" />
                                Ringkasan Briefing Proyek
                            </Card.Title>
                        </Card.Header>
                        <Card.Content class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div class="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40">
                                <span class="text-zinc-400 dark:text-zinc-500 block mb-1">Klien & Perusahaan</span>
                                <span class="font-medium text-zinc-800 dark:text-zinc-200">{consultationState.contactName || '—'} ({consultationState.companyName || '—'})</span>
                            </div>
                            <div class="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40">
                                <span class="text-zinc-400 dark:text-zinc-500 block mb-1">Layanan & Tier</span>
                                <span class="font-medium text-zinc-800 dark:text-zinc-200 capitalize">{consultationState.serviceType.replace('_', ' ')} • {consultationState.projectTier}</span>
                            </div>
                            <div class="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40">
                                <span class="text-zinc-400 dark:text-zinc-500 block mb-1">Judul Proyek</span>
                                <span class="font-medium text-zinc-800 dark:text-zinc-200 truncate block">{consultationState.projectTitle || '—'}</span>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Schedule Picker Card -->
                    <Card.Root class="border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10">
                        <Card.Header>
                            <Card.Title class="flex items-center gap-2 text-lg text-zinc-800 dark:text-zinc-200">
                                <Calendar class="w-5 h-5 text-blue-500" />
                                Pilih Jadwal Pertemuan Konsultasi
                            </Card.Title>
                            <Card.Description>
                                Tentukan tanggal dan waktu yang nyaman bagi Anda untuk sesi diskusi teknis 1-on-1 (via Google Meet).
                            </Card.Description>
                        </Card.Header>
                        <Card.Content class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Date Input -->
                                <div class="space-y-2">
                                    <Label for="consultationDateInput">Tanggal Pertemuan yang Diinginkan <span class="text-red-500">*</span></Label>
                                    <Input 
                                        type="date" 
                                        id="consultationDateInput" 
                                        name="consultationDate" 
                                        bind:value={consultationState.consultationDate} 
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        class="cursor-pointer"
                                    />
                                    {#if $errors.consultationDate}
                                        <p class="text-xs text-destructive mt-1">{$errors.consultationDate}</p>
                                    {/if}
                                </div>

                                <!-- Time Slot Selection -->
                                <div class="space-y-2">
                                    <Label for="consultationTimeSelect">Pilihan Jam / Slot Waktu (WIB)</Label>
                                    <select 
                                        id="consultationTimeSelect"
                                        name="consultationTime" 
                                        bind:value={consultationState.consultationTime} 
                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 cursor-pointer"
                                    >
                                        <option value="09:00 - 10:00 WIB">Pagi (09:00 - 10:00 WIB)</option>
                                        <option value="10:00 - 11:00 WIB">Pagi (10:00 - 11:00 WIB)</option>
                                        <option value="13:30 - 14:30 WIB">Siang (13:30 - 14:30 WIB)</option>
                                        <option value="15:30 - 16:30 WIB">Sore (15:30 - 16:30 WIB)</option>
                                        <option value="19:30 - 20:30 WIB">Malam (19:30 - 20:30 WIB)</option>
                                        <option value="flexible">Fleksibel / Sesuai Kesepakatan</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Meeting Notes -->
                            <div class="space-y-2">
                                <Label for="meetingNotesInput">Catatan / Topik Khusus yang Ingin Dibahas (Opsional)</Label>
                                <textarea 
                                    id="meetingNotesInput" 
                                    name="meetingNotes" 
                                    bind:value={consultationState.meetingNotes} 
                                    placeholder="Contoh: Kami sudah punya wireframe Figma / Butuh integrasi khusus dengan payment gateway..." 
                                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 dark:border-zinc-800"
                                ></textarea>
                            </div>

                            <!-- Notice Box -->
                            <div class="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start gap-3">
                                <Info class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div class="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                                    <p class="font-semibold text-zinc-700 dark:text-zinc-300">Konfirmasi Pertemuan</p>
                                    <p>Setelah Anda mengirimkan formulir ini, briefing dan jadwal pilihan Anda akan tersimpan langsung ke sistem kami. Kami akan mengonfirmasi tautan Google Meet melalui email <strong>{consultationState.contactEmail || 'kontak Anda'}</strong>.</p>
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Navigation Action Buttons -->
                    <div class="flex justify-between items-center pt-4">
                        <Button type="button" variant="outline" class="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center gap-1 py-5 px-6 rounded-xl text-sm font-medium" onclick={goBack}>
                            <ArrowLeft size={16} />
                            Kembali Edit Briefing
                        </Button>

                        <Button 
                            type="submit" 
                            disabled={isSubmitting} 
                            class="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 group py-5 px-6 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {#if isSubmitting}
                                <Spinner size={16} class="text-white mr-1" />
                                Memproses...
                            {:else}
                                Kirim Briefing & Simpan Jadwal
                                <ChevronRight size={16} class="group-hover:translate-x-0.5 transition-transform" />
                            {/if}
                        </Button>
                    </div>
                </div>
            {/if}
        </form>
    </div>
</div>
