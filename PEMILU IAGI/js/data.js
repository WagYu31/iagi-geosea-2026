/**
 * Data Resmi Kandidat Caketum & DPT Pemilu IAGI 2026
 * Sesuai Regulasi Komisi Pemilihan Ketua Umum (KPKU) IAGI
 */

const ELECTION_CONFIG = {
  title: "Pemilihan Ketua Umum IAGI Periode 2026 - 2029",
  shortTitle: "Pemilu IAGI 2026",
  organization: "Ikatan Ahli Geologi Indonesia (IAGI)",
  committee: "Komisi Pemilihan Ketua Umum (KPKU) 2026",
  dptReleaseDate: "25 September 2026",
  reactivationDeadline: "24 September 2026",
  votingEndDate: "2026-10-25T18:00:00+07:00", // Target countdown timer
  helpdesk: {
    whatsapp: "+62 811-158-1461",
    whatsappClean: "628111581461",
    email: "iagisekretariat@gmail.com",
    address: "Gedung Sekretariat DPP IAGI, Jakarta Selatan"
  }
};

const CANDIDATES = [
  {
    id: 1,
    number: "01",
    name: "Dr. Ir. H. Muhammad Arifin, M.Sc., IPU",
    title: "Ahli Geologi Eksplorasi Migas & Transisi Energi",
    tagline: "IAGI Berdaulat, Mandiri, dan Memimpin Transisi Energi Nasional",
    photo: "assets/candidate-1.jpg",
    badge: "Kandidat 01",
    accentColor: "#F5BA42",
    secondaryColor: "#10B981",
    vision: "Mewujudkan IAGI sebagai asosiasi profesi kebumian yang mandiri, berdaya saing global, serta menjadi garda terdepan advokasi kebijakan ketahanan energi dan hilirisasi georesources Indonesia.",
    missions: [
      "Memperkuat kompetensi dan sertifikasi internasional bagi seluruh anggota IAGI lintas generasi.",
      "Mendorong kontribusi aktif geoscientist dalam mitigasi krisis iklim, teknologi CCS/CCUS, dan panas bumi (geothermal).",
      "Modernisasi tata kelola organisasi berbasis digital yang transparan, partisipatif, dan akuntabel.",
      "Membuka jaringan kolaborasi industri, pemerintah, dan diaspora geosains di seluruh dunia."
    ],
    experience: "28+ tahun memimpin riset cekungan migas dan transisi energi. Dewan Penasihat IAGI & Dosen Kehormatan Petroleum Geoscience.",
    education: "Doktor Teknik Geologi ITB • M.Sc. Colorado School of Mines",
    endorsements: "Didukung oleh praktisi migas, akademisi, dan geoscientist senior nusantara."
  },
  {
    id: 2,
    number: "02",
    name: "Dr. Eng. Andiani, S.T., M.T.",
    title: "Pakar Geologi Tata Lingkungan & Mitigasi Bencana Geologi",
    tagline: "Geologi untuk Kesejahteraan Rakyat: Tangguh, Inklusif, dan Berkelanjutan",
    photo: "assets/candidate-2.jpg",
    badge: "Kandidat 02",
    accentColor: "#10B981",
    secondaryColor: "#F5BA42",
    vision: "Menjadikan IAGI sebagai pilar keilmuan geologi terapan yang inklusif, responsif terhadap kebencanaan geologi, dan memberikan kemanfaatan nyata bagi keselamatan dan kemakmuran masyarakat Indonesia.",
    missions: [
      "Memperluas peran strategis ahli geologi dalam penyusunan Rencana Tata Ruang Wilayah (RTRW) dan mitigasi sesar aktif/tsunami.",
      "Membangun program mentorship berkelanjutan 'IAGI Muda & Women in Geosciences' untuk akselerasi karier anggota.",
      "Optimalisasi dana abadi IAGI dan transparansi keuangan organisasi berbasis audit terbuka.",
      "Revitalisasi peran Pengurus Daerah (Pengda) dan Seksi Mahasiswa (SM-IAGI) sebagai ujung tombak kegiatan ilmiah."
    ],
    experience: "24+ tahun mengabdi di Badan Geologi & PVMBG. Pemimpin kajian sesar aktif dan zonasi mitigasi bencana geologi nasional.",
    education: "Doctor of Engineering Kyoto University • S.T. & M.T. Universitas Padjadjaran",
    endorsements: "Didukung oleh peneliti kebumian, aktivis lingkungan hidup, dan SM-IAGI berbagai universitas."
  },
  {
    id: 3,
    number: "03",
    name: "Ir. Burhanuddin Harahap, Ph.D., ASEAN Eng.",
    title: "Praktisi Hilirisasi Mineral Kritis & AI Geosains",
    tagline: "Transformasi Digital Geosains: Inovatif, Kolaboratif, Mengakar di Daerah",
    photo: "assets/candidate-3.jpg",
    badge: "Kandidat 03",
    accentColor: "#38BDF8",
    secondaryColor: "#C5A059",
    vision: "Transformasi IAGI menjadi lokomotif inovasi teknologi geosains terapan, hilirisasi mineral strategis (critical minerals), dan pemanfaatan AI untuk mempercepat penemuan deposit mineral baru Indonesia.",
    missions: [
      "Mengintegrasikan machine learning dan big data geologi ke dalam kurikulum sertifikasi profesional berkala IAGI.",
      "Advokasi regulasi perlindungan profesi ahli geologi Indonesia di hadapan persaingan tenaga kerja asing.",
      "Penguatan peran geologis daerah di setiap sentra pertambangan dan megaproyek infrastruktur nasional.",
      "Mendirikan Inkubator Start-up Geosains dan Fasilitasi Hak Cipta/Paten karya inovasi anggota."
    ],
    experience: "22+ tahun eksplorasi critical minerals (nikel, tembaga, REE). ASEAN Outstanding Geoscientist Award 2024.",
    education: "Ph.D. Economic Geology Curtin University • Sarjana Teknik Geologi UPN Veteran",
    endorsements: "Didukung oleh praktisi mineral, geopreneur muda, dan konsultan geoteknik."
  }
];

