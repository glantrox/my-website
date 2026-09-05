import { json } from '@sveltejs/kit';

/**
 * Benchmark harga pasar domain tahunan di registrar Indonesia (Niagahoster, DomaiNesia, PANDI)
 */
/** @type {Record<string, { price: number, formatted: string, note: string, requiresDocs: boolean }>} */
const TLD_PRICES = {
  'com': { price: 165000, formatted: 'Rp 165.000 / tahun', note: 'Paling populer global & terpercaya', requiresDocs: false },
  'id': { price: 225000, formatted: 'Rp 225.000 / tahun', note: 'Identitas resmi & kredibel di Indonesia', requiresDocs: false },
  'co.id': { price: 125000, formatted: 'Rp 125.000 / tahun', note: 'Khusus entitas usaha resmi (PT/CV/Firma - butuh NIB/KTP)', requiresDocs: true },
  'biz.id': { price: 15000, formatted: 'Rp 15.000 / tahun', note: 'Program hemat PANDI untuk UMKM & perintis usaha', requiresDocs: false },
  'my.id': { price: 12000, formatted: 'Rp 12.000 / tahun', note: 'Hemat untuk personal branding, portofolio & blog', requiresDocs: false },
  'net': { price: 195000, formatted: 'Rp 195.000 / tahun', note: 'Pilihan utama bisnis IT, SaaS & networking', requiresDocs: false },
  'org': { price: 185000, formatted: 'Rp 185.000 / tahun', note: 'Ideal untuk organisasi, komunitas & non-profit', requiresDocs: false },
  'io': { price: 650000, formatted: 'Rp 650.000 / tahun', note: 'Standar emas startup teknologi global & developer', requiresDocs: false },
  'xyz': { price: 40000, formatted: 'Rp 40.000 / tahun', note: 'Modern, fleksibel, terjangkau untuk ide kreatif', requiresDocs: false },
  'store': { price: 50000, formatted: 'Rp 50.000 / tahun', note: 'Khusus toko online & brand e-commerce', requiresDocs: false },
  'tech': { price: 75000, formatted: 'Rp 75.000 / tahun', note: 'Brand teknologi, aplikasi & produk inovasi', requiresDocs: false },
  'dev': { price: 230000, formatted: 'Rp 230.000 / tahun', note: 'Google TLD dengan proteksi HTTPS otomatis', requiresDocs: false },
  'app': { price: 230000, formatted: 'Rp 230.000 / tahun', note: 'Cocok untuk aplikasi & software produk', requiresDocs: false }
};

/**
 * Cek status ketersediaan domain via RDAP resmi atau DNS over HTTPS
 * @param {string} domain 
 * @returns {Promise<boolean | null>} true jika tersedia, false jika terdaftar, null jika error/unknown
 */
async function checkAvailability(domain) {
  // 1. Cek via RDAP (RFC 7480/7482)
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      },
      signal: AbortSignal.timeout(2800),
      redirect: 'follow'
    });

    if (res.status === 404) {
      return true; // Tidak ditemukan di registry = Tersedia
    }
    if (res.status === 200) {
      return false; // Ada data pendaftaran = Sudah Terdaftar
    }
  } catch (e) {
    // Lanjut ke fallback DNS
  }

  // 2. Fallback via Cloudflare DNS over HTTPS (DoH)
  try {
    const doh = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { 'accept': 'application/dns-json' },
      signal: AbortSignal.timeout(2200)
    });
    if (doh.ok) {
      const data = await doh.json();
      // Status 3 = NXDOMAIN (Domain tidak ada / tidak aktif di DNS)
      if (data.Status === 3) {
        return true;
      }
      // Status 0 dengan Answer = Aktif / Sudah Terdaftar
      if (data.Status === 0 && (data.Answer || data.Authority)) {
        return false;
      }
    }
  } catch (e) {
    // Fallback gagal
  }

  return null;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const query = (url.searchParams.get('domain') || url.searchParams.get('q') || '').trim().toLowerCase();

  if (!query) {
    return json({ error: 'Parameter domain wajib diisi' }, { status: 400 });
  }

  // Bersihkan input domain
  let cleanDomain = query
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/.*$/, '')
    .replace(/[^a-z0-9.-]/g, '');

  if (!cleanDomain || cleanDomain.length < 2) {
    return json({ error: 'Nama domain tidak valid' }, { status: 400 });
  }

  // Pisahkan base name dan ekstensi jika ada
  let baseName = cleanDomain;
  let targetTld = 'com';

  const dotIndex = cleanDomain.indexOf('.');
  if (dotIndex !== -1) {
    baseName = cleanDomain.substring(0, dotIndex);
    targetTld = cleanDomain.substring(dotIndex + 1);
  }

  // Jika nama dasar mengandung karakter tidak valid
  if (!baseName || baseName.length < 2) {
    return json({ error: 'Nama domain terlalu pendek' }, { status: 400 });
  }

  const primaryFullDomain = `${baseName}.${targetTld}`;
  const tldInfo = TLD_PRICES[targetTld] || {
    price: 175000,
    formatted: 'Rp 175.000 / tahun',
    note: 'Ekstensi domain internasional standar',
    requiresDocs: false
  };

  // Cek ketersediaan domain utama
  const primaryAvailable = await checkAvailability(primaryFullDomain);

  const primaryResult = {
    domain: primaryFullDomain,
    tld: `.${targetTld}`,
    available: primaryAvailable,
    price: tldInfo.price,
    priceFormatted: tldInfo.formatted,
    note: tldInfo.note,
    requiresDocs: tldInfo.requiresDocs
  };

  // TLD alternatif untuk rekomendasi
  const altTlds = ['com', 'id', 'co.id', 'biz.id', 'net']
    .filter(tld => tld !== targetTld)
    .slice(0, 4);

  const suggestions = await Promise.all(
    altTlds.map(async (altTld) => {
      const altDomain = `${baseName}.${altTld}`;
      const altInfo = TLD_PRICES[altTld] || {
        price: 175000,
        formatted: 'Rp 175.000 / tahun',
        note: '',
        requiresDocs: false
      };
      const avail = await checkAvailability(altDomain);

      return {
        domain: altDomain,
        tld: `.${altTld}`,
        available: avail,
        price: altInfo.price,
        priceFormatted: altInfo.formatted,
        note: altInfo.note,
        requiresDocs: altInfo.requiresDocs
      };
    })
  );

  return json(
    {
      query: cleanDomain,
      baseName,
      primary: primaryResult,
      suggestions
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=120'
      }
    }
  );
}
