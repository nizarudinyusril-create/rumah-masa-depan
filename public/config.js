/**
 * House Vision Builder - Config Data
 * Data pertanyaan, opsi, profil gaya, bobot skor, dan informasi aplikasi.
 */

const APP_CONFIG = {
  appName: "House Vision Builder",
  tagline: "Temukan gambaran rumah impianmu, 3–5 menit saja.",
  estimatedMinutes: "3–5 menit",
  whatsappEnabled: true
};

const WHATSAPP_NUMBER = "6282229540204";

const STYLE_PROFILES = [
  {
    id: "skandinavian",
    label: "Skandinavian",
    ringkasan: "Gaya hunian asal Eropa Utara yang mengutamakan kelimpahan cahaya alami, kesederhanaan bentuk, dan kepraktisan hidup sehari-hari. Ruangan terasa terang, bersih, lapang, dan menenangkan dengan dominasi warna putih serta sentuhan kayu hangat.",
    ciriKhas: [
      "Atap pelana curam dengan bukaan jendela kaca lebar",
      "Dominasi warna putih dipadu material kayu natural terang",
      "Pencahayaan alami melimpah dan tata ruang terbuka tanpa sekat kaku"
    ],
    cocokUntuk: "Kamu yang menyukai suasana terang, rapi, tenang, dan praktis dirawat tanpa banyak barang.",
    perluDiperhatikan: "Perlu pemilihan kayu berkualitas dan tirai peneduh yang baik agar ruang tidak silau di siang terik.",
    weights: {
      suasana_tenang: 3, suasana_lapang: 3, suasana_hangat: 2, suasana_natural: 2, suasana_ceria: 1,
      cahaya_jendela_besar: 3, cahaya_skylight: 2, cahaya_lampu_hangat: 2, cahaya_lampu_sorot: 0, cahaya_courtyard: 1, cahaya_void: 1,
      warna_clean_tone: 3, warna_warm_natural: 3, warna_pastel: 2, warna_monokrom: 1, warna_earth_tone: 2, warna_abu: 1, warna_cold_natural: 1, warna_sky_tone: 1, warna_fun_color: 0, warna_industrial_tone: 0,
      mat_kayu: 3, mat_kaca: 2, mat_tembok_biasa: 2, mat_rotan_bambu: 1, mat_marmer: 0, mat_beton_ekspos: 0, mat_bata_ekspos: 0, mat_metal_aksen: 0, mat_batu_alam: 1,
      vent_banyak_jendela: 3, vent_jendela_panorama: 2, vent_void: 1, vent_courtyard_tengah: 1, vent_exhaust_fan: 1, vent_boven: 1, vent_full_ac: 0,
      hindar_sempit: 3, hindar_formal: 3, hindar_perawatan_ribet: 3, hindar_boros_energi: 2, hindar_panas: 1, hindar_budget_mahal: 2, hindar_kurang_privasi: 1
    }
  },
  {
    id: "modern_minimalis",
    label: "Modern Minimalis",
    ringkasan: "Konsep arsitektur kontemporer dengan garis geometris tegas, efisiensi fungsi ruang maksimal, dan tanpa ornamen yang tidak perlu. Menghadirkan kesan rumah modern yang lapang, efisien, tenang, dan selalu rapi.",
    ciriKhas: [
      "Bentuk kubus geometris dengan atap datar atau tersembunyi",
      "Jendela kaca besar membingkai pemandangan luar secara presisi",
      "Permukaan dinding bersih minim tekstur dengan finishing rapi dan terukur"
    ],
    cocokUntuk: "Kamu yang menginginkan hunian praktis, berjiwa masa kini, teratur, dan mudah dibersihkan.",
    perluDiperhatikan: "Butuh pengerjaan detail yang presisi dan sistem talang atap datar yang terencana rapi.",
    weights: {
      suasana_lapang: 3, suasana_tenang: 2, suasana_hangat: 1, suasana_natural: 1, suasana_ceria: 1,
      cahaya_jendela_besar: 3, cahaya_lampu_sorot: 2, cahaya_void: 2, cahaya_skylight: 2, cahaya_lampu_hangat: 1, cahaya_courtyard: 1,
      warna_clean_tone: 3, warna_monokrom: 3, warna_abu: 3, warna_earth_tone: 1, warna_warm_natural: 1, warna_sky_tone: 1, warna_pastel: 0, warna_industrial_tone: 1, warna_cold_natural: 0, warna_fun_color: 0,
      mat_kaca: 3, mat_tembok_biasa: 3, mat_beton_ekspos: 1, mat_marmer: 2, mat_metal_aksen: 2, mat_kayu: 1, mat_batu_alam: 1, mat_rotan_bambu: 0, mat_bata_ekspos: 0,
      vent_banyak_jendela: 2, vent_jendela_panorama: 3, vent_void: 2, vent_full_ac: 2, vent_exhaust_fan: 2, vent_courtyard_tengah: 1, vent_boven: 0,
      hindar_sempit: 3, hindar_formal: 2, hindar_perawatan_ribet: 3, hindar_boros_energi: 1, hindar_panas: 2, hindar_budget_mahal: 1, hindar_kurang_privasi: 1
    }
  },
  {
    id: "mediterania",
    label: "Mediterania",
    ringkasan: "Inspirasi villa pesisir Eropa Selatan dengan lengkungan pintu dan jendela yang anggun serta dinding bertekstur hangat. Menghadirkan suasana liburan abadi, megah bersahabat, dan sangat nyaman untuk berkumpul bersama keluarga.",
    ciriKhas: [
      "Bukaan lengkung (arch) menawan pada pintu, jendela, dan koridor",
      "Atap genteng terracotta dengan dinding warna krem atau tanah hangat",
      "Teras terbuka, balkon berpagar tempa indah, dan courtyard asri"
    ],
    cocokUntuk: "Keluarga yang menyukai kehangatan kumpul bersama, kemewahan klasik yang ramah, dan suasana santai.",
    perluDiperhatikan: "Pengerjaan profil lengkung membutuhkan tukang berpengalaman agar proporsinya indah dan presisi.",
    weights: {
      suasana_hangat: 3, suasana_ceria: 2, suasana_lapang: 2, suasana_natural: 2, suasana_tenang: 1,
      cahaya_lampu_hangat: 3, cahaya_courtyard: 3, cahaya_jendela_besar: 2, cahaya_skylight: 1, cahaya_lampu_sorot: 1, cahaya_void: 1,
      warna_earth_tone: 3, warna_warm_natural: 3, warna_pastel: 1, warna_clean_tone: 2, warna_sky_tone: 1, warna_abu: 0, warna_monokrom: 0, warna_industrial_tone: 0, warna_cold_natural: 1, warna_fun_color: 1,
      mat_batu_alam: 3, mat_tembok_biasa: 2, mat_marmer: 2, mat_kayu: 2, mat_rotan_bambu: 1, mat_kaca: 1, mat_metal_aksen: 1, mat_beton_ekspos: 0, mat_bata_ekspos: 1,
      vent_courtyard_tengah: 3, vent_banyak_jendela: 2, vent_boven: 2, vent_void: 2, vent_jendela_panorama: 1, vent_full_ac: 1, vent_exhaust_fan: 1,
      hindar_formal: 2, hindar_sempit: 2, hindar_panas: 3, hindar_kurang_privasi: 2, hindar_perawatan_ribet: 1, hindar_boros_energi: 2, hindar_budget_mahal: 0
    }
  },
  {
    id: "tropical_modern",
    label: "Tropical Modern",
    ringkasan: "Perpaduan ideal estetika modern dengan kecerdasan merespons iklim tropis Indonesia yang berlimpah matahari dan hujan. Dirancang agar rumah selalu sejuk alami, bebas pengap, dan menyatu harmonis dengan taman hijau.",
    ciriKhas: [
      "Teritisan atap miring lebar pelindung tempias hujan dan terik matahari",
      "Ventilasi silang optimal dengan courtyard tengah atau void taman",
      "Pemanfaatan kisi-kisi kayu peneduh, batu alam berpori, dan tanaman rimbun"
    ],
    cocokUntuk: "Kamu yang ingin hunian adem hemat energi, ramah iklim tropis, dan asri serasa tinggal di villa.",
    perluDiperhatikan: "Perlu perawatan berkala untuk talang air, tanaman luar, dan lapisan pelindung kayu eksterior.",
    weights: {
      suasana_natural: 3, suasana_tenang: 3, suasana_lapang: 2, suasana_hangat: 2, suasana_ceria: 1,
      cahaya_courtyard: 3, cahaya_jendela_besar: 3, cahaya_void: 3, cahaya_skylight: 2, cahaya_lampu_hangat: 2, cahaya_lampu_sorot: 0,
      warna_cold_natural: 3, warna_warm_natural: 3, warna_earth_tone: 3, warna_clean_tone: 2, warna_abu: 1, warna_monokrom: 0, warna_sky_tone: 1, warna_pastel: 0, warna_fun_color: 0, warna_industrial_tone: 0,
      mat_kayu: 3, mat_batu_alam: 3, mat_kaca: 2, mat_rotan_bambu: 2, mat_tembok_biasa: 1, mat_beton_ekspos: 1, mat_marmer: 1, mat_metal_aksen: 1, mat_bata_ekspos: 1,
      vent_courtyard_tengah: 3, vent_banyak_jendela: 3, vent_void: 3, vent_jendela_panorama: 2, vent_boven: 2, vent_exhaust_fan: 1, vent_full_ac: 0,
      hindar_panas: 3, hindar_boros_energi: 3, hindar_sempit: 2, hindar_formal: 2, hindar_kurang_privasi: 1, hindar_perawatan_ribet: 1, hindar_budget_mahal: 1
    }
  },
  {
    id: "tradisional_vernakular",
    label: "Tradisional Vernakular",
    ringkasan: "Mengangkat kearifan arsitektur nusantara seperti atap joglo atau limasan yang dipadukan dengan kenyamanan modern. Menghadirkan kehangatan kultural yang akrab, berjiwa, dan sangat kaya akan sirkulasi angin alami.",
    ciriKhas: [
      "Bentuk atap tradisional berkarakter tinggi menjulang dengan tritisan lebar",
      "Struktur tiang kayu ekspos, ukiran halus, dan umpak batu alami",
      "Konsep pendopo atau teras lapang menyambut untuk bercengkerama bersama"
    ],
    cocokUntuk: "Pecinta kehangatan budaya nusantara yang mendambakan rumah bernyawa dan penuh kebersamaan keluarga.",
    perluDiperhatikan: "Bahan kayu memerlukan perawatan anti rayap berkala dan pengerjaan konstruksi atap oleh perajin ahli.",
    weights: {
      suasana_hangat: 3, suasana_natural: 3, suasana_tenang: 2, suasana_lapang: 2, suasana_ceria: 1,
      cahaya_lampu_hangat: 3, cahaya_courtyard: 2, cahaya_jendela_besar: 1, cahaya_skylight: 1, cahaya_void: 2, cahaya_lampu_sorot: 0,
      warna_warm_natural: 3, warna_earth_tone: 3, warna_cold_natural: 2, warna_clean_tone: 0, warna_monokrom: 0, warna_abu: 0, warna_pastel: 0, warna_fun_color: 0, warna_sky_tone: 0, warna_industrial_tone: 0,
      mat_kayu: 3, mat_batu_alam: 3, mat_rotan_bambu: 3, mat_bata_ekspos: 2, mat_tembok_biasa: 1, mat_kaca: 1, mat_marmer: 0, mat_beton_ekspos: 0, mat_metal_aksen: 0,
      vent_banyak_jendela: 3, vent_boven: 3, vent_void: 2, vent_courtyard_tengah: 2, vent_jendela_panorama: 0, vent_exhaust_fan: 1, vent_full_ac: 0,
      hindar_formal: 3, hindar_panas: 3, hindar_boros_energi: 3, hindar_sempit: 2, hindar_kurang_privasi: 1, hindar_perawatan_ribet: 0, hindar_budget_mahal: 1
    }
  },
  {
    id: "dutch_klasik",
    label: "Dutch Klasik",
    ringkasan: "Pesona arsitektur kolonial peninggalan era Hindia Belanda yang anggun, kokoh, dan berwibawa abadi. Plafon menjulang tinggi dengan dinding tebal membuat bagian dalam rumah selalu sejuk alami dan megah bersahaja.",
    ciriKhas: [
      "Jendela tinggi simetris berdaun ganda dengan krepyak kayu atau kaca",
      "Plafon tinggi (high ceiling) yang menciptakan sirkulasi hawa luar biasa",
      "Pilar anggun, lis profil dinding rapi, dan teras depan berlantai tegel klasik"
    ],
    cocokUntuk: "Kamu yang menghargai nuansa megah abadi, ketenangan berkelas, dan ketahanan bangunan jangka panjang.",
    perluDiperhatikan: "Membutuhkan volume ruang dan plafon tinggi sehingga memerlukan perencanaan anggaran matang.",
    weights: {
      suasana_tenang: 3, suasana_lapang: 3, suasana_hangat: 2, suasana_natural: 1, suasana_ceria: 0,
      cahaya_jendela_besar: 3, cahaya_lampu_hangat: 3, cahaya_void: 2, cahaya_skylight: 1, cahaya_lampu_sorot: 1, cahaya_courtyard: 2,
      warna_clean_tone: 3, warna_earth_tone: 2, warna_monokrom: 2, warna_warm_natural: 2, warna_abu: 1, warna_pastel: 1, warna_cold_natural: 0, warna_sky_tone: 0, warna_fun_color: 0, warna_industrial_tone: 0,
      mat_tembok_biasa: 3, mat_kayu: 3, mat_marmer: 3, mat_batu_alam: 2, mat_kaca: 2, mat_metal_aksen: 1, mat_rotan_bambu: 0, mat_beton_ekspos: 0, mat_bata_ekspos: 0,
      vent_banyak_jendela: 3, vent_boven: 3, vent_void: 2, vent_jendela_panorama: 1, vent_courtyard_tengah: 2, vent_full_ac: 1, vent_exhaust_fan: 1,
      hindar_panas: 3, hindar_sempit: 3, hindar_boros_energi: 2, hindar_kurang_privasi: 2, hindar_formal: 0, hindar_perawatan_ribet: 1, hindar_budget_mahal: 0
    }
  },
  {
    id: "japandi",
    label: "Japandi",
    ringkasan: "Kombinasi harmonis antara keanggunan wabi-sabi Jepang dan fungsionalitas nyaman Skandinavia. Menghadirkan ketenangan batin lewat garis horizontal rendah, material kayu alami, dan keteraturan ruang yang hening.",
    ciriKhas: [
      "Furnitur dan garis visual rendah dekat dengan lantai yang menenangkan",
      "Palet warna lembut netral dengan kayu oak atau abu terang bersahaja",
      "Elemen sekat kisi kayu halus (shoji/kisi) dan tanaman indoor minimalis"
    ],
    cocokUntuk: "Kamu yang mencari kedamaian batin, hidup tenang tanpa distraksi, dan kerapian mindful di rumah.",
    perluDiperhatikan: "Menuntut komitmen kerapian (decluttering) agar esensi ruang hening tetap terjaga.",
    weights: {
      suasana_tenang: 3, suasana_natural: 3, suasana_hangat: 3, suasana_lapang: 2, suasana_ceria: 0,
      cahaya_jendela_besar: 2, cahaya_lampu_hangat: 3, cahaya_skylight: 2, cahaya_courtyard: 2, cahaya_void: 1, cahaya_lampu_sorot: 0,
      warna_warm_natural: 3, warna_earth_tone: 3, warna_clean_tone: 2, warna_cold_natural: 2, warna_abu: 1, warna_pastel: 1, warna_monokrom: 0, warna_sky_tone: 0, warna_industrial_tone: 0, warna_fun_color: 0,
      mat_kayu: 3, mat_rotan_bambu: 3, mat_tembok_biasa: 2, mat_batu_alam: 2, mat_kaca: 1, mat_marmer: 0, mat_beton_ekspos: 0, mat_bata_ekspos: 0, mat_metal_aksen: 0,
      vent_banyak_jendela: 2, vent_courtyard_tengah: 3, vent_void: 1, vent_boven: 1, vent_jendela_panorama: 1, vent_exhaust_fan: 1, vent_full_ac: 0,
      hindar_sempit: 3, hindar_formal: 3, hindar_perawatan_ribet: 3, hindar_boros_energi: 2, hindar_panas: 2, hindar_kurang_privasi: 2, hindar_budget_mahal: 1
    }
  },
  {
    id: "american_farmhouse",
    label: "American Farmhouse",
    ringkasan: "Gaya rumah pedesaan yang menyambut hangat dengan beranda depan luas, papan siding putih, dan suasana bersahabat. Setiap sudut rumah terasa akrab, santai, lapang, dan nyaman untuk kumpul keluarga besar.",
    ciriKhas: [
      "Beranda depan luas (porch) berpilar dengan kursi santai penyambut tamu",
      "Dinding siding horizontal putih berpadu aksen kayu pedesaan yang hangat",
      "Jendela berbingkai grid rapi dengan pintu bernuansa barn door khas"
    ],
    cocokUntuk: "Keluarga yang mengutamakan keramahan, keakraban santai, dan suasana pedesaan yang bersahaja.",
    perluDiperhatikan: "Perlu detail material siding tahan cuaca tropis agar tidak mudah lapuk terkena tempias hujan.",
    weights: {
      suasana_hangat: 3, suasana_ceria: 3, suasana_lapang: 2, suasana_natural: 2, suasana_tenang: 1,
      cahaya_jendela_besar: 3, cahaya_lampu_hangat: 3, cahaya_skylight: 1, cahaya_courtyard: 1, cahaya_void: 1, cahaya_lampu_sorot: 0,
      warna_clean_tone: 3, warna_warm_natural: 3, warna_earth_tone: 2, warna_pastel: 2, warna_monokrom: 1, warna_sky_tone: 1, warna_abu: 1, warna_fun_color: 1, warna_cold_natural: 0, warna_industrial_tone: 0,
      mat_kayu: 3, mat_tembok_biasa: 2, mat_bata_ekspos: 2, mat_rotan_bambu: 1, mat_kaca: 1, mat_metal_aksen: 1, mat_batu_alam: 1, mat_marmer: 0, mat_beton_ekspos: 0,
      vent_banyak_jendela: 3, vent_jendela_panorama: 2, vent_boven: 1, vent_void: 1, vent_courtyard_tengah: 1, vent_exhaust_fan: 1, vent_full_ac: 0,
      hindar_formal: 3, hindar_sempit: 2, hindar_kurang_privasi: 1, hindar_perawatan_ribet: 2, hindar_boros_energi: 2, hindar_panas: 2, hindar_budget_mahal: 2
    }
  },
  {
    id: "industrial",
    label: "Industrial",
    ringkasan: "Gaya tegas yang berani mengekspos kejujuran struktur bangunan seperti dinding bata, beton mentah, dan baja hitam. Memberikan karakter maskulin, modern, kreatif, dan tidak takut tampil apa adanya secara estetis.",
    ciriKhas: [
      "Ekspos material mentah seperti dinding bata merah dan semen acian halus",
      "Rangka besi atau baja hitam pada tangga, partisi, dan jendela kisi kotak",
      "Plafon tinggi terbuka dengan instalasi pipa dan ducting yang teratur rapi"
    ],
    cocokUntuk: "Jiwa muda dan kreatif yang menyukai tampilan berkarakter kuat, berani beda, dan berjiwa urban.",
    perluDiperhatikan: "Perlu tata pencahayaan hangat dan sentuhan tanaman indoor agar suasana tidak terasa dingin atau kaku.",
    weights: {
      suasana_lapang: 3, suasana_tenang: 1, suasana_hangat: 1, suasana_ceria: 1, suasana_natural: 1,
      cahaya_lampu_sorot: 3, cahaya_jendela_besar: 2, cahaya_void: 3, cahaya_skylight: 2, cahaya_lampu_hangat: 2, cahaya_courtyard: 1,
      warna_industrial_tone: 3, warna_abu: 3, warna_monokrom: 3, warna_earth_tone: 1, warna_warm_natural: 1, warna_clean_tone: 1, warna_cold_natural: 0, warna_pastel: 0, warna_sky_tone: 0, warna_fun_color: 0,
      mat_beton_ekspos: 3, mat_bata_ekspos: 3, mat_metal_aksen: 3, mat_kaca: 2, mat_kayu: 2, mat_tembok_biasa: 1, mat_batu_alam: 1, mat_marmer: 0, mat_rotan_bambu: 0,
      vent_void: 3, vent_banyak_jendela: 2, vent_exhaust_fan: 3, vent_jendela_panorama: 2, vent_full_ac: 2, vent_courtyard_tengah: 1, vent_boven: 1,
      hindar_formal: 3, hindar_sempit: 2, hindar_perawatan_ribet: 2, hindar_kurang_privasi: 1, hindar_boros_energi: 1, hindar_panas: 1, hindar_budget_mahal: 1
    }
  }
];

