/**
 * House Vision Builder - Art & SVG Generator
 * Menghasilkan ilustrasi fasad arsitektur 4:3 untuk 9 gaya rumah
 * dan ilustrasi bergradien & berkarakter untuk setiap opsi lainnya.
 * 100% lokal tanpa library luar atau koneksi internet.
 */

const ArtEngine = {
  /**
   * Render SVG fasad arsitektur untuk 9 gaya rumah di Pertanyaan 1
   */
  getStyleSvg(styleId) {
    switch (styleId) {
      case "skandinavian":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="skan-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E2E8F0"/>
                <stop offset="100%" stop-color="#F8FAFC"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#skan-sky)"/>
            <!-- Ground -->
            <rect y="240" width="400" height="60" fill="#E2E8F0"/>
            <path d="M0,240 Q200,235 400,240 L400,300 L0,300 Z" fill="#CBD5E1"/>
            <!-- Pine trees background -->
            <polygon points="50,240 70,160 90,240" fill="#94A3B8" opacity="0.6"/>
            <polygon points="320,240 340,150 360,240" fill="#94A3B8" opacity="0.6"/>
            <!-- Chimney -->
            <rect x="255" y="80" width="22" height="60" fill="#64748B"/>
            <rect x="252" y="75" width="28" height="8" rx="2" fill="#475569"/>
            <!-- House Body -->
            <rect x="110" y="130" width="180" height="110" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
            <!-- Steep Gable Roof -->
            <polygon points="200,50 90,140 105,145 200,68 295,145 310,140" fill="#334155"/>
            <polygon points="200,64 105,140 295,140" fill="#475569" opacity="0.2"/>
            <!-- Vertical siding texture -->
            <line x1="130" y1="130" x2="130" y2="240" stroke="#F1F5F9" stroke-width="2"/>
            <line x1="150" y1="130" x2="150" y2="240" stroke="#F1F5F9" stroke-width="2"/>
            <line x1="250" y1="130" x2="250" y2="240" stroke="#F1F5F9" stroke-width="2"/>
            <line x1="270" y1="130" x2="270" y2="240" stroke="#F1F5F9" stroke-width="2"/>
            <!-- Blonde Wood Front Porch Trim -->
            <rect x="125" y="160" width="65" height="80" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/>
            <!-- Wood Door -->
            <rect x="140" y="175" width="35" height="65" rx="3" fill="#B45309"/>
            <circle cx="168" cy="208" r="2.5" fill="#FEF3C7"/>
            <!-- Large Glass Window -->
            <rect x="205" y="150" width="65" height="70" rx="4" fill="#FEF9C3" stroke="#334155" stroke-width="3"/>
            <line x1="237" y1="150" x2="237" y2="220" stroke="#334155" stroke-width="2"/>
            <line x1="205" y1="185" x2="270" y2="185" stroke="#334155" stroke-width="2"/>
            <!-- Attic triangular window -->
            <circle cx="200" cy="105" r="14" fill="#E0F2FE" stroke="#334155" stroke-width="2"/>
            <line x1="200" y1="91" x2="200" y2="119" stroke="#334155" stroke-width="1.5"/>
            <line x1="186" y1="105" x2="214" y2="105" stroke="#334155" stroke-width="1.5"/>
          </svg>
        `;

      case "modern_minimalis":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="mod-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E2E8F0"/>
                <stop offset="100%" stop-color="#FFFFFF"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#mod-sky)"/>
            <rect y="240" width="400" height="60" fill="#CBD5E1"/>
            <!-- Left Cube (Concrete Grey) -->
            <rect x="80" y="120" width="130" height="120" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
            <!-- Cantilever Upper Box (Crisp White) -->
            <rect x="140" y="70" width="180" height="90" fill="#FFFFFF" stroke="#334155" stroke-width="2.5"/>
            <!-- Warm Wood Slats Accent on Right -->
            <rect x="260" y="160" width="60" height="80" fill="#D97706" opacity="0.9"/>
            <line x1="272" y1="160" x2="272" y2="240" stroke="#78350F" stroke-width="2"/>
            <line x1="284" y1="160" x2="284" y2="240" stroke="#78350F" stroke-width="2"/>
            <line x1="296" y1="160" x2="296" y2="240" stroke="#78350F" stroke-width="2"/>
            <line x1="308" y1="160" x2="308" y2="240" stroke="#78350F" stroke-width="2"/>
            <!-- Ribbon Glass Windows Upper Floor -->
            <rect x="155" y="85" width="140" height="40" fill="#38BDF8" opacity="0.85" stroke="#0F172A" stroke-width="2"/>
            <line x1="202" y1="85" x2="202" y2="125" stroke="#0F172A" stroke-width="2"/>
            <line x1="248" y1="85" x2="248" y2="125" stroke="#0F172A" stroke-width="2"/>
            <!-- Lower Floor Floor-to-Ceiling Glass Door -->
            <rect x="100" y="150" width="90" height="90" fill="#7DD3FC" opacity="0.9" stroke="#0F172A" stroke-width="2"/>
            <line x1="145" y1="150" x2="145" y2="240" stroke="#0F172A" stroke-width="2"/>
            <!-- Entrance Door Center -->
            <rect x="205" y="160" width="45" height="80" fill="#1E293B"/>
            <rect x="238" y="195" width="4" height="14" fill="#F8FAFC"/>
            <!-- Sleek flat roof coping line -->
            <line x1="135" y1="70" x2="325" y2="70" stroke="#0F172A" stroke-width="4"/>
          </svg>
        `;

      case "mediterania":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="med-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FED7AA"/>
                <stop offset="100%" stop-color="#FFF7ED"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#med-sky)"/>
            <rect y="240" width="400" height="60" fill="#E2E8F0"/>
            <!-- Terracotta Tile Roof Base -->
            <polygon points="100,105 200,65 300,105" fill="#C2410C"/>
            <!-- Curved roof tiles styling -->
            <path d="M100,105 Q120,95 140,105 Q160,95 180,105 Q200,95 220,105 Q240,95 260,105 Q280,95 300,105" stroke="#7C2D12" stroke-width="4" fill="none"/>
            <polygon points="200,65 300,105 320,105 220,65" fill="#9A3412"/>
            <!-- Warm Cream Stucco Wall -->
            <rect x="110" y="105" width="180" height="135" rx="4" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/>
            <!-- Second Floor Arched Windows -->
            <path d="M140,150 A15,15 0 0 1 170,150 L170,170 L140,170 Z" fill="#E0F2FE" stroke="#78350F" stroke-width="2"/>
            <line x1="155" y1="135" x2="155" y2="170" stroke="#78350F" stroke-width="1.5"/>
            <!-- Wrought Iron Balcony -->
            <rect x="135" y="165" width="40" height="12" fill="none" stroke="#1E293B" stroke-width="2"/>
            <line x1="145" y1="165" x2="145" y2="177" stroke="#1E293B" stroke-width="1.5"/>
            <line x1="155" y1="165" x2="155" y2="177" stroke="#1E293B" stroke-width="1.5"/>
            <line x1="165" y1="165" x2="165" y2="177" stroke="#1E293B" stroke-width="1.5"/>
            <!-- Second Arched Window Right -->
            <path d="M230,150 A15,15 0 0 1 260,150 L260,170 L230,170 Z" fill="#E0F2FE" stroke="#78350F" stroke-width="2"/>
            <line x1="245" y1="135" x2="245" y2="170" stroke="#78350F" stroke-width="1.5"/>
            <!-- Grand Arch Entrance Doorway -->
            <path d="M180,240 L180,185 A20,20 0 0 1 220,185 L220,240 Z" fill="#92400E" stroke="#78350F" stroke-width="3"/>
            <circle cx="212" cy="210" r="3" fill="#FEF08A"/>
            <!-- Terracotta flower pots -->
            <polygon points="120,240 123,228 135,228 138,240" fill="#EA580C"/>
            <circle cx="129" cy="223" r="8" fill="#15803D"/>
            <polygon points="262,240 265,228 277,228 280,240" fill="#EA580C"/>
            <circle cx="271" cy="223" r="8" fill="#15803D"/>
          </svg>
        `;

      case "tropical_modern":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="trop-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#D1FAE5"/>
                <stop offset="100%" stop-color="#F0FDF4"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#trop-sky)"/>
            <rect y="240" width="400" height="60" fill="#CBD5E1"/>
            <!-- Wide Overhanging Pitched Roof (Deep eaves) -->
            <polygon points="200,60 60,120 70,125 200,72 330,125 340,120" fill="#3E5C50"/>
            <polygon points="200,70 85,120 315,120" fill="#2E433B" opacity="0.3"/>
            <!-- House Main Structure -->
            <rect x="100" y="115" width="200" height="125" fill="#FFFFFF" stroke="#64748B" stroke-width="1.5"/>
            <!-- Timber Louver / Brise-soleil Upper Floor -->
            <rect x="115" y="125" width="85" height="50" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
            <line x1="115" y1="135" x2="200" y2="135" stroke="#FEF3C7" stroke-width="2"/>
            <line x1="115" y1="145" x2="200" y2="145" stroke="#FEF3C7" stroke-width="2"/>
            <line x1="115" y1="155" x2="200" y2="155" stroke="#FEF3C7" stroke-width="2"/>
            <line x1="115" y1="165" x2="200" y2="165" stroke="#FEF3C7" stroke-width="2"/>
            <!-- Natural Stone Feature Wall Right -->
            <rect x="220" y="115" width="80" height="125" fill="#64748B"/>
            <line x1="220" y1="140" x2="300" y2="140" stroke="#475569" stroke-width="2"/>
            <line x1="220" y1="170" x2="300" y2="170" stroke="#475569" stroke-width="2"/>
            <line x1="220" y1="200" x2="300" y2="200" stroke="#475569" stroke-width="2"/>
            <!-- Sliding Glass Doors to Deck -->
            <rect x="115" y="185" width="85" height="55" fill="#BAE6FD" stroke="#0369A1" stroke-width="2"/>
            <line x1="157" y1="185" x2="157" y2="240" stroke="#0369A1" stroke-width="2"/>
            <!-- Lush Palm Plants in foreground -->
            <path d="M40,260 Q60,190 90,200 Q70,225 60,260 Z" fill="#15803D"/>
            <path d="M60,260 Q80,180 100,210 Q90,235 80,260 Z" fill="#16A34A"/>
            <path d="M350,260 Q330,190 300,200 Q320,225 330,260 Z" fill="#15803D"/>
            <path d="M330,260 Q310,180 290,210 Q300,235 310,260 Z" fill="#16A34A"/>
          </svg>
        `;

      case "tradisional_vernakular":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="vern-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FEF3C7"/>
                <stop offset="100%" stop-color="#FFFBEB"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#vern-sky)"/>
            <rect y="240" width="400" height="60" fill="#E2E8F0"/>
            <!-- Iconic Tiered Joglo / Limasan Roof -->
            <!-- Top Peak -->
            <polygon points="200,55 170,95 230,95" fill="#78350F"/>
            <line x1="190" y1="52" x2="210" y2="52" stroke="#B45309" stroke-width="3"/>
            <!-- Flared Middle Roof -->
            <polygon points="160,95 240,95 275,135 125,135" fill="#92400E"/>
            <!-- Broad Flared Eaves (Tritisan) -->
            <polygon points="120,135 280,135 325,160 75,160" fill="#B45309"/>
            <!-- Timber Structure / Open Pendopo Frame -->
            <rect x="95" y="160" width="210" height="80" fill="#FFFBEB" stroke="#92400E" stroke-width="2"/>
            <!-- Wooden Pillars (Soko Guru Feel) -->
            <rect x="115" y="160" width="12" height="80" fill="#78350F"/>
            <rect x="170" y="160" width="10" height="80" fill="#78350F"/>
            <rect x="220" y="160" width="10" height="80" fill="#78350F"/>
            <rect x="275" y="160" width="12" height="80" fill="#78350F"/>
            <!-- Stone Pedestal Base (Umpak) -->
            <rect x="111" y="234" width="20" height="8" rx="2" fill="#64748B"/>
            <rect x="166" y="234" width="18" height="8" rx="2" fill="#64748B"/>
            <rect x="216" y="234" width="18" height="8" rx="2" fill="#64748B"/>
            <rect x="271" y="234" width="20" height="8" rx="2" fill="#64748B"/>
            <!-- Woven bamboo / Gebyok carved panel center -->
            <rect x="185" y="175" width="30" height="55" fill="#92400E"/>
            <line x1="200" y1="175" x2="200" y2="230" stroke="#FEF3C7" stroke-width="1.5"/>
          </svg>
        `;

      case "dutch_klasik":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="dutch-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E0E7FF"/>
                <stop offset="100%" stop-color="#F8FAFC"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#dutch-sky)"/>
            <rect y="240" width="400" height="60" fill="#CBD5E1"/>
            <!-- Stately Gable Pediment -->
            <polygon points="200,60 120,110 280,110" fill="#E2E8F0" stroke="#475569" stroke-width="2"/>
            <circle cx="200" cy="90" r="12" fill="#F8FAFC" stroke="#475569" stroke-width="2"/>
            <!-- Main Building Body (High Ceiling) -->
            <rect x="120" y="110" width="160" height="130" fill="#F8FAFC" stroke="#475569" stroke-width="2"/>
            <!-- Classical Cornice / Moldings -->
            <line x1="110" y1="110" x2="290" y2="110" stroke="#334155" stroke-width="4"/>
            <!-- Symmetrical High Windows Left -->
            <rect x="135" y="130" width="28" height="60" fill="#BAE6FD" stroke="#334155" stroke-width="2"/>
            <line x1="135" y1="150" x2="163" y2="150" stroke="#334155" stroke-width="1.5"/>
            <line x1="135" y1="170" x2="163" y2="170" stroke="#334155" stroke-width="1.5"/>
            <line x1="149" y1="130" x2="149" y2="190" stroke="#334155" stroke-width="1.5"/>
            <!-- Symmetrical High Windows Right -->
            <rect x="237" y="130" width="28" height="60" fill="#BAE6FD" stroke="#334155" stroke-width="2"/>
            <line x1="237" y1="150" x2="265" y2="150" stroke="#334155" stroke-width="1.5"/>
            <line x1="237" y1="170" x2="265" y2="170" stroke="#334155" stroke-width="1.5"/>
            <line x1="251" y1="130" x2="251" y2="190" stroke="#334155" stroke-width="1.5"/>
            <!-- Grand Double Door Center with Arched Fanlight Transom -->
            <path d="M180,150 A20,20 0 0 1 220,150 L220,240 L180,240 Z" fill="#1E293B"/>
            <line x1="200" y1="160" x2="200" y2="240" stroke="#CBD5E1" stroke-width="2"/>
            <circle cx="194" cy="200" r="2.5" fill="#FDE047"/>
            <circle cx="206" cy="200" r="2.5" fill="#FDE047"/>
            <!-- Classical Stoop / Porch Steps -->
            <rect x="165" y="235" width="70" height="7" fill="#94A3B8"/>
          </svg>
        `;

      case "japandi":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="jap-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F5EBE0"/>
                <stop offset="100%" stop-color="#FAEDCD"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#jap-sky)"/>
            <rect y="240" width="400" height="60" fill="#E7D8C9"/>
            <!-- Low Horizontal Clean Roofline -->
            <polygon points="190,95 70,135 330,135" fill="#584D3D"/>
            <line x1="60" y1="135" x2="340" y2="135" stroke="#403D39" stroke-width="4"/>
            <!-- Japandi Low Pavilion Wall (Warm Chalk / Natural) -->
            <rect x="90" y="135" width="220" height="105" fill="#FDFBF7" stroke="#CCC5B9" stroke-width="1.5"/>
            <!-- Slatted Vertical Oak Screen (Koshi) Left -->
            <rect x="110" y="145" width="60" height="90" fill="#E6CCB2" stroke="#B08968" stroke-width="1.5"/>
            <line x1="120" y1="145" x2="120" y2="235" stroke="#7F5539" stroke-width="2"/>
            <line x1="130" y1="145" x2="130" y2="235" stroke="#7F5539" stroke-width="2"/>
            <line x1="140" y1="145" x2="140" y2="235" stroke="#7F5539" stroke-width="2"/>
            <line x1="150" y1="145" x2="150" y2="235" stroke="#7F5539" stroke-width="2"/>
            <line x1="160" y1="145" x2="160" y2="235" stroke="#7F5539" stroke-width="2"/>
            <!-- Shoji Paper Style Window Grid -->
            <rect x="185" y="150" width="60" height="60" fill="#FFFDF9" stroke="#7F5539" stroke-width="2"/>
            <line x1="205" y1="150" x2="205" y2="210" stroke="#7F5539" stroke-width="1"/>
            <line x1="225" y1="150" x2="225" y2="210" stroke="#7F5539" stroke-width="1"/>
            <line x1="185" y1="170" x2="245" y2="170" stroke="#7F5539" stroke-width="1"/>
            <line x1="185" y1="190" x2="245" y2="190" stroke="#7F5539" stroke-width="1"/>
            <!-- Clean Low Timber Sliding Door -->
            <rect x="255" y="155" width="40" height="85" fill="#DDB892" stroke="#9C6644" stroke-width="1.5"/>
            <!-- Zen Bonsai / Tree Silhouette -->
            <path d="M50,240 Q65,190 40,165 M60,205 Q85,185 80,160" stroke="#584D3D" stroke-width="3" fill="none"/>
            <circle cx="40" cy="165" r="8" fill="#606C38" opacity="0.8"/>
            <circle cx="80" cy="160" r="10" fill="#606C38" opacity="0.8"/>
            <!-- Stepping Stones -->
            <ellipse cx="275" cy="255" rx="14" ry="5" fill="#B7B7A4"/>
            <ellipse cx="245" cy="265" rx="12" ry="4" fill="#A5A58D"/>
          </svg>
        `;

      case "american_farmhouse":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="farm-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E0F2FE"/>
                <stop offset="100%" stop-color="#F8FAFC"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#farm-sky)"/>
            <rect y="240" width="400" height="60" fill="#E2E8F0"/>
            <!-- Pitched Metal Roof -->
            <polygon points="200,60 90,135 100,140 200,75 300,140 310,135" fill="#1E293B"/>
            <polygon points="200,75 100,135 300,135" fill="#334155" opacity="0.2"/>
            <!-- Attic Dormer Window -->
            <polygon points="200,90 185,108 215,108" fill="#0F172A"/>
            <rect x="187" y="108" width="26" height="24" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
            <rect x="191" y="112" width="18" height="16" fill="#FEF08A"/>
            <!-- White Board & Batten House Body -->
            <rect x="100" y="135" width="200" height="105" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
            <!-- Wrap-around Front Porch Roof -->
            <polygon points="80,180 320,180 325,188 75,188" fill="#334155"/>
            <!-- Porch Posts -->
            <rect x="90" y="188" width="8" height="52" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
            <rect x="150" y="188" width="8" height="52" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
            <rect x="240" y="188" width="8" height="52" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
            <rect x="300" y="188" width="8" height="52" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1"/>
            <!-- Porch Handrail -->
            <line x1="90" y1="218" x2="150" y2="218" stroke="#CBD5E1" stroke-width="2"/>
            <line x1="240" y1="218" x2="300" y2="218" stroke="#CBD5E1" stroke-width="2"/>
            <!-- Barn-style Entrance Door -->
            <rect x="180" y="185" width="40" height="55" fill="#334155"/>
            <!-- Windows with black mullions -->
            <rect x="110" y="145" width="30" height="30" fill="#FEF9C3" stroke="#1E293B" stroke-width="2"/>
            <line x1="125" y1="145" x2="125" y2="175" stroke="#1E293B" stroke-width="1.5"/>
            <line x1="110" y1="160" x2="140" y2="160" stroke="#1E293B" stroke-width="1.5"/>
            <rect x="260" y="145" width="30" height="30" fill="#FEF9C3" stroke="#1E293B" stroke-width="2"/>
            <line x1="275" y1="145" x2="275" y2="175" stroke="#1E293B" stroke-width="1.5"/>
            <line x1="260" y1="160" x2="290" y2="160" stroke="#1E293B" stroke-width="1.5"/>
          </svg>
        `;

      case "industrial":
        return `
          <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="ind-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#CBD5E1"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
              </linearGradient>
              <pattern id="brick-pat" width="20" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#B91C1C"/>
                <line x1="0" y1="0" x2="20" y2="0" stroke="#7F1D1D" stroke-width="1"/>
                <line x1="0" y1="10" x2="20" y2="10" stroke="#7F1D1D" stroke-width="1"/>
                <line x1="10" y1="0" x2="10" y2="10" stroke="#7F1D1D" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#ind-sky)"/>
            <rect y="240" width="400" height="60" fill="#94A3B8"/>
            <!-- Exposed Raw Brick Main Body -->
            <rect x="80" y="90" width="240" height="150" fill="url(#brick-pat)" stroke="#450A0A" stroke-width="2"/>
            <!-- Black Steel I-Beams Structural Frame -->
            <rect x="75" y="85" width="250" height="10" fill="#0F172A"/>
            <rect x="75" y="85" width="10" height="155" fill="#0F172A"/>
            <rect x="315" y="85" width="10" height="155" fill="#0F172A"/>
            <rect x="195" y="85" width="10" height="155" fill="#0F172A"/>
            <!-- Factory Grid Multi-pane Window (Upper Left) -->
            <rect x="95" y="105" width="90" height="55" fill="#FEF08A" opacity="0.9" stroke="#0F172A" stroke-width="2"/>
            <line x1="125" y1="105" x2="125" y2="160" stroke="#0F172A" stroke-width="2"/>
            <line x1="155" y1="105" x2="155" y2="160" stroke="#0F172A" stroke-width="2"/>
            <line x1="95" y1="132" x2="185" y2="132" stroke="#0F172A" stroke-width="2"/>
            <!-- Factory Grid Window (Upper Right) -->
            <rect x="215" y="105" width="90" height="55" fill="#FEF08A" opacity="0.9" stroke="#0F172A" stroke-width="2"/>
            <line x1="245" y1="105" x2="245" y2="160" stroke="#0F172A" stroke-width="2"/>
            <line x1="275" y1="105" x2="275" y2="160" stroke="#0F172A" stroke-width="2"/>
            <line x1="215" y1="132" x2="305" y2="132" stroke="#0F172A" stroke-width="2"/>
            <!-- Raw Polished Concrete Lower Section -->
            <rect x="95" y="175" width="90" height="65" fill="#64748B" stroke="#334155" stroke-width="1.5"/>
            <!-- Black Steel Pivot Door -->
            <rect x="225" y="170" width="55" height="70" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
            <line x1="230" y1="175" x2="230" y2="235" stroke="#F59E0B" stroke-width="3"/>
            <!-- Industrial Cantilever Canopy -->
            <polygon points="215,165 290,165 285,170 220,170" fill="#0F172A"/>
          </svg>
        `;

      default:
        return this.getGenericSvg(["#F1F5F9", "#475569"], "🏠");
    }
  },

  /**
   * Render SVG 4:3 generik berpola arsitektural halus & emoji besar di tengah
   */
  getGenericSvg(palette, icon) {
    const c1 = (palette && palette[0]) || "#E2E8F0";
    const c2 = (palette && palette[1]) || "#3E5C50";
    const emoji = icon || "🏡";

    // Escape character for SVG safety
    return `
      <svg viewBox="0 0 400 300" class="art-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="grad-${c1.replace('#','')}-${c2.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient>
          <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#FFFFFF" stroke-width="0.75" opacity="0.15"/>
          </pattern>
        </defs>
        <!-- Background gradient -->
        <rect width="400" height="300" fill="url(#grad-${c1.replace('#','')}-${c2.replace('#','')})"/>
        <!-- Architectural grid pattern overlay -->
        <rect width="400" height="300" fill="url(#grid-pattern)"/>
        <!-- Soft ambient light circle -->
        <circle cx="200" cy="150" r="85" fill="#FFFFFF" opacity="0.16"/>
        <!-- Centered Icon / Emoji -->
        <text x="200" y="172" font-size="78" text-anchor="middle" dominant-baseline="middle" style="user-select:none;">${emoji}</text>
      </svg>
    `;
  },

  /**
   * Menghasilkan markup gambar/ilustrasi untuk kartu opsi
   */
  renderOptionVisual(option, questionId) {
    let fallbackSvg = "";
    if (questionId === "gaya") {
      fallbackSvg = this.getStyleSvg(option.id);
    } else {
      fallbackSvg = this.getGenericSvg(option.palette, option.icon);
    }

    if (option.image) {
      // Rendernya menyertakan fallback SVG jika file gambar di folder assets/ belum ada
      return `
        <div class="card-media-wrapper">
          <img src="${option.image}" alt="${option.label}" class="card-image" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
          <div class="card-svg-container" style="display:none;">
            ${fallbackSvg}
          </div>
        </div>
      `;
    }

    return `
      <div class="card-media-wrapper">
        <div class="card-svg-container">
          ${fallbackSvg}
        </div>
      </div>
    `;
  }
};
