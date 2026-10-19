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
    name: "Mirzam Abdurrachman",
    npa: "NPA: 03457",
    title: "Pakar Vulkanologi & Dosen Teknik Geologi ITB",
    tagline: "Geologi Berdaya, Berdampak, dan Menginspirasi untuk Indonesia",
    photo: "assets/candidate-1.png?v=navystudio",
    badge: "Kandidat 01",
    accentColor: "#0284C7",
    secondaryColor: "#F59E0B",
    vision: "Mewujudkan IAGI sebagai organisasi profesi kebumian yang inklusif, adaptif terhadap transisi energi dan krisis iklim, serta berperan aktif mencerdaskan bangsa melalui diplomasi geosains nasional dan global.",
    missions: [
      "Menguatkan jejaring riset, sinergi lintas generasi geoscientist, dan kolaborasi multipihak (akademisi, industri, pemerintah).",
      "Mendorong advokasi kebijakan berbasis bukti geologi untuk mitigasi bencana kebumian dan tata ruang berkelanjutan.",
      "Digitalisasi layanan keanggotaan dan peningkatan program sertifikasi kompetensi bertaraf internasional.",
      "Membangkitkan peran aktif generasi muda dan mahasiswa geologi (SM-IAGI) di seluruh pelosok nusantara."
    ],
    experience: "Pendidik, peneliti vulkanologi ITB & komunikator sains kebumian terkemuka Indonesia. NPA: 03457.",
    education: "Doktor Ilmu Kebumian • Magister Teknik Geologi ITB",
    endorsements: "Didukung oleh akademisi, praktisi mitigasi kebencanaan, diaspora geosains, dan SM-IAGI nasional."
  },
  {
    id: 2,
    number: "02",
    name: "Sonny Yudhistira",
    npa: "NPA: 03749",
    title: "Praktisi Geologi Eksplorasi & Bisnis Energi Kebumian",
    tagline: "IAGI Sinergis, Mandiri, dan Mengakselerasi Kesejahteraan Anggota",
    photo: "assets/candidate-2.png?v=navystudio",
    badge: "Kandidat 02",
    accentColor: "#10B981",
    secondaryColor: "#0284C7",
    vision: "Menjadikan IAGI rumah besar profesi geologi Indonesia yang mandiri secara finansial, menjamin perlindungan karier profesi, dan menjadi rujukan utama ketahanan energi dan hilirisasi mineral strategis.",
    missions: [
      "Meningkatkan daya saing dan perlindungan advokasi hukum ketenagakerjaan bagi seluruh praktisi geologi di tanah air.",
      "Optimalisasi kemitraan strategis dengan BUMN, sektor swasta energi, dan pertambangan untuk perluasan lapangan kerja.",
      "Mendirikan dana abadi dan inkubasi usaha geosains bagi kemandirian program Pengurus Daerah (Pengda).",
      "Penyelenggaraan pelatihan kompetensi terapan mutakhir, AI geoscience, dan eksplorasi mineral masa depan."
    ],
    experience: "Praktisi senior eksplorasi sumber daya energi & mineral dengan rekam jejak industri komprehensif. NPA: 03749.",
    education: "Magister Geosains • Sarjana Teknik Geologi",
    endorsements: "Didukung oleh praktisi industri migas, pertambangan mineral strategis, dan geopreneur nusantara."
  },
  {
    id: 3,
    number: "03",
    name: "Sri Hartanto",
    npa: "NPA: 05653",
    title: "Senior Geoscientist & Konsultan Tata Kelola Kebumian",
    tagline: "Transformasi Nyata IAGI: Profesional, Berintegritas, Menatap Masa Depan",
    photo: "assets/candidate-3.png?v=navystudio",
    badge: "Kandidat 03",
    accentColor: "#D97706",
    secondaryColor: "#2563EB",
    vision: "Transformasi menyeluruh IAGI menuju tata kelola organisasi modern yang transparan, mempererat persaudaraan seluruh anggota, serta mengangkat martabat geoscientist Indonesia di panggung regional dan global.",
    missions: [
      "Reformasi birokrasi internal IAGI dengan sistem manajemen berbasis cloud dan keterbukaan informasi publik.",
      "Revitalisasi seluruh Pengurus Daerah (Pengda) dan Seksi Khusus agar berdaya dalam merespons isu lokal.",
      "Advokasi regulasi standar remunerasi profesi ahli geologi dan sertifikasi insinyur profesional (IPU/IPM).",
      "Penyusunan peta jalan keilmuan geologi nasional menghadapi era dekarbonisasi dan revolusi teknologi informasi."
    ],
    experience: "Senior geoscientist dengan pengalaman panjang tata kelola proyek eksplorasi dan manajemen organisasi. NPA: 05653.",
    education: "Sarjana Teknik Geologi • Sertifikasi Profesional Geosains",
    endorsements: "Didukung oleh lintas Pengda IAGI, pemerhati tata kelola kebumian, dan konsultan geologi senior."
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