const QUESTIONS = [
  {
    id: "gaya",
    number: 1,
    title: "Pilih gaya rumah yang kamu suka dari beberapa pilihan di bawah ini",
    subtitle: "Boleh pilih lebih dari 1 — pilih semua yang menarik hatimu.",
    displayStyle: "photo",
    selectMode: "multi",
    options: [
      {
        id: "skandinavian",
        label: "Skandinavian",
        desc: "Bukaan jendela besar, warna putih bersih, dan sentuhan kayu terang menenangkan.",
        icon: "🏡",
        palette: ["#F1F5F9", "#64748B"],
        image: "assets/gaya-skandinavian.jpg"
      },
      {
        id: "modern_minimalis",
        label: "Modern Minimalis",
        desc: "Bentuk kotak tegas rapi, atap datar, dan kaca lebar tanpa hiasan rumit.",
        icon: "🏢",
        palette: ["#E2E8F0", "#334155"],
        image: "assets/gaya-modern-minimalis.jpg"
      },
      {
        id: "mediterania",
        label: "Mediterania",
        desc: "Nuansa hangat ala rumah Eropa — krem/terracotta dengan lengkungan pintu-jendela.",
        icon: "🏛️",
        palette: ["#FED7AA", "#C2410C"],
        image: "assets/gaya-mediterania.jpg"
      },
      {
        id: "tropical_modern",
        label: "Tropical Modern",
        desc: "Atap miring lebar peneduh hujan dan panas, asri dengan tanaman hijau.",
        icon: "🌴",
        palette: ["#DCFCE7", "#15803D"],
        image: "assets/gaya-tropical-modern.jpg"
      },
      {
        id: "tradisional_vernakular",
        label: "Tradisional Vernakular",
        desc: "Atap khas nusantara seperti joglo atau limasan dengan kayu berjiwa akrab.",
        icon: "🛖",
        palette: ["#FEF3C7", "#92400E"],
        image: "assets/gaya-tradisional-vernakular.jpg"
      },
      {
        id: "dutch_klasik",
        label: "Dutch Klasik",
        desc: "Jendela tinggi simetris, plafon menjulang sejuk, dan wibawa megah zaman dulu.",
        icon: "🏰",
        palette: ["#F3E8FF", "#581C87"],
        image: "assets/gaya-dutch-klasik.jpg"
      },
      {
        id: "japandi",
        label: "Japandi",
        desc: "Garis rendah hening, perpaduan kayu alami Jepang dan kepraktisan Skandinavia.",
        icon: "🎋",
        palette: ["#F5EBE0", "#8D6E63"],
        image: "assets/gaya-japandi.jpg"
      },
      {
        id: "american_farmhouse",
        label: "American Farmhouse",
        desc: "Beranda santai luas, dinding papan putih, dan suasana akrab pedesaan bersahabat.",
        icon: "🌾",
        palette: ["#FEF08A", "#854D0E"],
        image: "assets/gaya-american-farmhouse.jpg"
      },
      {
        id: "industrial",
        label: "Industrial",
        desc: "Dinding bata merah, beton ekspos, dan aksen besi hitam berkarakter tegas.",
        icon: "⚙️",
        palette: ["#CBD5E1", "#1E293B"],
        image: "assets/gaya-industrial.jpg"
      }
    ]
  },
  {
    id: "suasana",
    number: 2,
    title: "Saat pulang ke rumah ini, suasana apa yang ingin kamu rasakan?",
    subtitle: "Pilih suasana hati yang paling kamu harapkan saat tiba di rumah.",
    displayStyle: "photo",
    selectMode: "multi",
    options: [
      {
        id: "suasana_tenang",
        label: "Tenang",
        desc: "Suasana hening, bebas bising, menyejukkan pikiran sehabis seharian beraktivitas.",
        icon: "🕊️",
        palette: ["#E0F2FE", "#0284C7"],
        image: "assets/suasana-tenang.jpg"
      },
      {
        id: "suasana_hangat",
        label: "Hangat",
        desc: "Akrab dan nyaman, mengundang obrolan santai bersama orang-orang tercinta.",
        icon: "☕",
        palette: ["#FFEDD5", "#D97706"],
        image: "assets/suasana-hangat.jpg"
      },
      {
        id: "suasana_natural",
        label: "Natural",
        desc: "Menyatu dengan alam, penuh angin sepoi dan kehijauan yang menyegarkan.",
        icon: "🌿",
        palette: ["#DCFCE7", "#16A34A"],
        image: "assets/suasana-natural.jpg"
      },
      {
        id: "suasana_ceria",
        label: "Ceria",
        desc: "Penuh energi positif, terang, dan menyenangkan untuk tumbuh kembang keluarga.",
        icon: "☀️",
        palette: ["#FEF9C3", "#CA8A04"],
        image: "assets/suasana-ceria.jpg"
      },
      {
        id: "suasana_lapang",
        label: "Lapang",
        desc: "Terbuka lega tanpa sekat berlebih, nafas lega dan pandangan luas bebas.",
        icon: "🪁",
        palette: ["#F1F5F9", "#475569"],
        image: "assets/suasana-lapang.jpg"
      }
    ]
  },
  {
    id: "ruang",
    number: 3,
    title: "Ruang apa saja yang kamu bayangkan ada di rumah ini?",
    subtitle: "Pilih semua ruangan yang kamu idamkan untuk kegiatan sehari-hari.",
    displayStyle: "photo",
    selectMode: "multi",
    hasExtraNote: true,
    extraNoteLabel: "Ada detail tambahan soal ruang di atas? (opsional)",
    extraNotePlaceholder: "Contoh: 2 kamar besar beserta kamar mandi dalam, toilet khusus tamu, ruang tamu harus besar, dll.",
    options: [
      { id: "ruang_keluarga", label: "Ruang Keluarga", desc: "Pusat santai kumpul bersama keluarga.", icon: "🛋️", palette: ["#FCE7F3", "#BE185D"], image: "assets/ruang-keluarga.jpg" },
      { id: "open_kitchen", label: "Open Kitchen", desc: "Dapur terbuka menyatu dengan ruang santai.", icon: "🍳", palette: ["#FFEDD5", "#EA580C"], image: "assets/open-kitchen.jpg" },
      { id: "ruang_kerja", label: "Ruang Kerja", desc: "Area fokus bekerja atau belajar di rumah.", icon: "💻", palette: ["#E0E7FF", "#4338CA"], image: "assets/ruang-kerja.jpg" },
      { id: "taman", label: "Taman", desc: "Area hijau rumput dan tanaman penyegar mata.", icon: "🌳", palette: ["#DCFCE7", "#15803D"], image: "assets/taman.jpg" },
      { id: "kolam_renang", label: "Kolam Renang", desc: "Kolam pribadi untuk berenang dan relaksasi.", icon: "🏊", palette: ["#CFFAFE", "#0891B2"], image: "assets/kolam-renang.jpg" },
      { id: "ruang_ibadah", label: "Ruang Ibadah", desc: "Sudut khusus hening untuk beribadah dan berdoa.", icon: "🤲", palette: ["#FEF3C7", "#B45309"], image: "assets/ruang-ibadah.jpg" },
      { id: "kamar_utama", label: "Kamar Utama", desc: "Kamar tidur utama yang lega dan tenang.", icon: "🛏️", palette: ["#EDE9FE", "#6D28D9"], image: "assets/kamar-utama.jpg" },
      { id: "kamar_mandi", label: "Kamar Mandi", desc: "Kamar mandi bersih dengan shower/bathtub nyaman.", icon: "🚿", palette: ["#E0F2FE", "#0284C7"], image: "assets/kamar-mandi.jpg" },
      { id: "teras", label: "Teras", desc: "Tempat duduk santai menikmati semilir angin sore.", icon: "🪑", palette: ["#FEE2E2", "#B91C1C"], image: "assets/teras.jpg" },
      { id: "garasi", label: "Garasi", desc: "Area terlindung untuk parkir mobil dan motor.", icon: "🚗", palette: ["#E2E8F0", "#475569"], image: "assets/garasi.jpg" },
      { id: "tempat_gym", label: "Tempat Olahraga / Gym", desc: "Area berolahraga ringan atau latihan beban.", icon: "🏋️", palette: ["#F3E8FF", "#7E22CE"], image: "assets/tempat-gym.jpg" },
      { id: "ruang_tamu", label: "Ruang Tamu", desc: "Area penerima formal bagi tamu berkunjung.", icon: "🫖", palette: ["#FEF9C3", "#A16207"], image: "assets/ruang-tamu.jpg" },
      { id: "foyer", label: "Foyer", desc: "Area transisi cantik persis setelah pintu utama.", icon: "🚪", palette: ["#F1F5F9", "#334155"], image: "assets/foyer.jpg" },
      { id: "balkon", label: "Balkon", desc: "Balkon lantai atas menghadap pemandangan luar.", icon: "🪴", palette: ["#DCFCE7", "#059669"], image: "assets/balkon.jpg" },
      { id: "basement", label: "Basement", desc: "Lantai bawah tanah untuk parkir atau ruang privat.", icon: "🪜", palette: ["#CBD5E1", "#334155"], image: "assets/basement.jpg" },
      { id: "vertical_garden", label: "Vertical Garden", desc: "Taman dinding hijau vertikal hemat lahan.", icon: "🌱", palette: ["#D1FAE5", "#047857"], image: "assets/vertical-garden.jpg" },
      { id: "kamar_tamu", label: "Kamar Tamu", desc: "Kamar tidur ramah bagi kerabat yang menginap.", icon: "🧳", palette: ["#FAE8FF", "#A21CAF"], image: "assets/kamar-tamu.jpg" },
      { id: "janitor", label: "Janitor", desc: "Ruang cuci pakaian, jemuran, dan alat bersih.", icon: "🧹", palette: ["#E2E8F0", "#64748B"], image: "assets/janitor.jpg" },
      { id: "pagar", label: "Pagar", desc: "Pagar pembatas pengaman keliling rumah.", icon: "🧱", palette: ["#FDE68A", "#B45309"], image: "assets/pagar.jpg" },
      { id: "kanopi", label: "Kanopi", desc: "Atap peneduh tambahan untuk carport atau teras.", icon: "☂️", palette: ["#E0E7FF", "#3730A3"], image: "assets/kanopi.jpg" },
      { id: "gudang", label: "Gudang", desc: "Tempat penyimpanan barang rapi dan tertutup.", icon: "📦", palette: ["#FEF3C7", "#92400E"], image: "assets/gudang.jpg" },
      { id: "gazebo", label: "Gazebo", desc: "Paviliun kecil terbuka di area taman.", icon: "🛖", palette: ["#FFEDD5", "#C2410C"], image: "assets/gazebo.jpg" },
      { id: "aula_pertemuan", label: "Aula Pertemuan", desc: "Ruang serbaguna luas untuk acara keluarga besar.", icon: "👥", palette: ["#EDE9FE", "#5B21B6"], image: "assets/aula-pertemuan.jpg" }
    ]
  },
  {
    id: "pencahayaan",
    number: 4,
    title: "Bagaimana cahaya yang kamu inginkan masuk ke rumah?",
    subtitle: "Pilih cara pencahayaan alami dan buatan yang paling kamu sukai.",
    displayStyle: "photo",
    selectMode: "multi",
    options: [
      {
        id: "cahaya_jendela_besar",
        label: "Jendela Besar",
        desc: "Bukaan kaca lebar dari lantai ke plafon yang memasukkan terang matahari alami.",
        icon: "🪟",
        palette: ["#FEF9C3", "#EAB308"],
        image: "assets/cahaya-jendela-besar.jpg"
      },
      {
        id: "cahaya_skylight",
        label: "Skylight",
        desc: "Kaca atap tembus pandang yang menyinari bagian tengah rumah dari atas.",
        icon: "✨",
        palette: ["#E0F2FE", "#38BDF8"],
        image: "assets/cahaya-skylight.jpg"
      },
      {
        id: "cahaya_lampu_hangat",
        label: "Lampu Hangat di Malam Hari",
        desc: "Pendar cahaya temaram kekuningan yang lembut dan menenangkan mata saat santai.",
        icon: "💡",
        palette: ["#FED7AA", "#EA580C"],
        image: "assets/cahaya-lampu-hangat.jpg"
      },
      {
        id: "cahaya_lampu_sorot",
        label: "Lampu Sorot",
        desc: "Lampu aksen terarah (spotlight) untuk menonjolkan tekstur dinding dan karya seni.",
        icon: "🔦",
        palette: ["#E2E8F0", "#475569"],
        image: "assets/cahaya-lampu-sorot.jpg"
      },
      {
        id: "cahaya_courtyard",
        label: "Area Courtyard",
        desc: "Taman terbuka di tengah rumah tempat berkumpulnya cahaya dan udara segar alami.",
        icon: "🌿",
        palette: ["#DCFCE7", "#16A34A"],
        image: "assets/cahaya-courtyard.jpg"
      },
      {
        id: "cahaya_void",
        label: "Void",
        desc: "Bukaan plafon tinggi antar-lantai yang mengalirkan cahaya vertikal ke lantai bawah.",
        icon: "🏛️",
        palette: ["#F1F5F9", "#64748B"],
        image: "assets/cahaya-void.jpg"
      }
    ]
  },
  {
    id: "warna",
    number: 5,
    title: "Nuansa warna apa yang paling kamu suka untuk rumahmu?",
    subtitle: "Pilih satu yang paling mewakili seleramu.",
    displayStyle: "chip",
    selectMode: "single",
    options: [
      { id: "warna_earth_tone", label: "Earth Tone 🟤", desc: "Cokelat tanah, terracotta, krem pasir hangat." },
      { id: "warna_clean_tone", label: "Clean Tone ⬜", desc: "Putih bersih, off-white, terang dan lapang." },
      { id: "warna_fun_color", label: "Fun Color 🌈", desc: "Aksen ceria, kuning cerah, toska, terakota hidup." },
      { id: "warna_warm_natural", label: "Warm Natural 🪵", desc: "Warna serat kayu, jerami, dan bambu hangat." },
      { id: "warna_monokrom", label: "Monokrom ⚫", desc: "Hitam, putih, kontras tegas dan minimalis." },
      { id: "warna_pastel", label: "Pastel 🩷", desc: "Lembut, pink salem, baby blue, mint menenangkan." },
      { id: "warna_abu", label: "Abu-abu 🩶", desc: "Abu muda lembut hingga abu semen modern." },
      { id: "warna_cold_natural", label: "Cold Natural 🌿", desc: "Hijau lumut, sage green, zaitun teduh alami." },
      { id: "warna_sky_tone", label: "Sky Tone 🩵", desc: "Biru langit cerah, berangin pantai segar." },
      { id: "warna_industrial_tone", label: "Industrial Tone 🏭", desc: "Bata merah, semen bakar, abu arang berkarakter." }
    ]
  },
  {
    id: "material",
    number: 6,
    title: "Material apa yang paling menarik untuk dilihat dan disentuh?",
    subtitle: "Boleh pilih beberapa material yang ingin kamu hadirkan di dinding, lantai, atau aksen.",
    displayStyle: "photo",
    selectMode: "multi",
    options: [
      {
        id: "mat_kayu",
        label: "Kayu",
        desc: "Serat alami yang ramah disentuh dan memberi kehangatan ruangan abadi.",
        icon: "🪵",
        palette: ["#FEF3C7", "#B45309"],
        image: "assets/mat-kayu.jpg"
      },
      {
        id: "mat_batu_alam",
        label: "Batu Alam",
        desc: "Tekstur kokoh, adem, dan menghadirkan nuansa resort di hunian.",
        icon: "🪨",
        palette: ["#E2E8F0", "#475569"],
        image: "assets/mat-batu-alam.jpg"
      },
      {
        id: "mat_kaca",
        label: "Kaca",
        desc: "Transparan bersih, menghubungkan pandangan ke luar tanpa batas visual.",
        icon: "🪟",
        palette: ["#E0F2FE", "#0284C7"],
        image: "assets/mat-kaca.jpg"
      },
      {
        id: "mat_beton_ekspos",
        label: "Beton Ekspos",
        desc: "Permukaan acian semen halus yang modern, kokoh, dan berkarakter kuat.",
        icon: "🧱",
        palette: ["#CBD5E1", "#334155"],
        image: "assets/mat-beton-ekspos.jpg"
      },
      {
        id: "mat_bata_ekspos",
        label: "Bata Ekspos",
        desc: "Susunan bata merah hangat yang rustic, jujur, dan berjiwa klasik.",
        icon: "🧱",
        palette: ["#FEE2E2", "#B91C1C"],
        image: "assets/mat-bata-ekspos.jpg"
      },
      {
        id: "mat_metal_aksen",
        label: "Metal Aksen",
        desc: "Garis besi dan baja hitam yang presisi, ramping, dan modern.",
        icon: "🔩",
        palette: ["#94A3B8", "#1E293B"],
        image: "assets/mat-metal-aksen.jpg"
      },
      {
        id: "mat_rotan_bambu",
        label: "Rotan / Bambu",
        desc: "Anyaman alami yang luwes, ramah lingkungan, dan sarat sentuhan lokal.",
        icon: "🎋",
        palette: ["#FEF9C3", "#CA8A04"],
        image: "assets/mat-rotan-bambu.jpg"
      },
      {
        id: "mat_marmer",
        label: "Marmer",
        desc: "Guratan batu mewah berkilau yang anggun, sejuk, dan berkelas tinggi.",
        icon: "🏛️",
        palette: ["#F1F5F9", "#475569"],
        image: "assets/mat-marmer.jpg"
      },
      {
        id: "mat_tembok_biasa",
        label: "Tembok Biasa",
        desc: "Dinding plester cat halus yang simpel, bersih, dan mudah dirawat.",
        icon: "🏠",
        palette: ["#F8FAFC", "#64748B"],
        image: "assets/mat-tembok-biasa.jpg"
      }
    ]
  },
  {
    id: "ventilasi",
    number: 7,
    title: "Bagaimana udara dan sirkulasi di dalam rumah yang kamu inginkan?",
    subtitle: "Pilih cara mengalirkan udara sejuk agar rumah tidak terasa pengap.",
    displayStyle: "photo",
    selectMode: "multi",
    options: [
      {
        id: "vent_banyak_jendela",
        label: "Banyak Jendela",
        desc: "Bukaan di setiap sisi ruangan agar angin mengalir bebas dari berbagai penjuru.",
        icon: "🌬️",
        palette: ["#E0F2FE", "#0284C7"],
        image: "assets/vent-banyak-jendela.jpg"
      },
      {
        id: "vent_boven",
        label: "Boven",
        desc: "Lubang angin atas berpola untuk sirkulasi udara konstan meski jendela tertutup.",
        icon: "▦",
        palette: ["#FEF3C7", "#D97706"],
        image: "assets/vent-boven.jpg"
      },
      {
        id: "vent_full_ac",
        label: "Full AC",
        desc: "Pengondisian suhu terkontrol sejuk dan stabil di seluruh area utama rumah.",
        icon: "❄️",
        palette: ["#CFFAFE", "#0891B2"],
        image: "assets/vent-full-ac.jpg"
      },
      {
        id: "vent_exhaust_fan",
        label: "Exhaust Fan",
        desc: "Penyedot udara aktif untuk dapur dan toilet agar ruangan selalu segar.",
        icon: "🌀",
        palette: ["#F1F5F9", "#475569"],
        image: "assets/vent-exhaust-fan.jpg"
      },
      {
        id: "vent_void",
        label: "Void",
        desc: "Cerobong udara vertikal tinggi tempat udara panas naik dan keluar rumah.",
        icon: "🪜",
        palette: ["#F3E8FF", "#7E22CE"],
        image: "assets/vent-void.jpg"
      },
      {
        id: "vent_courtyard_tengah",
        label: "Courtyard Tengah",
        desc: "Taman terbuka dalam rumah sebagai paru-paru sirkulasi angin segar alami.",
        icon: "🌳",
        palette: ["#DCFCE7", "#15803D"],
        image: "assets/vent-courtyard-tengah.jpg"
      },
      {
        id: "vent_jendela_panorama",
        label: "Jendela Panorama",
        desc: "Kaca lebar menghadap view terbaik yang dapat dibuka penuh saat cuaca sejuk.",
        icon: "🖼️",
        palette: ["#E0E7FF", "#4338CA"],
        image: "assets/vent-jendela-panorama.jpg"
      }
    ]
  },
  {
    id: "penghuni",
    number: 8,
    title: "Siapa saja yang akan tinggal atau sering berkunjung ke rumah ini?",
    subtitle: "Boleh pilih lebih dari 1.",
    displayStyle: "chip",
    selectMode: "multi",
    options: [
      { id: "penghuni_anak_laki", label: "Anak Kecil Laki-laki 👦" },
      { id: "penghuni_anak_perempuan", label: "Anak Kecil Perempuan 👧" },
      { id: "penghuni_ibu", label: "Seorang Ibu 👩" },
      { id: "penghuni_ayah", label: "Seorang Ayah 👨" },
      { id: "penghuni_istri", label: "Seorang Istri 👰‍♀️" },
      { id: "penghuni_suami", label: "Seorang Suami 🤵" },
      { id: "penghuni_bayi", label: "Bayi 👶" },
      { id: "penghuni_kakek", label: "Kakek 👴" },
      { id: "penghuni_nenek", label: "Nenek 👵" },
      { id: "penghuni_tamu_bermalam", label: "Tamu Bermalam 🛌" },
      { id: "penghuni_art", label: "Asisten Rumah Tangga 🧹" },
      { id: "penghuni_babysitter", label: "Baby Sitter 🍼" },
      { id: "penghuni_kucing", label: "Kucing 🐱" },
      { id: "penghuni_anjing", label: "Anjing 🐶" }
    ]
  },
  {
    id: "progres",
    number: 9,
    title: "Sejauh mana persiapanmu saat ini?",
    subtitle: "Pilih satu yang paling sesuai.",
    displayStyle: "chip",
    selectMode: "single",
    options: [
      { id: "prog_belum_ada", label: "Belum Ada Persiapan Sama Sekali 🌱" },
      { id: "prog_sudah_konsep", label: "Sudah Memiliki Konsep dan Gambaran 🗂️" },
      { id: "prog_menabung", label: "Sudah Mulai Menabung 💰" },
      { id: "prog_siap_50", label: "Sudah Siap 50% Uang untuk Pembangunan 📊" },
      { id: "prog_pernah_konsultasi", label: "Sudah Pernah Berkonsultasi dengan Arsitek 🗣️" },
      { id: "prog_siap_100", label: "Sudah 100% Siap Uang, Tinggal Mencari Arsitek ✅" }
    ]
  },
  {
    id: "dihindari",
    number: 10,
    title: "Hal apa yang ingin kamu hindari di rumah impianmu?",
    subtitle: "Pilih maksimal 5 dari 7 hal di bawah ini.",
    displayStyle: "photo",
    selectMode: "multi",
    maxSelect: 5,
    options: [
      {
        id: "hindar_sempit",
        label: "Terasa Sempit",
        desc: "Ruangan terasa sumpek, plafon rendah, dan sesak akibat penataan kurang lega.",
        icon: "📦",
        palette: ["#FEE2E2", "#DC2626"],
        image: "assets/hindar-sempit.jpg"
      },
      {
        id: "hindar_panas",
        label: "Terlalu Panas",
        desc: "Hawa panas menyengat siang hari dan kurang angin sepoi yang lewat.",
        icon: "🔥",
        palette: ["#FFEDD5", "#EA580C"],
        image: "assets/hindar-panas.jpg"
      },
      {
        id: "hindar_kurang_privasi",
        label: "Kurang Privasi",
        desc: "Pandangan orang luar mudah melihat ke dalam rumah atau kamar keluarga.",
        icon: "👀",
        palette: ["#FEF3C7", "#D97706"],
        image: "assets/hindar-kurang-privasi.jpg"
      },
      {
        id: "hindar_formal",
        label: "Terlalu Formal",
        desc: "Kesan kaku seperti gedung kantor yang membuat anggota keluarga canggung santai.",
        icon: "👔",
        palette: ["#E2E8F0", "#475569"],
        image: "assets/hindar-formal.jpg"
      },
      {
        id: "hindar_boros_energi",
        label: "Boros Energi",
        desc: "Lampu harus menyala seharian atau AC harus hidup nonstop karena rumah gelap dan panas.",
        icon: "⚡",
        palette: ["#FEF08A", "#CA8A04"],
        image: "assets/hindar-boros-energi.jpg"
      },
      {
        id: "hindar_perawatan_ribet",
        label: "Perawatan Ribet",
        desc: "Material yang cepat kotor, mudah berjamur, atau butuh dipoles terus-menerus.",
        icon: "🧽",
        palette: ["#EDE9FE", "#7C3AED"],
        image: "assets/hindar-perawatan-ribet.jpg"
      },
      {
        id: "hindar_budget_mahal",
        label: "Budget Mahal",
        desc: "Biaya pembangunan membengkak tak terduga melebihi rencana dana yang ada.",
        icon: "💸",
        palette: ["#FCE7F3", "#DB2777"],
        image: "assets/hindar-budget-mahal.jpg"
      }
    ]
  }
];

const LAND_SIZE_QUESTION = {
  id: "ukuran_lahan",
  eyebrow: "Satu Hal Lagi — Ini Penting",
  title: "Berapa perkiraan ukuran lahan dan/atau bangunan yang akan dibangun?",
  subtitle: "Opsional — tapi sangat disarankan diisi dengan benar",
  placeholder: "Contoh: Tanah 120 m² (8 x 15 m), rencana bangunan 2 lantai sekitar 150 m²"
};
