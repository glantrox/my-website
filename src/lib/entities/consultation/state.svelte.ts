import { setCookie } from '$lib/shared/cookies';

export const featurePresets = {
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

  get keyFeatures() { return this.getVal('keyFeatures', []); }
  set keyFeatures(v) { this.setVal('keyFeatures', v); }

  get targetTimeline() { return this.getVal('targetTimeline', 'flexible'); }
  set targetTimeline(v) { this.setVal('targetTimeline', v); }

  get infrastructureAck() { return this.getVal('infrastructureAck', false); }
  set infrastructureAck(v) { this.setVal('infrastructureAck', v); }

  get termsAck() { return this.getVal('termsAck', false); }
  set termsAck(v) { this.setVal('termsAck', v); }

  // Derived properties
  get currentFeaturesPreset(): string[] {
    const service = this.serviceType;
    const tier = this.projectTier;
    const presets = featurePresets[service as keyof typeof featurePresets];
    if (!presets) return [];
    return presets[tier as keyof typeof presets] || [];
  }

  get briefingText(): string {
    return `Briefing Awal:\n- Perusahaan: ${this.companyName} (${this.industry})\n- Proyek: ${this.projectTitle} (Tier: ${this.projectTier})\n- Tujuan: ${this.coreObjective}\n- Fitur Utama: ${this.keyFeatures.join(", ")}`;
  }

  get calIframeUrl(): string {
    return `https://cal.com/hamasazeezan/15min?name=${encodeURIComponent(this.contactName)}&email=${encodeURIComponent(this.contactEmail)}&notes=${encodeURIComponent(this.briefingText)}`;
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
    setCookie('companyName', val.companyName || '');
    setCookie('industry', val.industry || '');
    setCookie('websiteUrl', val.websiteUrl || '');
    setCookie('projectTitle', val.projectTitle || '');
    setCookie('serviceType', val.serviceType || 'web_service');
    setCookie('projectTier', val.projectTier || 'basic');
    setCookie('coreObjective', val.coreObjective || '');
    setCookie('keyFeatures', JSON.stringify(val.keyFeatures || []));
  }
}
