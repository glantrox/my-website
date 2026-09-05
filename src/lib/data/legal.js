import { 
    BookOpen, 
    Sparkles, 
    Cpu, 
    Coins, 
    UserCheck, 
    Lock, 
    ShieldCheck, 
    AlertCircle, 
    Gavel,
    Database,
    Wrench,
    Share2,
    RefreshCw,
    Mail
} from "lucide-svelte";

// Terms of Service Dataset
export const termsOfService = [
    {
        id: "scope",
        title: "1. Scope of Work & Project Boundaries",
        icon: BookOpen,
        subsections: [
            {
                title: "1.1 In-Scope Services (Tanggung Jawab Kami)",
                content: "Kami bertanggung jawab untuk memenuhi siklus hidup pengembangan produk digital sebagaimana disepakati secara tertulis, yang meliputi:",
                items: [
                    "Konsultasi awal dan pengumpulan kebutuhan bisnis (Requirement Gathering).",
                    "Desain antarmuka & pengalaman pengguna (UI/UX Design) serta pembuatan prototipe interaktif.",
                    "Rekayasa full-stack (pengembangan tampilan depan / frontend & arsitektur server belakang / backend).",
                    "Pengujian fungsionalitas sistem, optimasi performa, dan verifikasi desain responsif pada berbagai perangkat.",
                    "Pendampingan konfigurasi server/hosting, pemetaan domain, enkripsi SSL, dan deployment hingga platform dapat diakses oleh publik."
                ]
            },
            {
                title: "1.2 Out-of-Scope Elements (Di Luar Tanggung Jawab)",
                content: "Kecuali disepakati secara eksplisit melalui klausul tertulis terpisah atau biaya tambahan, layanan kami TIDAK meliputi:",
                items: [
                    "Penyediaan Aset Konten: Penyediaan materi teks (copywriting), grafis/foto resolusi tinggi, logo resmi, dan video perusahaan sepenuhnya merupakan tanggung jawab Klien.",
                    "Akun Pengembang & Lisensi Pihak Ketiga: Biaya berlangganan akun Apple Developer ($99/tahun), Google Play Console ($25 sekali bayar), atau lisensi API pihak ketiga berbayar (seperti Google Maps API, WhatsApp Business API, SMS Gateways, dll).",
                    "Kepatuhan Hukum Platform: Pengurusan izin usaha digital, penanganan regulasi hukum lokal, pembuatan dokumen Kebijakan Privasi (Privacy Policy), atau pembuatan Syarat Ketentuan khusus untuk pengguna akhir (end-user) Klien."
                ]
            }
        ]
    },
    {
        id: "changes",
        title: "2. Change Management & Feature Modifications (Change Request)",
        icon: Sparkles,
        subsections: [
            {
                content: "Setiap permintaan penambahan fitur baru, pengubahan logika alur sistem, atau perombakan desain yang diajukan setelah dokumen spesifikasi kebutuhan awal disetujui bersama akan dikategorikan sebagai Change Request (Scope Creep).",
            },
            {
                content: "Semua Change Request harus diajukan secara tertulis. Kami akan melakukan analisis dampak terhadap timeline pengembangan dan merilis estimasi biaya tambahan kustom. Pengerjaan fitur baru ini baru akan dieksekusi setelah Klien menyetujui invoice biaya tambahan tersebut secara formal."
            }
        ]
    },
    {
        id: "fees",
        title: "3. Fee Structure, Infrastructure, & Payment Terms",
        icon: Coins,
        subsections: [
            {
                title: "3.1 Biaya Pembuatan (Development Fee)",
                content: "Biaya pembuatan sistem adalah biaya satu kali (one-time fee) berdasarkan nominal yang tercantum pada Quotation resmi yang disepakati di awal."
            },
            {
                title: "3.2 Skenario Infrastruktur & Biaya Rutin Pihak Ketiga",
                content: "Klien memahami sepenuhnya bahwa platform digital memerlukan infrastruktur aktif agar tetap online. Biaya sewa server/VPS (Virtual Private Server), pemeliharaan domain, dan hosting cloud merupakan tanggung jawab finansial Klien sepenuhnya. Biaya ini dibayarkan langsung oleh Klien kepada penyedia layanan pihak ketiga (atau melalui sistem yang kami bantu siapkan). Kami tidak bertanggung jawab atas matinya sistem akibat keterlambatan Klien dalam membayar biaya infrastruktur tersebut."
            },
            {
                title: "3.3 Termin Pembayaran (Payment Milestones)",
                items: [
                    "Uang Muka (Down Payment): Pengerjaan proyek baru akan masuk antrean produksi aktif setelah Klien melakukan pembayaran termin pertama sebesar 40% dari total nilai kontrak.",
                    "Termin Progress: Pembayaran berikutnya ditagihkan secara berkala berdasarkan penyelesaian milestone pengerjaan yang disepakati di awal.",
                    "Rilis Final (Pelunasan): Pelunasan sisa tagihan 100% wajib dilakukan setelah pengujian fungsionalitas (User Acceptance Testing) selesai dan sebelum pemindahan akses kontrol penuh (root access) atau source code ke server/repositori Klien."
                ]
            }
        ]
    },
    {
        id: "bookings",
        title: "4. Consultation Bookings & Initial Data Validation",
        icon: UserCheck,
        subsections: [
            {
                content: "Untuk efisiensi antrean pengerjaan, Klien diwajibkan menyelesaikan funnel pemesanan berikut di website kami sebelum sesi konsultasi formal dimulai:",
                items: [
                    "Pemilihan Layanan: Menentukan jenis produk digital dan tier estimasi biaya (Basic, Intermediate, atau Industrial).",
                    "Pengisian Briefing: Mengisi formulir requirement data awal secara lengkap mengenai tujuan platform, industri, dan core fitur.",
                    "Sinkronisasi Jadwal: Memilih slot waktu konsultasi gratis selama 15 menit melalui kalender penjadwalan terintegrasi."
                ]
            },
            {
                content: "Kami berhak melakukan penjadwalan ulang jika data briefing awal yang dikirimkan terbukti tidak valid atau tidak memadai untuk dianalisis secara arsitektural."
            }
        ]
    },
    {
        id: "ip",
        title: "5. Intellectual Property Rights & Copyright Transfer",
        icon: Cpu,
        subsections: [
            {
                content: "Hak kepemilikan intelektual penuh atas kode sumber (source code), desain visual final, skema database, dan dokumentasi sistem akan dialihkan sepenuhnya kepada Klien hanya setelah seluruh kewajiban pembayaran invoice diselesaikan secara lunas oleh Klien."
            },
            {
                content: "Kami memegang hak moral dan profesional untuk menampilkan nama proyek, cuplikan antarmuka, dan studi kasus arsitektur sistem pada portofolio website kami untuk tujuan pemasaran, kecuali jika Klien meminta penandatanganan NDA (Non-Disclosure Agreement) tertulis di awal proyek."
            }
        ]
    },
    {
        id: "confidentiality",
        title: "6. Data Confidentiality & Non-Disclosure",
        icon: Lock,
        subsections: [
            {
                content: "Kedua belah pihak sepakat untuk melindungi kerahasiaan semua data bisnis internal, strategi produk, data pengguna, atau informasi rahasia lainnya yang dipertukarkan selama masa pengerjaan proyek."
            },
            {
                content: "Informasi rahasia ini tidak boleh dibocorkan kepada pihak ketiga mana pun tanpa persetujuan tertulis dari pihak pemilik data, baik selama masa pengerjaan proyek maupun setelah proyek dinyatakan selesai untuk jangka waktu yang tidak terbatas."
            }
        ]
    },
    {
        id: "warranty",
        title: "7. Warranties, Maintenance, & Liability Caps",
        icon: ShieldCheck,
        subsections: [
            {
                title: "7.1 Garansi Bug & Pemeliharaan Awal",
                content: "Kami memberikan garansi pemeliharaan sistem gratis selama 30 Hari terhitung sejak tanggal platform diserahterimakan atau diluncurkan secara resmi. Garansi ini berlaku khusus untuk perbaikan bug atau kerusakan sistem yang disebabkan oleh cacat penulisan kode kami.",
                warning: "Garansi ini otomatis gugur apabila Klien atau pihak ketiga lainnya melakukan modifikasi kode sumber, memodifikasi skema database, atau mengubah konfigurasi server utama tanpa persetujuan tertulis dari kami."
            },
            {
                title: "7.2 Batasan Tanggung Jawab (Limitation of Liability)",
                content: "Meskipun kami mengoptimalkan platform dengan standar performa dan keamanan terbaik, kami tidak dapat dituntut atas:",
                items: [
                    "Kerugian finansial, hilangnya potensi profit bisnis Klien, atau kegagalan operasional internal yang dialami Klien.",
                    "Kebocoran data atau peretasan server akibat kelalaian Klien dalam mengamankan kredensial server utama atau kunci akses administratif.",
                    "Kerusakan sistem akibat force majeure atau matinya infrastruktur server penyedia cloud utama (seperti AWS, DigitalOcean, Vercel, dll)."
                ]
            }
        ]
    },
    {
        id: "termination",
        title: "8. Project Delays & Termination Clauses",
        icon: AlertCircle,
        subsections: [
            {
                content: "Pembatalan Sepihak: Jika Klien membatalkan proyek di tengah proses pengembangan karena alasan apa pun, maka semua uang muka (Down Payment) dan termin pembayaran yang telah dibayarkan tidak dapat dikembalikan sebagai kompensasi atas alokasi waktu pengerjaan kami."
            },
            {
                content: "Penelantaran Proyek (Abandonment): Jika Klien tidak memberikan respons, umpan balik desain, atau aset data yang diperlukan selama 30 Hari berturut-turut tanpa pemberitahuan perpanjangan waktu tertulis, proyek akan dianggap ditelantarkan. Kami berhak menutup proyek, dan tagihan termin pengerjaan yang sudah selesai wajib dilunasi oleh Klien."
            }
        ]
    },
    {
        id: "law",
        title: "9. Governing Law & Dispute Resolution",
        icon: Gavel,
        subsections: [
            {
                content: "Syarat dan Ketentuan Layanan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di negara Indonesia."
            },
            {
                content: "Jika terjadi perbedaan pendapat atau perselisihan sehubungan dengan pelaksanaan layanan ini, kedua belah pihak sepakat untuk mengupayakan penyelesaian musyawarah secara kekeluargaan terlebih dahulu. Apabila mufakat tidak tercapai dalam waktu 30 hari, perselisihan akan diselesaikan melalui yurisdiksi pengadilan hukum wilayah Tangerang, Banten."
            }
        ]
    }
];

