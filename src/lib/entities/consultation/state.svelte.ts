import { setCookie } from '$lib/shared/cookies';

export const featurePresets = {
  web_service: {
    basic: [
      "Landing Page Berkinerja Tinggi (1-3 Halaman)",
      "Company Profile Statis Modern (3-5 Halaman)",
      "Desain Responsif & Mobile-First",
      "Formulir Kontak & Integrasi WhatsApp Otomatis",
      "Integrasi Blog / CMS Sederhana",
      "Optimasi SEO On-Page Dasar & Meta Tags",
      "Integrasi Google Analytics & Search Console",
      "Galeri Foto / Portofolio Produk Statis",
      "Setup Keamanan SSL & Optimasi Kecepatan Loading (Lighthouse 90+)",
      "Bantuan Setup Domain & DNS Hosting"
    ],
    intermediate: [
      "E-commerce / Toko Online Lokal (Katalog, Keranjang, Checkout)",
      "Portal Berita / Media Blog Multi-Kategori & Tag",
      "Dashboard Admin Kustom (Multi-role & Manajemen Data)",
      "Sistem Autentikasi User (Login, Register, Reset Password)",
      "Integrasi Payment Gateway Otomatis (Midtrans / Xendit)",
      "Integrasi Database SQL / NoSQL (PostgreSQL / Supabase / Firestore)",
      "Integrasi Cek Ongkir Otomatis (RajaOngkir / Biteship)",
      "Integrasi Notifikasi Email Transaksional (Nodemailer / Resend)",
      "Role-Based Access Control (RBAC) & Manajemen Izin Pengguna",
      "RESTful API & Webhook Endpoints Kustom",
      "Fitur Pencarian & Filter Produk / Data Interaktif",
      "Dark Mode & UI Component Library Kustom"
    ],
    industrial: [
      "B2B SaaS Dashboard Multi-Tenant",
      "Platform FinTech / Pembayaran Multi-Channel Kompleks",
      "Real-time Analytics Dashboard & WebSocket Telemetri",
      "Integrasi Multi-API Pihak Ketiga Lanjutan (ERP / CRM / SAP)",
      "Sistem Audit Log, Keamanan Berlapis & Enkripsi Data AES",
      "Otomasi Ekspor / Impor Data Skala Besar (Excel, CSV, PDF)",
      "Infrastruktur Cloud Autoscaling (AWS / GCP / Cloudflare)",
      "Arsitektur Microservices & Background Job Queues (Redis / BullMQ)",
      "Enterprise Single Sign-On (SSO) & OAuth2 / SAML",
      "Database Sharding, Caching Layer & Read Replicas",
      "Automated CI/CD Pipeline & End-to-End Testing",
      "Monitoring Server 24/7 & Disaster Recovery Plan"
    ]
  },
  mobile_service: {
    basic: [
      "Aplikasi MVP (Minimum Viable Product) Cross-Platform",
      "Fungsionalitas Inti & UI/UX Bersih Standar",
      "Integrasi Database Real-time (Firebase / Supabase)",
      "Sistem Login & Registrasi Dasar (Email & Google Sign-In)",
      "Offline Caching Sederhana (Local Storage / SQLite)",
      "Push Notifications Dasar (Firebase Cloud Messaging)",
      "Navigasi Tab Bar & Drawer Menu Responsif",
      "Formulir Input Data & Validasi Interaktif",
      "Splash Screen Kustom & App Icon Siap Rilis",
      "Panduan & Bantuan Publikasi ke Play Store / App Store"
    ],
    intermediate: [
      "Aplikasi Bisnis Kustom & E-Commerce Mobile",
      "Integrasi Payment Gateway In-App (Midtrans / Xendit Snap)",
      "Fitur Geolokasi, Peta Interaktif & Tracking Rute (Google Maps)",
      "Push Notifications Tersegmentasi & Real-time Chat",
      "Arsitektur Dedicated Backend Server & REST / GraphQL API",
      "Autentikasi Biometrik (Fingerprint / Face ID)",
      "Sinkronisasi Data Otomatis Online / Offline (Offline-First Sync)",
      "Upload Media / Foto dengan Kompresi Gambar Otomatis",
      "Filter Pencarian Produk, Riwayat Transaksi & Invoice PDF",
      "In-App Rating & Deep Linking (Universal Links)"
    ],
    industrial: [
      "Aplikasi Industri, Telemetri & IoT Hardware Tracking",
      "Integrasi Konektivitas Bluetooth Low Energy (BLE) / NFC / RFID",
      "Arsitektur High-Throughput & Background Data Synchronization",
      "Keamanan Tingkat Tinggi (Jailbreak Detection, SSL Pinning, Token Encryption)",
      "Animasi UI Super Halus (60/120 FPS Fluid Gestures)",
      "Dashboard Monitoring Armada / Aset Skala Besar",
      "Skalabilitas Cloud Backend Autoscaling & Load Balancing",
      "Queue Offline-First dengan Resolusi Konflik Data Otomatis",
      "Integrasi Pemindaian Barcode / QR Code Scanner Kecepatan Tinggi",
      "Dukungan SLA Khusus, Crashlytics Monitoring & Analytics"
    ]
  }
};