// Sample DPT (Daftar Pemilih Tetap) Terverifikasi KPKU IAGI 2026
const INITIAL_DPT = [
  { npa: "IAGI-2024-0001", name: "Anggota Uji Coba IAGI", email: "pemilih@iagi.or.id", pengda: "DKI Jakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2024-0002", name: "Geologist Muda Indonesia", email: "geologist@iagi.or.id", pengda: "Jawa Barat", category: "Student", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2024-0003", name: "Senior Geoscientist IAGI", email: "senior@iagi.or.id", pengda: "Jawa Timur", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-1994-0104", name: "Prof. Dr. Ir. Budiarto Santoso, M.Sc.", email: "budiarto.s@geologi.ac.id", pengda: "D.I. Yogyakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-1998-0412", name: "Dr. Ir. Hendra Saputra, M.T.", email: "hendra.saputra@migas.co.id", pengda: "DKI Jakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2001-0789", name: "Dewi Anggraini, S.T., M.Eng.", email: "dewi.anggraini@tambang.com", pengda: "Kalimantan Timur", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2004-1102", name: "Bambang Wijaya, S.T.", email: "bambang.wijaya@energi.id", pengda: "Riau", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2005-1420", name: "Siti Rahmawati, S.T., M.Sc.", email: "siti.rahmawati@brin.go.id", pengda: "Jawa Barat", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2008-2041", name: "Fajar Nugroho, S.Si., M.T.", email: "fajar.nugroho@esdm.go.id", pengda: "DKI Jakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2010-2580", name: "Rina Kusuma Wardhani, S.T.", email: "rina.kusuma@mineral.id", pengda: "Sulawesi Selatan", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2012-3341", name: "Ahmad Fauzi, S.T., M.T.", email: "ahmad.fauzi@freeport.id", pengda: "Papua", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2014-4115", name: "Nadia Pratiwi, S.T.", email: "nadia.pratiwi@vale.co.id", pengda: "Sulawesi Tengah", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2015-4890", name: "Eko Prasetyo, S.Si.", email: "eko.prasetyo@geothermal.com", pengda: "Sumatera Utara", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2016-5520", name: "Tri Wahyuni, S.T., M.Sc.", email: "tri.wahyuni@itb.ac.id", pengda: "Jawa Barat", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2017-6102", name: "Dimas Arya Pratama, S.T.", email: "dimas.arya@petro.com", pengda: "Sumatera Selatan", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2018-6889", name: "Fitria Nurul Hidayah, S.T.", email: "fitria.nurul@bppt.go.id", pengda: "Banten", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2019-7450", name: "Reza Pahlevi, S.Si., M.Sc.", email: "reza.pahlevi@ugm.ac.id", pengda: "D.I. Yogyakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2020-8012", name: "Lestari Widyaningrum, S.T.", email: "lestari.w@georisk.org", pengda: "Jawa Tengah", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2021-8765", name: "Bayu Aji Pamungkas, S.T.", email: "bayu.aji@tambangemas.id", pengda: "Nusa Tenggara Barat", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2022-9340", name: "Maya Indriani, S.T.", email: "maya.indriani@consultant.com", pengda: "DKI Jakarta", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2023-9890", name: "Galih Wicaksono, S.T.", email: "galih.w@geodrill.com", pengda: "Kalimantan Selatan", category: "Professional", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null },
  { npa: "IAGI-2024-1052", name: "Anisa Putri Maharani, S.T.", email: "anisa.maharani@geoai.id", pengda: "Jawa Barat", category: "Student", status: "AKTIF", claimed: false, token: null, voted: false, voted_at: null }
];

// Akun Resmi Panitia & Pengawas KPKU Pemilu IAGI 2026
const ADMIN_ACCOUNTS = [
  {
    id: "adm-01",
    name: "Dr. Ir. Hendra Saputra, M.T.",
    title: "Ketua Komisi Pemilihan Ketua Umum (KPKU)",
    email: "admin.kpku@iagi.or.id",
    password: "admin",
    securityPin: "2026",
    role: "Ketua Panitia"
  },
  {
    id: "adm-02",
    name: "Sekretariat Panitia & Saksi Pleno",
    title: "Pengawas Pemilu & Saksi Resmi",
    email: "panitia@pemiluiagi.id",
    password: "admin",
    securityPin: "2026",
    role: "Pengawas / Saksi"
  }
];

// Attach explicitly to window for cross-script safety
window.ELECTION_CONFIG = ELECTION_CONFIG;
window.CANDIDATES = CANDIDATES;
window.INITIAL_DPT = INITIAL_DPT;
window.ADMIN_ACCOUNTS = ADMIN_ACCOUNTS;
