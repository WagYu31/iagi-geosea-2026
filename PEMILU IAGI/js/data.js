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
    videoUrl: "https://youtu.be/AWuwsGSSKSE",
    tagline: "From Epicentrum to Concrete Impact: Modernizing Indonesia's Geoscience Leadership",
    subTagline: "Maju Bersama, Berdampak Nyata",
    photo: "assets/candidate-1.png?v=navystudio",
    badge: "Kandidat 01",
    accentColor: "#0284C7",
    secondaryColor: "#F59E0B",
    leadershipArah: "Kepemimpinan IAGI 2026–2029 berlandaskan semangat transformasi dan akselerasi. Bersama, kita melanjutkan dan mengembangkan fondasi yang telah dibangun, mendekatkan IAGI kepada seluruh anggotanya, serta memajukan ilmu pengetahuan dan teknologi geologi untuk menjadikan IAGI semakin kuat, relevan, menjadi sumber inspirasi, dan memberi dampak nyata bagi profesi, industri, masyarakat, dan bangsa.",
    vision: "Menjadikan IAGI sebagai rumah besar geosaintis Indonesia yang solid, profesional, inklusif, dan berintegritas; sekaligus menjadi pusat keunggulan dan rujukan geosains bertaraf internasional yang memberikan dampak nyata bagi anggota, pengembangan profesi, kemajuan industri, dan ketahanan bangsa.",
    missions: [
      "Menguatkan IAGI sebagai Rumah Bersama: Membangun IAGI yang dekat, terbuka, inklusif, solid, dan bermanfaat bagi seluruh anggota lintas generasi, keahlian, dan wilayah.",
      "Memuliakan dan Menguatkan Profesi: Memperkuat kompetensi, profesionalisme, etika, sertifikasi, karier, serta perlindungan dan advokasi geosaintis Indonesia.",
      "Menyatukan Kekuatan Geosaintis Indonesia: Memperkuat sinergi PP, Pengda, Komisariat, Chapter Luar Negeri, Anak Organisasi, & Seksi Mahasiswa, serta kolaborasi dengan perguruan tinggi, industri, pemerintah, dan mitra nasional maupun internasional.",
      "Menghadirkan Geosains yang Berdampak: Menjadikan IAGI rujukan profesional dan ilmiah dalam isu strategis kebumian untuk kepentingan masyarakat dan Bangsa Indonesia.",
      "Membangun IAGI yang Berkelanjutan & Mendunia: Mewujudkan IAGI yang modern, transparan, mandiri, adaptif, berkelanjutan, serta kuat dalam regenerasi dan jejaring internasional."
    ],
    programs: [
      "Continuity, Strengthen & Impact: Menjaga capaian terbukti, memperkuat fondasi kelembagaan, dan memastikan manfaat nyata terukur.",
      "Roadmap 2026–2029: 2026 Consolidate, 2027 Strengthen, 2028 Expand, 2029 Impact & Institutionalize menuju Roadmap IAGI 2035.",
      "Flagship Program: Digital Indonesia Mineral Prospectivity Map berbasis digital kolaborasi IAGI, pemerintah, industri, perguruan tinggi, dan Badan Geologi.",
      "Penguatan Rumah IAGI sebagai Knowledge Hub, Center of Excellence di setiap Anak Organisasi, dan persiapan akreditasi SINTA/Scopus Jurnal IAGI.",
      "Advokasi lanjutan memastikan RUU Geologi masuk Prolegnas Prioritas DPR/Kementerian ESDM dan sertifikasi mandiri melalui LSP terintegrasi."
    ],
    experienceList: [
      "Sekretaris Jenderal PP IAGI Periode 2023 – 2026",
      "Ketua Pengurus Daerah (Pengda) IAGI Jawa Barat dan Banten Periode 2022 – 2025",
      "Wakil Ketua I Pengurus Pusat ASPRODITEGI Periode 2022 – 2025",
      "Koordinator Bidang Pendidikan dan Kursus PP IAGI Periode 2020 – 2023",
      "Anggota Divisi Bidang Pengembangan Keilmuan PP IAGI Periode 2017 – 2020",
      "Ketua Yayasan Pendidikan Geologi Karangsambung (2021 – sekarang)",
      "Scientific Advisory Committee (SAC) Global Volcano Risk Alliance (GVRA) (2023 – sekarang)",
      "Ketua Volkanologi - Pusat Penelitian Mitigasi Bencana ITB (2018 – 2020)",
      "Anggota JpGU, IAVCEI, American Geophysical Union (AGU), dan Geological Society of Japan (GSJ)"
    ]
  },
  {
    id: 2,
    number: "02",
    name: "Sonny Yudhistira",
    npa: "NPA: 03749",
    videoUrl: "https://youtu.be/Y5l_fN_LA6g",
    tagline: "Babak Baru IAGI: Bergerak, Bersinergi, Berdampak",
    subTagline: "Menghubungkan Profesional, Akademisi, Industri, Pemerintah dan Masyarakat",
    photo: "assets/candidate-2.png?v=navystudio",
    badge: "Kandidat 02",
    accentColor: "#10B981",
    secondaryColor: "#0284C7",
    leadershipArah: "Profesi geologi sedang menghadapi tantangan besar transisi energi, AI digitalisasi, geohazard, dan regenerasi. IAGI harus memimpin perubahan: tidak hanya menjadi organisasi profesi klasik, tetapi menjadi Platform yang Menghubungkan seluruh pemangku kepentingan. Jangan hanya menjadi pendorong perubahan, 'Mari Memimpinnya'!",
    vision: "Membangun IAGI yang Inovatif, Kolaboratif, dan Berorientasi Masa Depan demi Kemajuan Keilmuan, Kesejahteraan Profesi, dan Keberlanjutan Nusantara.",
    missions: [
      "Eksplorasi & Aplikasi Kebumian Utuh: Menguatkan peran geologi di seluruh aspek: eksplorasi minerba & migas, transisi energi, geologi teknik, infrastruktur, hingga Geoheritage.",
      "Sustainability & Berdampak Sosial: Mendorong ilmu kebumian sebagai pilar tata kelola lingkungan hidup, penataan wilayah, serta perlindungan ekosistem tanah dan air secara berkelanjutan.",
      "Digitalisasi 'Geology 4.0' & Integrasi Data: Mengakselerasi pemanfaatan teknologi modern (digitalisasi) serta menyinergikan kurikulum kampus dan riset akademis dengan kebutuhan lintas industri.",
      "Proteksi Profesi & Kolaborasi: Mengawal perlindungan hukum, kesetaraan remunerasi, kemudahan sertifikasi (CPI/STRI), serta menjembatani penguatan Pengda, Anak Organisasi, Asproditegi, dan Geologis Muda."
    ],
    programs: [
      "RUANG IAGI (Pilar Cipta): Digital ecosystem for Indonesian geoscientists — Career hub, knowledge repository, digital membership, dashboard Pengda & Anak Organisasi (Target 2029: 5.000 pengguna aktif).",
      "GEO-OUTCROP NUSANTARA (Pilar Cipta): National geological outcrop database platform berbasis partisipasi anggota lintas komoditas & disiplin (Target 2029: 20.000 data, 8.000 titik tervalidasi).",
      "SAPA BUMI (Pilar Kolaborasi): Satu Pengda, Satu Solusi Kebumian — Responsible mining, pemetaan longsor & mitigasi masyarakat, konservasi akuifer air tanah, dan geowisata (Target 2029: 20 proyek regional).",
      "IAGI COLLABORATIVE (Pilar Kolaborasi): Collaborative Fund & Industry Challenge menghubungkan industri, kampus, dan profesional (Target 2029: 10 proyek kolaborasi & publikasi).",
      "GEOLOGY 4.0 ACADEMY (Pilar Masa Depan): Pelatihan kurikulum berkelanjutan GIS, remote sensing, 3D modelling, geostatistik, seismic, basin modelling, CCS, AI & drone mapping (Target 2029: 30 modul, 3.000 peserta).",
      "GEO-PROTECT (Pilar Masa Depan): Professional protection & advancement — Klinik profesi etik & kontrak, certification support (CPI, STRI, CP, MRA ASEAN), salary survey & benchmark fee (Target 2029: 500 anggota terlayani)."
    ],
    experienceList: [
      "Praktisi senior geologi eksplorasi & bisnis energi kebumian dengan pengalaman luas industri nasional",
      "Berpengalaman dalam manajemen eksplorasi migas, mineral kritis, panas bumi (geothermal), dan CCS",
      "Penggagas integrasi teknologi Geology 4.0, digital outcrop mapping, dan pemanfaatan AI kebumian",
      "Aktif dalam advokasi penguatan perlindungan profesi geolog dan pembinaan generasi muda kebumian"
    ]
  },
  {
    id: 3,
    number: "03",
    name: "Sri Hartanto",
    npa: "NPA: 05653",
    videoUrl: "https://youtu.be/qhJNFKEdhp0",
    tagline: "Driven by Purpose: IAGI Harus Menjadi Kekuatan Bersama Geologi Indonesia",
    subTagline: "Berarti bagi Setiap Anggota · Berarti bagi Keilmuan · Berarti bagi Indonesia",
    photo: "assets/candidate-3.png?v=navystudio",
    badge: "Kandidat 03",
    accentColor: "#D97706",
    secondaryColor: "#2563EB",
    leadershipArah: "Pengalaman memberi saya bekal untuk memimpin, geologi memberi saya cara untuk memahami, dan IAGI memberi saya alasan untuk mengabdi. Saya tidak datang untuk mengambil alih apa yang sudah berjalan. Saya datang untuk menghubungkan, memperkuat, dan menggerakkan seluruh kekuatan IAGI. Saya siap bekerja bersama, bukan bekerja sendiri.",
    vision: "IAGI menjadi organisasi keprofesian seluruh geologi Indonesia non-profit yang mandiri dan profesional. BERARTI bagi setiap ANGGOTA, BERARTI bagi KEILMUAN, dan BERARTI bagi INDONESIA.",
    missions: [
      "Inklusif: Membangun ekosistem organisasi yang merangkul seluruh elemen akademisi dan insan geosains tanpa batasan sektor, generasi, maupun wilayah.",
      "Inovatif: Mendorong dan mewadahi lahirnya gagasan, penelitian, dan penerapan teknologi melalui budaya inovasi untuk menjawab tantangan geologi dan kebumian yang terus berkembang.",
      "Kontributif: Menjadikan IAGI sebagai mitra strategis masyarakat dalam memperkuat kemajuan dan keberlanjutan kegeologian (mitigasi kebencanaan, konservasi alam, geoteknik, geowisata, SDA & mineral, ketahanan energi)."
    ],
    programs: [
      "1. DIGITAL & SUSTAINABILITY (Build the System): One Member - One Data - One System, integrated membership & database, real-time dashboard, good governance, paperless.",
      "2. GEOPEDIA (Build the Knowledge): Geoscience knowledge hub, repository data kebumian, publikasi & artikel ilmiah, expert network, digital library & virtual museum.",
      "3. IAGI ACADEMY & TALENT (Build the People): Career pathway geoscientist, young geoscientist program, mentoring & professional development, sertifikasi & kompetensi, leadership training.",
      "4. IAGI CONNECT (Connect the Ecosystem): Kemitraan strategis pemerintah-industri-kampus, cross-chapter collaboration, international exposure, business & professional matching.",
      "5. GEO FOR INDONESIA (Create the Impact): Isu strategis kebumian nasional (Data -> Science -> Discussion), policy brief, rekomendasi profesional & advokasi kebijakan.",
      "Milestone Terukur: 100 Hari (Build Foundation & audit), 1 Tahun (Integrated membership system berjalan), 3 Tahun (IAGI menjadi trusted professional voice kebumian Indonesia)."
    ],
    experienceList: [
      "Geologist, Leader, & Anggota IAGI dengan 28+ tahun pengalaman profesional di industri energi & kebumian",
      "Pendidikan: S1 & S2 Teknik Geologi Institut Teknologi Bandung (ITB)",
      "Rekam jejak kepemimpinan komprehensif di bidang Exploration, Business Management, & Team Leadership",
      "Pengalaman organisasi lintas sektor: Professional community, industrial governance, dan kemitraan strategis",
      "Komitmen memimpin IAGI sebagai Orchestrator yang menghubungkan 7 Anak Organisasi, 28 Pengda, 3 Komisariat, 2 Chapter Luar Negeri, 29 SM-IAGI, dan 10.000+ anggota"
    ]
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