// Privacy Policy Dataset
export const privacyPolicy = [
    {
        id: "collect",
        title: "1. Information We Collect",
        icon: Database,
        subsections: [
            {
                content: "Untuk menganalisis ruang lingkup proyek secara efektif dan memberikan solusi teknis terbaik, kami mengumpulkan data dalam beberapa kategori berikut:"
            },
            {
                title: "1.1 Informasi yang Anda Berikan Secara Langsung",
                items: [
                    "Detail Kontak & Akun: Nama Anda, nama perusahaan, sektor industri, alamat email, nomor telepon, dan tautan platform digital yang sudah ada.",
                    "Data Kebutuhan Proyek (Intake): Sasaran bisnis, fitur utama, target peluncuran, infrastruktur pilihan, serta dokumen briefing yang dikirimkan melalui alur onboarding.",
                    "Sinkronisasi Jadwal: Tanggal, zona waktu, dan preferensi waktu pertemuan konsultasi yang Anda pilih melalui widget kalender terintegrasi kami."
                ]
            },
            {
                title: "1.2 Informasi yang Dikumpulkan Secara Otomatis",
                items: [
                    "Log Teknis: Alamat IP, tipe browser, sistem operasi, dan pengenal perangkat untuk kebutuhan optimasi kinerja antarmuka platform.",
                    "Analisis Penggunaan: Interaksi Anda pada halaman layanan kami, mencakup pola klik, waktu respons halaman, dan alur navigasi."
                ]
            }
        ]
    },
    {
        id: "usage",
        title: "2. How We Use Your Information",
        icon: Wrench,
        subsections: [
            {
                content: "Kami mengolah data Anda secara ketat untuk memenuhi tanggung jawab kontrak kami dan meningkatkan kenyamanan platform Anda. Secara khusus, kami menggunakannya untuk:",
                items: [
                    "Melakukan pengumpulan kebutuhan dan analisis teknis arsitektur sebelum sesi konsultasi kita.",
                    "Merumuskan spesifikasi produk digital, mockup UI/UX, dan penawaran biaya resmi.",
                    "Mengelola proses proyek, mengirimkan pembaruan teknis secara berkala, dan penagihan termin/milestone.",
                    "Memelihara dan mengoptimalkan performa, keamanan, serta kompatibilitas responsif di website dan dasbor Klien kami.",
                    "Mematuhi kewajiban hukum yang sah, menegakkan Syarat Layanan kami, serta melindungi dari pelanggaran keamanan atau aktivitas penipuan."
                ]
            }
        ]
    },
    {
        id: "security",
        title: "3. Data Protection & Source Code Security",
        icon: ShieldCheck,
        subsections: [
            {
                content: "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat untuk melindungi aset digital Anda:",
                items: [
                    "Enkripsi Data: Semua data yang dikirimkan melalui dasbor onboarding dan formulir briefing dilindungi menggunakan protokol enkripsi SSL/TLS standar industri.",
                    "Kontrol Akses Terbatas: Akses ke spesifikasi proyek, kredensial database staging, dan kunci server dibatasi secara ketat hanya untuk personel teknis kami yang ditugaskan langsung pada proyek Anda.",
                    "Keamanan Kode Sumber (Source Code): Selama masa pengembangan, kode sumber di-host pada repositori privat yang aman. Kontrol administratif dan kepemilikan repositori akan ditransfer sepenuhnya kepada Anda setelah pelunasan akhir proyek."
                ]
            }
        ]
    },
    {
        id: "sharing",
        title: "4. Data Sharing & Third-Party Integrations",
        icon: Share2,
        subsections: [
            {
                content: "Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi atau bisnis Anda kepada pihak ketiga. Kami hanya membagikan informasi dengan penyedia layanan tepercaya yang penting untuk mendukung penyelesaian proyek Anda:",
                items: [
                    "Integrasi Pihak Ketiga: Widget yang tertanam pada platform kami (seperti widget penjadwalan Cal.com) hanya menerima parameter minimum yang diperlukan untuk mengunci jadwal pemesanan Anda secara otomatis.",
                    "Konfigurasi Infrastruktur: Dengan persetujuan eksplisit dari Anda, metadata konfigurasi server dapat dibagikan kepada penyedia hosting awan (seperti AWS, DigitalOcean, Google Cloud) untuk deployment platform.",
                    "Kepatuhan Hukum: Kami dapat mengungkapkan informasi Anda jika diwajibkan oleh hukum atau dengan itikad baik bahwa tindakan tersebut diperlukan untuk mematuhi proses pengadilan hukum."
                ]
            }
        ]
    },
    {
        id: "confidentiality",
        title: "5. Non-Disclosure & Business Confidentiality",
        icon: Lock,
        subsections: [
            {
                content: "Kami memperlakukan sistem, strategi bisnis, dan logika aplikasi Anda dengan kerahasiaan mutlak:",
                items: [
                    "Semua rancangan wireframe, rahasia dagang internal, catatan database, dan algoritma kustom yang ditukar selama pengerjaan akan dijaga kerahasiaannya.",
                    "Kami tidak akan membagikan atau memamerkan logika sistem sensitif atau mekanisme perangkat lunak internal Klien kepada pihak eksternal mana pun.",
                    "Kami berhak menampilkan pratinjau visual antarmuka platform hasil akhir yang sudah dipublikasikan di portofolio kami, kecuali jika Anda meminta penandatanganan NDA (Non-Disclosure Agreement) tertulis di awal proyek."
                ]
            }
        ]
    },
    {
        id: "rights",
        title: "6. Your Data Rights",
        icon: UserCheck,
        subsections: [
            {
                content: "Klien memiliki hak-hak tertentu terkait data pribadi dan proyek yang kami simpan, meliputi:",
                items: [
                    "Hak Akses & Koreksi: Anda dapat meminta salinan data pengajuan Anda atau meminta koreksi atas catatan proyek yang tidak akurat.",
                    "Hak Penghapusan Data: Anda dapat meminta kami untuk menghapus data kontak Anda atau draf proyek dari database kami, dengan ketentuan tidak ada kontrak aktif atau tagihan tertunda yang mewajibkan retensi data tersebut.",
                    "Portabilitas Data: Anda berhak meminta ekspor data spesifikasi kebutuhan proyek yang telah Anda kirimkan kepada kami dalam format yang terstruktur dan bersih."
                ]
            }
        ]
    },
    {
        id: "changes",
        title: "7. Changes to This Privacy Policy",
        icon: RefreshCw,
        subsections: [
            {
                content: "Kami berhak memperbarui Kebijakan Privasi ini kapan saja untuk mencerminkan penyesuaian regulasi hukum atau pembaruan alur kerja teknis kami. Setiap perubahan akan segera berlaku setelah kami mengunggah revisi kebijakan privasi di halaman ini, ditandai dengan pembaruan tanggal di bagian atas dokumen. Kami menyarankan Anda untuk meninjau halaman ini secara berkala."
            }
        ]
    },
    {
        id: "contact",
        title: "8. Contact Information",
        icon: Mail,
        subsections: [
            {
                content: "Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan penghapusan data terkait Kebijakan Privasi ini, silakan hubungi kami secara langsung melalui kontak berikut:",
                items: [
                    "Email: hamasazeezan@gmail.com (atau kirim langsung melalui formulir kontak)",
                    "Formulir Konsultasi: Booking Consultation Dashboard"
                ]
            }
        ]
    }
];