export class ConsultationState {
  private _store: any;
  storeValue = $state<any>(null);
  step = $state(1);
  errors = $state<Record<string, string>>({});

  constructor(store: any) {
    this._store = store;
    store.subscribe((v: any) => {
      this.storeValue = v;
    });
  }

  private getVal(key: string, fallback: any) {
    return this.storeValue ? this.storeValue[key] : fallback;
  }

  private setVal(key: string, val: any) {
    this._store.update((s: any) => {
      s[key] = val;
      return s;
    });
    this.saveToCookies();
  }

  // Getters/Setters mapping directly to store
  get contactName() { return this.getVal('contactName', ''); }
  set contactName(v) { this.setVal('contactName', v); }

  get contactEmail() { return this.getVal('contactEmail', ''); }
  set contactEmail(v) { this.setVal('contactEmail', v); }

  get contactPhone() { return this.getVal('contactPhone', ''); }
  set contactPhone(v) { this.setVal('contactPhone', v); }

  get companyName() { return this.getVal('companyName', ''); }
  set companyName(v) { this.setVal('companyName', v); }

  get industry() { return this.getVal('industry', ''); }
  set industry(v) { this.setVal('industry', v); }

  get websiteUrl() { return this.getVal('websiteUrl', ''); }
  set websiteUrl(v) { this.setVal('websiteUrl', v); }

  get projectTitle() { return this.getVal('projectTitle', ''); }
  set projectTitle(v) { this.setVal('projectTitle', v); }

  get serviceType() { return this.getVal('serviceType', 'web_service'); }
  set serviceType(v) { this.setVal('serviceType', v); }

  get projectTier() { return this.getVal('projectTier', 'basic'); }
  set projectTier(v) { this.setVal('projectTier', v); }

  get coreObjective() { return this.getVal('coreObjective', ''); }
  set coreObjective(v) { this.setVal('coreObjective', v); }

  get requestedDomain() { return this.getVal('requestedDomain', ''); }
  set requestedDomain(v) { this.setVal('requestedDomain', v); }

  get domainSetupType() { return this.getVal('domainSetupType', 'none'); }
  set domainSetupType(v) { this.setVal('domainSetupType', v); }

  get domainEstimatedPrice() { return this.getVal('domainEstimatedPrice', ''); }
  set domainEstimatedPrice(v) { this.setVal('domainEstimatedPrice', v); }

  get keyFeatures() { return this.getVal('keyFeatures', []); }
  set keyFeatures(v) { this.setVal('keyFeatures', v); }

  get targetTimeline() { return this.getVal('targetTimeline', 'flexible'); }
  set targetTimeline(v) { this.setVal('targetTimeline', v); }

  get infrastructureAck() { return this.getVal('infrastructureAck', false); }
  set infrastructureAck(v) { this.setVal('infrastructureAck', v); }

  get termsAck() { return this.getVal('termsAck', false); }
  set termsAck(v) { this.setVal('termsAck', v); }

  get alreadyConsulted() { return this.getVal('alreadyConsulted', false); }
  set alreadyConsulted(v) { this.setVal('alreadyConsulted', v); }

  get consultationChannel() { return this.getVal('consultationChannel', ''); }
  set consultationChannel(v) { this.setVal('consultationChannel', v); }

  get consultationDate() { return this.getVal('consultationDate', ''); }
  set consultationDate(v) { this.setVal('consultationDate', v); }

  get consultationTime() { return this.getVal('consultationTime', '10:00 - 11:00 WIB'); }
  set consultationTime(v) { this.setVal('consultationTime', v); }

  get meetingNotes() { return this.getVal('meetingNotes', ''); }
  set meetingNotes(v) { this.setVal('meetingNotes', v); }

