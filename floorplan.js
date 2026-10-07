/**
 * Rumah Masa Depan - Architectural Floor Plan Generator
 * Menghasilkan denah 2D arsitektur proporsional berbasis standar rumah layak huni (SNI 03-1733),
 * dengan pembagian zonasi ruang, bukaan cahaya alami, ventilasi silang, dan kop gambar profesional.
 */

const FloorPlanEngine = {
  /**
   * Menganalisis parameter lahan dan kebutuhan ruang pengguna
   */
  analyzeRequirements(answers, landSizeText, extraNotes) {
    const rawLand = (landSizeText || '').toLowerCase();
    
    // Deteksi kebutuhan 2 lantai
    const isTwoStories = rawLand.includes('2 lantai') || 
      rawLand.includes('dua lantai') || 
      (answers.ruang && (answers.ruang.includes('balkon') || answers.ruang.includes('aula_pertemuan') || answers.ruang.includes('basement')));

    // Perkiraan dimensi tanah (lebar x panjang)
    let widthM = 8;
    let lengthM = 15;

    const dimMatch = rawLand.match(/(\d+(?:[.,]\d+)?)\s*[xX*]\s*(\d+(?:[.,]\d+)?)/);
    if (dimMatch) {
      const w = parseFloat(dimMatch[1].replace(',', '.'));
      const l = parseFloat(dimMatch[2].replace(',', '.'));
      if (w >= 5 && w <= 25 && l >= 8 && l <= 40) {
        widthM = Math.min(w, l);
        lengthM = Math.max(w, l);
      }
    } else {
      const areaMatch = rawLand.match(/(\d+)\s*m/);
      if (areaMatch) {
        const area = parseInt(areaMatch[1], 10);
        if (area <= 72) { widthM = 6; lengthM = 12; }
        else if (area <= 100) { widthM = 7; lengthM = 14; }
        else if (area <= 140) { widthM = 8; lengthM = 15; }
        else if (area <= 200) { widthM = 10; lengthM = 18; }
        else { widthM = 12; lengthM = 20; }
      }
    }

    const selectedRooms = answers.ruang || [];
    const hasPool = selectedRooms.includes('kolam_renang');
    const hasStudy = selectedRooms.includes('ruang_kerja');
    const hasWorship = selectedRooms.includes('ruang_ibadah');
    const hasGym = selectedRooms.includes('tempat_gym');
    const hasFoyer = selectedRooms.includes('foyer');
    const hasGuestRoom = selectedRooms.includes('kamar_tamu');
    const hasGarage = selectedRooms.includes('garasi');

    return {
      widthM,
      lengthM,
      isTwoStories,
      hasPool,
      hasStudy,
      hasWorship,
      hasGym,
      hasFoyer,
      hasGuestRoom,
      hasGarage,
      selectedRooms
    };
  },

  /**
   * Menghasilkan SVG Denah Arsitektural CAD Blueprint Lantai 1 & Lantai 2
   */
  generateFloorPlanSvg(params, floorLevel = 1) {
    const { widthM, lengthM, isTwoStories, hasPool, hasStudy, hasWorship, hasGym, hasFoyer, hasGuestRoom, hasGarage } = params;

    // ViewBox: 800 x 1050 (Format Lembar Kerja Arsitektur Vertikal)
    const svgW = 800;
    const svgH = 1050;

    // Area gambar denah (Canvas utama di tengah lembar kop)
    const planX = 90;
    const planY = 130;
    const planW = 620;
    const planH = 720;

    // Hitung perkiraan luas tanah dan bangunan
    const luasTanah = widthM * lengthM;
    const luasBangunan = Math.round(isTwoStories ? luasTanah * 1.25 : luasTanah * 0.65);

    if (floorLevel === 2 && isTwoStories) {
      return this.renderSecondFloorSvg({ svgW, svgH, planX, planY, planW, planH, widthM, lengthM, luasTanah, luasBangunan, hasStudy, hasGym });
    }

    return this.renderFirstFloorSvg({ svgW, svgH, planX, planY, planW, planH, widthM, lengthM, luasTanah, luasBangunan, hasPool, hasStudy, hasWorship, hasFoyer, hasGuestRoom, hasGarage, isTwoStories });
  },

  /**
   * Render Denah Lantai 1 (Ground Floor)
   */
  renderFirstFloorSvg(opts) {
    const { svgW, svgH, planX, planY, planW, planH, widthM, lengthM, luasTanah, luasBangunan, hasPool, hasStudy, hasWorship, hasFoyer, hasGarage, isTwoStories } = opts;

    return `
      <svg viewBox="0 0 ${svgW} ${svgH}" class="cad-floorplan-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Denah Arsitektur Lantai 1">
        <defs>
          <!-- Grid Pattern Arsitektur Blueprint -->
          <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>
          </pattern>
          <!-- Grass Pattern -->
          <pattern id="cad-grass" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#15803D" opacity="0.3"/>
            <circle cx="9" cy="9" r="1.5" fill="#15803D" opacity="0.3"/>
          </pattern>
          <!-- Paver Carport Pattern -->
          <pattern id="cad-paver" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#F1F5F9"/>
            <path d="M 0 0 L 16 0 16 16 0 16 Z" fill="none" stroke="#CBD5E1" stroke-width="0.8"/>
          </pattern>
          <!-- Wet Area Tile Pattern -->
          <pattern id="cad-tile" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#E0F2FE"/>
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#93C5FD" stroke-width="0.75"/>
          </pattern>
          <!-- Pool Water Pattern -->
          <linearGradient id="pool-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="100%" stop-color="#0284C7"/>
          </linearGradient>
        </defs>

        <!-- Kertas Gambar Putih Bersih -->
        <rect width="${svgW}" height="${svgH}" fill="#FFFFFF"/>
        <!-- Background Grid CAD -->
        <rect x="${planX}" y="${planY}" width="${planW}" height="${planH}" fill="url(#cad-grid)"/>

        <!-- BORDER DOKUMEN ARSITEKTUR KOP -->
        <rect x="25" y="25" width="750" height="1000" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <rect x="30" y="30" width="740" height="990" fill="none" stroke="#64748B" stroke-width="1"/>

        <!-- HEADER KOP GAMBAR STUDIO LENTERA -->
        <g id="title-block-header">
          <!-- Logo Studio Lentera Mark -->
          <g transform="translate(48, 44) scale(0.36)">
            <path d="M 28 8 L 82 8 L 104 68 L 74 100 L 74 132 L 96 150 L 14 150 L 36 132 L 36 100 L 6 68 Z" fill="none" stroke="#914C35" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="M 38 100 L 55 80 L 72 100" fill="none" stroke="#914C35" stroke-width="11" stroke-linejoin="round"/>
            <path d="M 50 148 L 50 128 A 5 5 0 0 1 60 128 L 60 148" fill="none" stroke="#914C35" stroke-width="9"/>
            <path d="M 44 26 L 66 26 L 76 68 L 55 92 L 34 68 Z" fill="none" stroke="#914C35" stroke-width="10" stroke-linejoin="round"/>
          </g>
          
          <text x="96" y="58" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="0.1em" fill="#914C35">STUDIO LENTERA • ARSITEKTUR &amp; PERENCANAAN</text>
          <text x="96" y="80" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" font-weight="800" fill="#1E293B">RUMAH MASA DEPAN</text>
          <text x="96" y="98" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="600" fill="#35653E">SKEMA PEMBAGIAN RUANG &amp; DENAH LAYAK HUNI (SNI 03-1733)</text>
          
          <!-- Indikator Skala & Tanggal -->
          <text x="600" y="65" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">SKALA: 1 : 100</text>
          <text x="600" y="82" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">LUAS TANAH: ${luasTanah} m² (${widthM}x${lengthM} m)</text>
          <text x="600" y="99" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">ESTIMASI BANGUNAN: ±${luasBangunan} m²</text>

          <!-- Arah Mata Angin (Kompas Utara) -->
          <g transform="translate(520, 52)">
            <circle cx="25" cy="25" r="22" fill="#F8FAFC" stroke="#334155" stroke-width="1.2"/>
            <polygon points="25,7 20,25 25,22 30,25" fill="#DC2626"/>
            <polygon points="25,43 20,25 25,22 30,25" fill="#475569"/>
            <text x="25" y="5" font-size="9" font-weight="800" text-anchor="middle" fill="#DC2626">U</text>
          </g>
          <line x1="30" y1="112" x2="770" y2="112" stroke="#1E293B" stroke-width="1.5"/>
        </g>

        <!-- DENAH LANTAI 1 (ZONASI RUANG PROPORSIONAL) -->
        <g id="plan-first-floor" transform="translate(0, 0)">
          
          <!-- GARIS BATAS TANAH (BOUNDARY LINE) -->
          <rect x="${planX}" y="${planY}" width="${planW}" height="${planH}" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>

          <!-- 1. ZONA DEPAN (Y: 130 -> 330) -->
          <!-- Taman Depan (Kiri) -->
          <rect x="${planX}" y="${planY}" width="300" height="190" fill="url(#cad-grass)"/>
          <text x="${planX + 150}" y="${planY + 95}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#166534">TAMAN DEPAN</text>
          <text x="${planX + 150}" y="${planY + 115}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#15803D">RTH Sejuk • ±${(widthM*0.48*4).toFixed(1)} m²</text>

          <!-- Carport / Garasi (Kanan) -->
          <rect x="${planX + 300}" y="${planY}" width="320" height="220" fill="url(#cad-paver)"/>
          <text x="${planX + 460}" y="${planY + 100}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#334155">${hasGarage ? 'GARASI MOBIL' : 'CARPORT UTAMA'}</text>
          <text x="${planX + 460}" y="${planY + 120}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#64748B">-0.05 • 3.2 x 5.0 m</text>
          <!-- Gambar mobil sederhana -->
          <rect x="${planX + 400}" y="${planY + 40}" width="120" height="140" rx="20" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
          <rect x="${planX + 420}" y="${planY + 65}" width="80" height="40" rx="6" fill="#CBD5E1" opacity="0.6"/>

          <!-- Teras Depan -->
          <rect x="${planX + 130}" y="${planY + 190}" width="170" height="50" fill="#F8FAFC" stroke="#475569" stroke-width="1.5"/>
          <text x="${planX + 215}" y="${planY + 220}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#1E293B">TERAS DEPAN (+0.05)</text>

          <!-- 2. ZONA TENGAH (SEMI-PUBLIK & SERVIS) (Y: 240 -> 540) -->
          <!-- Foyer / Ruang Tamu -->
          <rect x="${planX}" y="${planY + 190}" width="130" height="150" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 65}" y="${planY + 265}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0F172A">${hasFoyer ? 'FOYER / PENERIMA' : 'RUANG TAMU'}</text>
          <text x="${planX + 65}" y="${planY + 285}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">±0.00 • 2.5 x 3.0 m</text>

          <!-- Ruang Keluarga (Living Room) - Jantung Rumah -->
          <rect x="${planX + 130}" y="${planY + 240}" width="290" height="190" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 275}" y="${planY + 330}" font-family="system-ui" font-size="14" font-weight="800" text-anchor="middle" fill="#3E5C50">RUANG KELUARGA</text>
          <text x="${planX + 275}" y="${planY + 352}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#64748B">Area Santai & Kumpul • ±0.00 • 4.0 x 4.5 m</text>
          <!-- Sofa & Meja Simbol -->
          <rect x="${planX + 160}" y="${planY + 290}" width="40" height="90" rx="4" fill="#E2E8F0"/>
          <rect x="${planX + 210}" y="${planY + 310}" width="30" height="50" rx="3" fill="#CBD5E1"/>

          <!-- Open Kitchen & Ruang Makan -->
          <rect x="${planX + 420}" y="${planY + 220}" width="200" height="170" fill="#FFFDF9" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 520}" y="${planY + 300}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#B45309">DAPUR & R. MAKAN</text>
          <text x="${planX + 520}" y="${planY + 320}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">Open Kitchen • 3.2 x 3.5 m</text>
          <!-- Meja Makan & Kitchen Island -->
          <rect x="${planX + 460}" y="${planY + 335}" width="70" height="40" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>

          <!-- Tangga (Jika 2 Lantai) atau Ruang Kerja / Ibadah -->
          <rect x="${planX}" y="${planY + 340}" width="130" height="140" fill="#F8FAFC" stroke="#1E293B" stroke-width="2.5"/>
          ${isTwoStories ? `
            <text x="${planX + 65}" y="${planY + 395}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0F172A">AREA TANGGA</text>
            <text x="${planX + 65}" y="${planY + 415}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">Akses ke Lantai 2</text>
            <!-- Step lines -->
            <line x1="${planX + 15}" y1="${planY + 425}" x2="${planX + 115}" y2="${planY + 425}" stroke="#94A3B8" stroke-width="1.5"/>
            <line x1="${planX + 15}" y1="${planY + 440}" x2="${planX + 115}" y2="${planY + 440}" stroke="#94A3B8" stroke-width="1.5"/>
            <line x1="${planX + 15}" y1="${planY + 455}" x2="${planX + 115}" y2="${planY + 455}" stroke="#94A3B8" stroke-width="1.5"/>
          ` : `
            <text x="${planX + 65}" y="${planY + 400}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0F172A">${hasStudy ? 'RUANG KERJA' : (hasWorship ? 'R. IBADAH' : 'KAMAR TAMU')}</text>
            <text x="${planX + 65}" y="${planY + 420}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">±0.00 • 2.5 x 3.0 m</text>
          `}

          <!-- Kamar Mandi Umum / Powder Room -->
          <rect x="${planX + 420}" y="${planY + 390}" width="110" height="110" fill="url(#cad-tile)" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 475}" y="${planY + 440}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0369A1">KM / WC</text>
          <text x="${planX + 475}" y="${planY + 458}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#0284C7">-0.05 • 1.6 x 1.8 m</text>

          <!-- Area Janitor / Laundry -->
          <rect x="${planX + 530}" y="${planY + 390}" width="90" height="110" fill="#F1F5F9" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 575}" y="${planY + 440}" font-family="system-ui" font-size="10" font-weight="700" text-anchor="middle" fill="#475569">CUCI / JEMUR</text>
          <text x="${planX + 575}" y="${planY + 458}" font-family="system-ui" font-size="8" text-anchor="middle" fill="#64748B">Servis Basah</text>

          <!-- 3. ZONA BELAKANG (PRIVAT & COURTYARD ALAMI) (Y: 480 -> 720) -->
          <!-- Kamar Tidur Utama (Master Bedroom) + KM Dalam -->
          <rect x="${planX}" y="${planY + 480}" width="260" height="240" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 130}" y="${planY + 580}" font-family="system-ui" font-size="13" font-weight="800" text-anchor="middle" fill="#0F172A">KAMAR UTAMA</text>
          <text x="${planX + 130}" y="${planY + 602}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#64748B">Master Bedroom • ±0.00 • 3.5 x 4.2 m</text>
          <!-- Simbol Tempat Tidur King -->
          <rect x="${planX + 70}" y="${planY + 500}" width="120" height="60" rx="4" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.2"/>
          
          <!-- KM Dalam Master -->
          <rect x="${planX}" y="${planY + 630}" width="100" height="90" fill="url(#cad-tile)" stroke="#1E293B" stroke-width="2"/>
          <text x="${planX + 50}" y="${planY + 675}" font-family="system-ui" font-size="9" font-weight="700" text-anchor="middle" fill="#0369A1">KM DALAM</text>

          <!-- Courtyard Tengah / Taman Belakang (Ventilasi Silang Alami SNI) -->
          <rect x="${planX + 260}" y="${planY + 480}" width="${planW - 260}" height="240" fill="${hasPool ? '#F0F9FF' : 'url(#cad-grass)'}" stroke="#1E293B" stroke-width="2.5"/>
          
          ${hasPool ? `
            <!-- Kolam Renang -->
            <rect x="${planX + 280}" y="${planY + 510}" width="180" height="180" rx="10" fill="url(#pool-grad)" stroke="#0369A1" stroke-width="2"/>
            <text x="${planX + 370}" y="${planY + 605}" font-family="system-ui" font-size="12" font-weight="800" text-anchor="middle" fill="#FFFFFF">KOLAM RENANG</text>
            <text x="${planX + 370}" y="${planY + 625}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#E0F2FE">Private Pool & Deck</text>
            <!-- Deck Santai Samping -->
            <rect x="${planX + 470}" y="${planY + 510}" width="140" height="180" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
            <text x="${planX + 540}" y="${planY + 605}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#92400E">DECK TERAS</text>
          ` : `
            <text x="${planX + 430}" y="${planY + 590}" font-family="system-ui" font-size="14" font-weight="800" text-anchor="middle" fill="#166534">COURTYARD / TAMAN DALAM</text>
            <text x="${planX + 430}" y="${planY + 612}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#15803D">Paru-paru Sirkulasi Udara & Cahaya Alami Bebas Pengap</text>
            <circle cx="${planX + 430}" cy="${planY + 655}" r="22" fill="#22C55E" opacity="0.4"/>
            <circle cx="${planX + 430}" cy="${planY + 655}" r="14" fill="#16A34A" opacity="0.6"/>
          `}

          <!-- BUKAAN PINTU ARSITEKTUR (DOOR SWINGS 90°) -->
          <!-- Pintu Utama Depan -->
          <path d="M ${planX + 160} ${planY + 240} A 35 35 0 0 1 ${planX + 195} ${planY + 275}" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="${planX + 160}" y1="${planY + 240}" x2="${planX + 160}" y2="${planY + 275}" stroke="#1E293B" stroke-width="2.5"/>

          <!-- Pintu Kamar Utama -->
          <path d="M ${planX + 220} ${planY + 480} A 30 30 0 0 0 ${planX + 190} ${planY + 510}" fill="none" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3,3"/>
          <line x1="${planX + 220}" y1="${planY + 480}" x2="${planX + 220}" y2="${planY + 510}" stroke="#1E293B" stroke-width="2.5"/>

          <!-- BUKAAN JENDELA KACA (WINDOW SYMBOLS GANDA) -->
          <line x1="${planX + 30}" y1="${planY + 480}" x2="${planX + 110}" y2="${planY + 480}" stroke="#0284C7" stroke-width="4"/>
          <line x1="${planX + 160}" y1="${planY + 720}" x2="${planX + 240}" y2="${planY + 720}" stroke="#0284C7" stroke-width="4"/>
          <line x1="${planX + 270}" y1="${planY + 430}" x2="${planX + 390}" y2="${planY + 430}" stroke="#0284C7" stroke-width="4"/>

          <!-- SIMBOL KOLOM STRUKTUR BETON (K1 15x15) -->
          ${[
            [planX, planY], [planX + 300, planY], [planX + planW, planY],
            [planX, planY + 190], [planX + 130, planY + 190], [planX + 300, planY + 190], [planX + planW, planY + 220],
            [planX, planY + 240], [planX + 130, planY + 240], [planX + 420, planY + 240], [planX + planW, planY + 390],
            [planX, planY + 480], [planX + 260, planY + 480], [planX + 420, planY + 390], [planX + 420, planY + 500],
            [planX, planY + planH], [planX + 260, planY + planH], [planX + planW, planY + planH]
          ].map(([kx, ky]) => `<rect x="${kx - 4}" y="${ky - 4}" width="8" height="8" fill="#0F172A"/>`).join('')}

          <!-- GARIS DIMENSI ARSITEKTUR UKURAN METER -->
          <!-- Garis Dimensi Sumbu X (Bawah) -->
          <line x1="${planX}" y1="${planY + planH + 25}" x2="${planX + planW}" y2="${planY + planH + 25}" stroke="#475569" stroke-width="1"/>
          <line x1="${planX}" y1="${planY + planH + 18}" x2="${planX}" y2="${planY + planH + 32}" stroke="#475569" stroke-width="1.5"/>
          <line x1="${planX + planW}" y1="${planY + planH + 18}" x2="${planX + planW}" y2="${planY + planH + 32}" stroke="#475569" stroke-width="1.5"/>
          <text x="${planX + planW / 2}" y="${planY + planH + 42}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#1E293B">LEBAR LAHAN: ${widthM}.00 M</text>

          <!-- Garis Dimensi Sumbu Y (Kanan) -->
          <line x1="${planX + planW + 25}" y1="${planY}" x2="${planX + planW + 25}" y2="${planY + planH}" stroke="#475569" stroke-width="1"/>
          <line x1="${planX + planW + 18}" y1="${planY}" x2="${planX + planW + 32}" y2="${planY}" stroke="#475569" stroke-width="1.5"/>
          <line x1="${planX + planW + 18}" y1="${planY + planH}" x2="${planX + planW + 32}" y2="${planY + planH}" stroke="#475569" stroke-width="1.5"/>
          <text x="${planX + planW + 42}" y="${planY + planH / 2}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#1E293B" transform="rotate(90 ${planX + planW + 42} ${planY + planH / 2})">PANJANG LAHAN: ${lengthM}.00 M</text>
        </g>

        <!-- KOP DOKUMEN BAGIAN BAWAH & CATATAN KONSULTASI STUDIO LENTERA -->
        <g id="title-block-footer">
          <rect x="30" y="900" width="740" height="115" fill="#F8FAFC" stroke="#1E293B" stroke-width="1.5"/>
          <line x1="30" y1="940" x2="770" y2="940" stroke="#CBD5E1" stroke-width="1"/>
          
          <!-- Label Judul Lembar -->
          <text x="50" y="928" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#1E293B">DENAH LANTAI 1 (DASAR)</text>
          <text x="600" y="928" font-family="system-ui" font-size="11" font-weight="700" fill="#3E5C50">LEMBAR: AR-01</text>
          
          <!-- Pesan Standar & Rekomendasi Konsultasi Studio Lentera -->
          <text x="50" y="960" font-family="system-ui" font-size="10" font-weight="700" fill="#0F172A">STANDAR KELAYAKAN HUNIAN SEHAT:</text>
          <text x="50" y="976" font-family="system-ui" font-size="9.5" fill="#475569">• Memenuhi rasio pencahayaan alami (min. 15% bukaan kaca) dan ventilasi silang (cross-ventilation).</text>
          <text x="50" y="990" font-family="system-ui" font-size="9.5" fill="#475569">• Zonasi jelas: pemisahan area publik, semi-publik, privat, dan servis basah.</text>
          
          <!-- Rekomendasi Wajib Konsultasi Studio Lentera -->
          <rect x="420" y="948" width="340" height="58" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
          <text x="432" y="966" font-family="system-ui" font-size="9.5" font-weight="700" fill="#92400E">CATATAN PENTING STUDIO LENTERA:</text>
          <text x="432" y="982" font-family="system-ui" font-size="9" fill="#78350F">Alangkah baiknya denah ini dikonsultasikan kepada Studio Lentera</text>
          <text x="432" y="996" font-family="system-ui" font-size="9" font-weight="600" fill="#78350F">untuk membuat yang lebih profesional & detail gambar kerja PBG.</text>
        </g>
      </svg>
    `;
  },

  /**
   * Render Denah Lantai 2 (Upper Floor) jika bangunan 2 lantai
   */
  renderSecondFloorSvg(opts) {
    const { svgW, svgH, planX, planY, planW, planH, widthM, lengthM, luasTanah, luasBangunan, hasStudy, hasGym } = opts;

    return `
      <svg viewBox="0 0 ${svgW} ${svgH}" class="cad-floorplan-svg" xmlns="http://www.w3.org/2000/svg" aria-label="Denah Arsitektur Lantai 2">
        <defs>
          <pattern id="cad-grid-2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.5"/>
          </pattern>
          <pattern id="cad-tile-2" width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill="#E0F2FE"/>
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#93C5FD" stroke-width="0.75"/>
          </pattern>
        </defs>

        <rect width="${svgW}" height="${svgH}" fill="#FFFFFF"/>
        <rect x="${planX}" y="${planY}" width="${planW}" height="${planH}" fill="url(#cad-grid-2)"/>

        <!-- BORDER DOKUMEN -->
        <rect x="25" y="25" width="750" height="1000" fill="none" stroke="#1E293B" stroke-width="2.5"/>
        <rect x="30" y="30" width="740" height="990" fill="none" stroke="#64748B" stroke-width="1"/>

        <!-- HEADER KOP GAMBAR STUDIO LENTERA - LANTAI 2 -->
        <g id="title-block-header-2">
          <!-- Logo Studio Lentera Mark -->
          <g transform="translate(48, 44) scale(0.36)">
            <path d="M 28 8 L 82 8 L 104 68 L 74 100 L 74 132 L 96 150 L 14 150 L 36 132 L 36 100 L 6 68 Z" fill="none" stroke="#914C35" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="M 38 100 L 55 80 L 72 100" fill="none" stroke="#914C35" stroke-width="11" stroke-linejoin="round"/>
            <path d="M 50 148 L 50 128 A 5 5 0 0 1 60 128 L 60 148" fill="none" stroke="#914C35" stroke-width="9"/>
            <path d="M 44 26 L 66 26 L 76 68 L 55 92 L 34 68 Z" fill="none" stroke="#914C35" stroke-width="10" stroke-linejoin="round"/>
          </g>
          
          <text x="96" y="58" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="800" letter-spacing="0.1em" fill="#914C35">STUDIO LENTERA • ARSITEKTUR &amp; PERENCANAAN</text>
          <text x="96" y="80" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="20" font-weight="800" fill="#1E293B">RUMAH MASA DEPAN</text>
          <text x="96" y="98" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="600" fill="#35653E">SKEMA PEMBAGIAN RUANG &amp; DENAH LAYAK HUNI • LANTAI 2</text>
          <text x="600" y="65" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">SKALA: 1 : 100</text>
          <text x="600" y="82" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">LUAS TANAH: ${luasTanah} m²</text>
          <text x="600" y="99" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748B">ESTIMASI TOTAL: ±${luasBangunan} m²</text>
          <line x1="30" y1="112" x2="770" y2="112" stroke="#1E293B" stroke-width="1.5"/>
        </g>

        <!-- DENAH LANTAI 2 -->
        <g id="plan-second-floor">
          <!-- Batas Bangunan Lantai 2 -->
          <rect x="${planX}" y="${planY + 120}" width="${planW}" height="${planH - 120}" fill="#FFFFFF" stroke="#0F172A" stroke-width="3"/>

          <!-- Balkon Depan -->
          <rect x="${planX + 130}" y="${planY + 120}" width="280" height="70" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
          <text x="${planX + 270}" y="${planY + 160}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#92400E">BALKON DEPAN (+3.50)</text>

          <!-- Kamar Anak 1 (Kiri Depan) -->
          <rect x="${planX}" y="${planY + 190}" width="240" height="200" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 120}" y="${planY + 285}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#1E293B">KAMAR ANAK 1</text>
          <text x="${planX + 120}" y="${planY + 305}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">+3.60 • 3.2 x 3.5 m</text>
          <rect x="${planX + 50}" y="${planY + 210}" width="90" height="50" rx="3" fill="#EDE9FE"/>

          <!-- Kamar Anak 2 (Kanan Depan) -->
          <rect x="${planX + 240}" y="${planY + 190}" width="240" height="200" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 360}" y="${planY + 285}" font-family="system-ui" font-size="12" font-weight="700" text-anchor="middle" fill="#1E293B">KAMAR ANAK 2</text>
          <text x="${planX + 360}" y="${planY + 305}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">+3.60 • 3.2 x 3.5 m</text>
          <rect x="${planX + 290}" y="${planY + 210}" width="90" height="50" rx="3" fill="#EDE9FE"/>

          <!-- Void Plafon Tinggi (Membuka ke Lantai 1) -->
          <rect x="${planX + 480}" y="${planY + 190}" width="140" height="200" fill="#F8FAFC" stroke="#334155" stroke-width="2" stroke-dasharray="6,4"/>
          <text x="${planX + 550}" y="${planY + 285}" font-family="system-ui" font-size="11" font-weight="800" text-anchor="middle" fill="#475569">VOID PLAFON</text>
          <text x="${planX + 550}" y="${planY + 305}" font-family="system-ui" font-size="8" text-anchor="middle" fill="#64748B">Sirkulasi Vertikal</text>

          <!-- Ruang Duduk / Area Belajar Lantai 2 -->
          <rect x="${planX + 130}" y="${planY + 390}" width="350" height="150" fill="#FFFFFF" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 305}" y="${planY + 465}" font-family="system-ui" font-size="13" font-weight="800" text-anchor="middle" fill="#3E5C50">RUANG DUDUK / KELUARGA LT. 2</text>
          <text x="${planX + 305}" y="${planY + 485}" font-family="system-ui" font-size="9" text-anchor="middle" fill="#64748B">+3.60 • 4.0 x 4.2 m</text>

          <!-- Tangga Turun -->
          <rect x="${planX}" y="${planY + 390}" width="130" height="150" fill="#F1F5F9" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 65}" y="${planY + 460}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0F172A">TANGGA TURUN</text>

          <!-- Kamar Mandi Lantai 2 -->
          <rect x="${planX + 480}" y="${planY + 390}" width="140" height="150" fill="url(#cad-tile-2)" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + 550}" y="${planY + 465}" font-family="system-ui" font-size="11" font-weight="700" text-anchor="middle" fill="#0369A1">KM / WC LT. 2</text>
          <text x="${planX + 550}" y="${planY + 485}" font-family="system-ui" font-size="8.5" text-anchor="middle" fill="#0284C7">Shower & Sanitair</text>

          <!-- Ruang Hobi / Gym / Kerja atau Ruang Terbuka Hijau Atas -->
          <rect x="${planX}" y="${planY + 540}" width="${planW}" height="${planH - 540}" fill="#F8FAFC" stroke="#1E293B" stroke-width="2.5"/>
          <text x="${planX + planW / 2}" y="${planY + 620}" font-family="system-ui" font-size="14" font-weight="800" text-anchor="middle" fill="#1E293B">${hasGym ? 'AREA GYM & OLAHRAGA' : (hasStudy ? 'STUDIO KERJA / HOBI' : 'ROOFTOP / ROOF GARDEN')}</text>
          <text x="${planX + planW / 2}" y="${planY + 642}" font-family="system-ui" font-size="10" text-anchor="middle" fill="#64748B">Bukaan Luas Menghadap Taman Bawah • Menyejukkan Lantai 2</text>
        </g>

        <!-- FOOTER KOP -->
        <g id="title-block-footer-2">
          <rect x="30" y="900" width="740" height="115" fill="#F8FAFC" stroke="#1E293B" stroke-width="1.5"/>
          <text x="50" y="928" font-family="Georgia, serif" font-size="15" font-weight="700" fill="#1E293B">DENAH LANTAI 2 (ATAS)</text>
          <text x="600" y="928" font-family="system-ui" font-size="11" font-weight="700" fill="#3E5C50">LEMBAR: AR-02</text>
          
          <rect x="420" y="948" width="340" height="58" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
          <text x="432" y="966" font-family="system-ui" font-size="9.5" font-weight="700" fill="#92400E">CATATAN PENTING STUDIO LENTERA:</text>
          <text x="432" y="982" font-family="system-ui" font-size="9" fill="#78350F">Alangkah baiknya denah ini dikonsultasikan kepada Studio Lentera</text>
          <text x="432" y="996" font-family="system-ui" font-size="9" font-weight="600" fill="#78350F">untuk membuat yang lebih profesional & perhitungan struktur bertingkat.</text>
        </g>
      </svg>
    `;
  }
};