  // Derived properties
  get currentFeaturesPreset(): string[] {
    const service = this.serviceType;
    const tier = this.projectTier;
    const presets = featurePresets[service as keyof typeof featurePresets];
    if (!presets) return [];
    return presets[tier as keyof typeof presets] || [];
  }

  get briefingText(): string {
    let text = `Briefing Awal:\n- Perusahaan: ${this.companyName} (${this.industry})\n- Proyek: ${this.projectTitle} (Tier: ${this.projectTier})\n- Tujuan: ${this.coreObjective}`;
    if (this.serviceType === 'web_service' && this.requestedDomain) {
      text += `\n- Domain: ${this.requestedDomain} (${this.domainSetupType === 'existing_domain' ? 'Milik Sendiri' : 'Pengajuan Baru'}${this.domainEstimatedPrice ? ' - ' + this.domainEstimatedPrice : ''})`;
    }
    text += `\n- Fitur Utama: ${this.keyFeatures.join(", ")}`;
    return text;
  }

  // Mutator Actions
  resetFeatures(): void {
    this.keyFeatures = [];
  }

  validateStep1(): boolean {
    this.errors = {};
    const val = this.storeValue;
    if (!val) return false;

    if (!val.contactName || val.contactName.trim().length < 2) {
      this.errors.contactName = "Nama kontak minimal 2 karakter";
    }
    if (!val.contactEmail || !/^\S+@\S+\.\S+$/.test(val.contactEmail)) {
      this.errors.contactEmail = "Format email tidak valid";
    }
    if (!val.contactPhone || val.contactPhone.trim().length < 8) {
      this.errors.contactPhone = "Nomor WhatsApp wajib diisi (minimal 8 digit)";
    }
    if (!val.companyName || val.companyName.trim().length < 2) {
      this.errors.companyName = "Nama perusahaan minimal 2 karakter";
    }
    if (!val.industry || val.industry.trim().length < 2) {
      this.errors.industry = "Bidang industri wajib diisi";
    }
    if (!val.projectTitle || val.projectTitle.trim().length < 3) {
      this.errors.projectTitle = "Judul proyek minimal 3 karakter";
    }
    if (!val.coreObjective || val.coreObjective.trim().length < 20) {
      this.errors.coreObjective = "Tujuan utama minimal 20 karakter";
    }
    if (!val.keyFeatures || val.keyFeatures.length === 0) {
      this.errors.keyFeatures = "Pilih minimal 1 fitur yang dibutuhkan";
    }
    if (!val.infrastructureAck) {
      this.errors.infrastructureAck = "Anda wajib menyetujui tanggung jawab biaya infrastruktur";
    }
    if (!val.termsAck) {
      this.errors.termsAck = "Anda wajib menyetujui Syarat dan Ketentuan Layanan";
    }

    if (Object.keys(this.errors).length === 0) {
      this.step = 2;
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return true;
    } else {
      if (typeof document !== 'undefined') {
        const firstError = Object.keys(this.errors)[0];
        const el = document.getElementById(firstError);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return false;
    }
  }

  saveToCookies(): void {
    if (typeof document === 'undefined') return;
    const val = this.storeValue;
    if (!val) return;
    setCookie('contactName', val.contactName || '');
    setCookie('contactEmail', val.contactEmail || '');
    setCookie('contactPhone', val.contactPhone || '');
    setCookie('companyName', val.companyName || '');
    setCookie('industry', val.industry || '');
    setCookie('websiteUrl', val.websiteUrl || '');
    setCookie('projectTitle', val.projectTitle || '');
    setCookie('serviceType', val.serviceType || 'web_service');
    setCookie('projectTier', val.projectTier || 'basic');
    setCookie('coreObjective', val.coreObjective || '');
    setCookie('requestedDomain', val.requestedDomain || '');
    setCookie('domainSetupType', val.domainSetupType || 'none');
    setCookie('domainEstimatedPrice', val.domainEstimatedPrice || '');
    setCookie('keyFeatures', JSON.stringify(val.keyFeatures || []));
    setCookie('alreadyConsulted', String(val.alreadyConsulted || false));
    setCookie('consultationChannel', val.consultationChannel || '');
    setCookie('consultationDate', val.consultationDate || '');
    setCookie('consultationTime', val.consultationTime || '');
    setCookie('meetingNotes', val.meetingNotes || '');
  }
}
