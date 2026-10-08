/**
 * House Vision Builder - App Logic (Studio Lentera)
 * 100% Offline, Native Single-Card Compact UX, Lead Generation & Personalization.
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const STORAGE_KEY = 'hvb_answers_v2';

  let appState = {
    answers: {},        // { [questionId]: [optionId, ...] }
    customTexts: {},    // { [questionId]: "teks kustom" }
    extraNotes: {},     // { [questionId]: "catatan tambahan" }
    landSize: "",       // string ukuran lahan
    clientName: "",     // nama klien untuk personalisasi dokumen & denah
    currentStep: 0,     // 0..9 (Q1..Q10), 10 (Langkah Detail Lahan & Nama)
    quizStarted: false  // true jika sedang dalam kuis
  };

  // Cached recommendation results
  let recommendationResult = null;

  // Track reset button timer
  let resetTimer = null;

  // Auto-advance timer for single-choice questions
  let autoAdvanceTimer = null;

  // Track PWA install prompt
  let deferredInstallPrompt = null;

  // Floor plan current state
  let currentFloorParams = null;
  let currentFloorLevel = 1;
  let zoomLevel = 1.0;

  // --- UTILS & SANITIZATION ---
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(message, duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  function joinWithAnd(arr) {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} & ${arr[1]}`;
    return `${arr.slice(0, -1).join(', ')} & ${arr[arr.length - 1]}`;
  }

  // --- LOCAL STORAGE PERSISTENCE ---
  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      // Local storage might be disabled in private mode
    }
  }

  function loadStateFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('hvb_answers_v1');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          appState = {
            answers: parsed.answers || {},
            customTexts: parsed.customTexts || {},
            extraNotes: parsed.extraNotes || {},
            landSize: parsed.landSize || "",
            clientName: parsed.clientName || "",
            currentStep: typeof parsed.currentStep === 'number' ? parsed.currentStep : 0,
            quizStarted: !!parsed.quizStarted
          };

          // Jika ada minimal 1 jawaban, anggap kuis sudah pernah dimulai
          if (Object.keys(appState.answers).length > 0) {
            appState.quizStarted = true;
          }
        }
      }
    } catch (e) {}
  }

  // --- DATA RETRIEVAL HELPERS ---
  function getQuestionById(qId) {
    return QUESTIONS.find(q => q.id === qId);
  }

  function getOptionById(qId, optId) {
    const q = getQuestionById(qId);
    if (!q) return null;
    return q.options.find(o => o.id === optId);
  }

  function isQuestionAnswered(qId) {
    const chosen = appState.answers[qId];
    const hasChosen = Array.isArray(chosen) && chosen.length > 0;
    const custom = appState.customTexts[qId];
    const hasCustom = typeof custom === 'string' && custom.trim().length > 0;
    return hasChosen || hasCustom;
  }

  function countAnsweredQuestions() {
    let count = 0;
    for (let i = 0; i < QUESTIONS.length; i++) {
      if (isQuestionAnswered(QUESTIONS[i].id)) {
        count++;
      }
    }
    return count;
  }

  // --- SINGLE-CARD WIZARD NAVIGATION & RENDERING ---
  function startQuiz() {
    appState.quizStarted = true;
    saveStateToStorage();
    renderQuizStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToStep(stepIndex) {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = null;
    }
    const maxStep = 10; // 0..9 are Q1..Q10, 10 is Final Details
    const clamped = Math.max(0, Math.min(maxStep, stepIndex));
    appState.currentStep = clamped;
    appState.quizStarted = true;
    saveStateToStorage();
    renderQuizStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderQuizStage() {
    const heroEl = document.getElementById('hero');
    const footerEl = document.getElementById('app-footer');
    const stageEl = document.getElementById('quiz-card-stage');
    const mountEl = document.getElementById('quiz-single-card-mount');
    const extraControls = document.getElementById('extra-controls-wrapper');

    if (!appState.quizStarted) {
      document.body.classList.remove('quiz-active');
      if (heroEl) heroEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'block';
      if (stageEl) stageEl.style.display = 'none';
      if (extraControls) extraControls.style.display = 'flex';
      updateProgressHeader();
      return;
    }

    // Quiz Active: Sembunyikan elemen pengganggu (hero, footer, extra controls)
    document.body.classList.add('quiz-active');
    if (heroEl) heroEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'none';
    if (stageEl) stageEl.style.display = 'block';
    if (extraControls) extraControls.style.display = 'none';

    updateProgressHeader();

    if (!mountEl) return;
    mountEl.innerHTML = '';

    // Step 0..9: Pertanyaan 1 s.d. 10
    if (appState.currentStep < 10) {
      const q = QUESTIONS[appState.currentStep];
      const isAnswered = isQuestionAnswered(q.id);

      const card = document.createElement('div');
      card.className = 'quiz-step-card';
      card.setAttribute('data-step', q.number);

      // 1. Header Kartu
      const isSingle = q.selectMode === 'single';
      card.innerHTML = `
        <div class="step-card-header">
          <div class="step-badge-row">
            <span class="step-counter-badge">Pertanyaan ${q.number} dari 10</span>
            <span class="step-mode-pill">
              ${isSingle ? '⚡ Pilih 1 (Transisi Otomatis)' : '✓ Boleh Pilih Lebih Dari 1'}
            </span>
          </div>
          <h2 class="step-card-title font-serif">${escapeHtml(q.title)}</h2>
          ${q.subtitle ? `<p class="step-card-subtitle">${escapeHtml(q.subtitle)}</p>` : ''}
        </div>
      `;

      // 2. Options Grid
      const photoGrid = document.createElement('div');
      photoGrid.className = 'options-photo-grid';
      photoGrid.id = `options-wrap-${q.id}`;

      const chosenList = appState.answers[q.id] || [];
      const isMaxReached = q.maxSelect && chosenList.length >= q.maxSelect;

      q.options.forEach((opt) => {
        const isSelected = chosenList.includes(opt.id);
        const isLocked = isMaxReached && !isSelected;

        const optBtn = document.createElement('button');
        optBtn.type = 'button';
        optBtn.className = `option-photo-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
        optBtn.setAttribute('role', isSingle ? 'radio' : 'checkbox');
        optBtn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        optBtn.setAttribute('data-qid', q.id);
        optBtn.setAttribute('data-optid', opt.id);

        const visualMarkup = ArtEngine.renderOptionVisual(opt, q.id);

        optBtn.innerHTML = `
          ${visualMarkup}
          <div class="card-check-badge" aria-hidden="true">${isSelected ? '✓' : ''}</div>
          <div class="card-content">
            <span class="card-label">${escapeHtml(opt.label)}</span>
            ${opt.desc ? `<span class="card-desc">${escapeHtml(opt.desc)}</span>` : ''}
          </div>
        `;

        optBtn.addEventListener('click', () => handleOptionClick(q.id, opt.id));
        photoGrid.appendChild(optBtn);
      });

      // "✎ Tidak ada yang pas?" Card
      const hasCustom = !!(appState.customTexts[q.id] && appState.customTexts[q.id].trim());
      const customCard = document.createElement('div');
      customCard.className = `option-photo-card option-custom-card ${hasCustom ? 'selected' : ''}`;
      customCard.id = `custom-card-${q.id}`;

      const customSvg = ArtEngine.getGenericSvg(["#F1F5F9", "#94A3B8"], "✎");

      customCard.innerHTML = `
        <div class="card-media-wrapper">
          <div class="card-svg-container">${customSvg}</div>
        </div>
        <div class="card-check-badge" aria-hidden="true">${hasCustom ? '✓' : ''}</div>
        <div class="card-content">
          <span class="card-label">✎ Tidak ada yang pas?</span>
          <span class="card-desc">Tulis sendiri pilihan atau keinginanmu</span>
        </div>
        <div class="custom-input-box" id="custom-box-${q.id}" style="${hasCustom ? 'display:flex;' : 'display:none;'}">
          <textarea id="custom-input-${q.id}" class="custom-textarea" maxlength="200" placeholder="Tuliskan pilihan atau keinginanmu di sini...">${escapeHtml(appState.customTexts[q.id] || '')}</textarea>
          <div class="char-limit-hint"><span id="custom-count-${q.id}">${(appState.customTexts[q.id] || '').length}</span>/200 karakter</div>
        </div>
      `;

      customCard.addEventListener('click', (e) => {
        if (e.target.tagName !== 'TEXTAREA') {
          toggleCustomInput(q.id);
        }
      });

      photoGrid.appendChild(customCard);
      card.appendChild(photoGrid);

      // Warning jika melebihi batas maksimal pilih
      const warnDiv = document.createElement('div');
      warnDiv.className = 'max-select-warning';
      warnDiv.id = `warn-${q.id}`;
      warnDiv.textContent = `Maksimal memilih ${q.maxSelect} opsi untuk pertanyaan ini.`;
      card.appendChild(warnDiv);

      // Catatan opsional jika pertanyaan memiliki extra note
      if (q.hasExtraNote) {
        const extraWrap = document.createElement('div');
        extraWrap.className = 'extra-note-box';
        extraWrap.innerHTML = `
          <label for="extra-note-${q.id}" class="extra-note-label">
            ${escapeHtml(q.extraNoteLabel || 'Catatan tambahan (opsional):')}
          </label>
          <input type="text" id="extra-note-${q.id}" class="compact-input" maxlength="150" placeholder="${escapeHtml(q.extraNotePlaceholder || 'Ketik catatan...')}" value="${escapeHtml(appState.extraNotes[q.id] || '')}" />
        `;
        card.appendChild(extraWrap);

        setTimeout(() => {
          const extraInp = document.getElementById(`extra-note-${q.id}`);
          if (extraInp) {
            extraInp.addEventListener('input', (e) => {
              appState.extraNotes[q.id] = e.target.value;
              saveStateToStorage();
            });
          }
        }, 0);
      }

      // 3. Card Navigation Bar (Bawah)
      const navBar = document.createElement('div');
      navBar.className = 'step-card-nav';

      // Mini dots indicator
      let miniDotsHtml = '<div class="step-dots-mini" aria-hidden="true">';
      for (let i = 0; i < 10; i++) {
        const dotQ = QUESTIONS[i];
        const dotAnswered = isQuestionAnswered(dotQ.id);
        const dotActive = i === appState.currentStep;
        miniDotsHtml += `<span class="mini-dot ${dotActive ? 'active' : ''} ${dotAnswered ? 'answered' : ''}"></span>`;
      }
      miniDotsHtml += '</div>';

      navBar.innerHTML = `
        <button type="button" class="btn-step-nav btn-step-prev" id="btn-quiz-prev" ${appState.currentStep === 0 ? 'disabled' : ''}>
          ← Sebelumnya
        </button>
        ${miniDotsHtml}
        <button type="button" class="btn-step-nav btn-step-next" id="btn-quiz-next">
          ${appState.currentStep === 9 ? 'Lanjut ke Detail &amp; Nama →' : 'Lanjut →'}
        </button>
      `;

      card.appendChild(navBar);
      mountEl.appendChild(card);

      // Bind nav events
      const prevBtn = document.getElementById('btn-quiz-prev');
      if (prevBtn) prevBtn.addEventListener('click', () => goToStep(appState.currentStep - 1));

      const nextBtn = document.getElementById('btn-quiz-next');
      if (nextBtn) nextBtn.addEventListener('click', () => goToStep(appState.currentStep + 1));

      // Bind textarea custom
      const customInput = document.getElementById(`custom-input-${q.id}`);
      const customCount = document.getElementById(`custom-count-${q.id}`);
      if (customInput && customCount) {
        customInput.addEventListener('input', (e) => {
          const val = e.target.value;
          appState.customTexts[q.id] = val;
          customCount.textContent = val.length;
          updateCustomCardState(q.id);
          updateProgressHeader();
          saveStateToStorage();
        });
      }

    } else {
      // Step 10: Langkah Terakhir (Detail Lahan & Personalisasi Nama Dokumen)
      const detailsCard = document.createElement('div');
      detailsCard.className = 'quiz-step-card step-final-details';

      detailsCard.innerHTML = `
        <div class="step-card-header">
          <div class="step-badge-row">
            <span class="step-counter-badge">Langkah Terakhir • Personalisasi</span>
            <span class="step-mode-pill">Dokumen Eksklusif Studio Lentera</span>
          </div>
          <h2 class="step-card-title font-serif">Satu Sentuhan Terakhir untuk Desain Rumah Impianmu</h2>
          <p class="step-card-subtitle">
            Masukkan nama Anda dan ukuran lahan agar dokumen pradesain &amp; denah arsitektur tercetak secara personal dan profesional.
          </p>
        </div>

        <div class="step-details-form">
          <div class="form-group-compact">
            <label for="input-client-name" class="compact-label">
              👤 Masukkan nama Anda untuk dicetak di dokumen desain:
              <span class="label-hint">(Contoh: Bapak Hendra &amp; Ibu Maya / Keluarga Pratama)</span>
            </label>
            <input type="text" id="input-client-name" class="compact-input" placeholder="Nama Anda / Keluarga..." value="${escapeHtml(appState.clientName || '')}" maxlength="60" />
          </div>

          <div class="form-group-compact">
            <label for="input-land-size" class="compact-label">
              📐 Perkiraan ukuran lahan &amp; bangunan:
              <span class="label-hint">(opsional, cth: 8 x 15 meter, 120 m², atau 2 lantai)</span>
            </label>
            <input type="text" id="input-land-size" class="compact-input" placeholder="Contoh: 8 x 15 meter (120 m²)" value="${escapeHtml(appState.landSize || '')}" maxlength="100" />
          </div>
        </div>

        <div class="step-card-nav" style="justify-content:space-between;">
          <button type="button" class="btn-step-nav btn-step-prev" id="btn-details-prev">
            ← Pertanyaan 10
          </button>
          <div style="display:flex; align-items:center; gap:16px;">
            <button type="button" class="skip-step-link" id="btn-skip-to-results">
              Lewati &amp; langsung lihat hasil →
            </button>
            <button type="button" class="btn-step-nav btn-generate-final" id="btn-show-results-now">
              ✨ Buka Hasil &amp; Denah Rumah
            </button>
          </div>
        </div>
      `;

      mountEl.appendChild(detailsCard);

      const clientInput = document.getElementById('input-client-name');
      if (clientInput) {
        clientInput.addEventListener('input', (e) => {
          appState.clientName = e.target.value;
          saveStateToStorage();
        });
      }

      const landInput = document.getElementById('input-land-size');
      if (landInput) {
        landInput.addEventListener('input', (e) => {
          appState.landSize = e.target.value;
          saveStateToStorage();
        });
      }

      const prevBtn = document.getElementById('btn-details-prev');
      if (prevBtn) prevBtn.addEventListener('click', () => goToStep(9));

      const showBtn = document.getElementById('btn-show-results-now');
      if (showBtn) showBtn.addEventListener('click', openResultsModal);

      const skipBtn = document.getElementById('btn-skip-to-results');
      if (skipBtn) skipBtn.addEventListener('click', openResultsModal);
    }
  }

  function updateProgressHeader() {
    const answeredCount = countAnsweredQuestions();
    const total = 10;
    const pct = Math.round((answeredCount / total) * 100);

    const stepTitle = document.getElementById('progress-step-title');
    if (stepTitle) {
      if (!appState.quizStarted) {
        stepTitle.textContent = 'Eksplorasi Desain';
      } else if (appState.currentStep < 10) {
        stepTitle.textContent = `Pertanyaan ${appState.currentStep + 1} dari 10`;
      } else {
        stepTitle.textContent = 'Langkah Terakhir: Detail Lahan & Nama';
      }
    }

    const countText = document.getElementById('progress-text');
    if (countText) countText.textContent = `${answeredCount} / ${total} terjawab`;

    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    // Render Progress Dots di Header
    const dotsRow = document.getElementById('progress-dots-row');
    if (dotsRow) {
      dotsRow.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const dotQ = QUESTIONS[i];
        const answered = isQuestionAnswered(dotQ.id);
        const isActive = appState.quizStarted && i === appState.currentStep;

        const dotBtn = document.createElement('button');
        dotBtn.type = 'button';
        dotBtn.className = `progress-dot-btn ${isActive ? 'active' : ''} ${answered ? 'answered' : ''}`;
        dotBtn.title = `Lompat ke Pertanyaan ${i + 1}`;
        dotBtn.setAttribute('aria-label', `Pertanyaan ${i + 1}: ${dotQ.title}`);
        dotBtn.addEventListener('click', () => {
          goToStep(i);
        });
        dotsRow.appendChild(dotBtn);
      }
    }
  }

  // --- INTERACTION & SELECTION LOGIC ---
  function handleOptionClick(qId, optId) {
    const q = getQuestionById(qId);
    if (!q) return;

    if (!appState.answers[qId]) {
      appState.answers[qId] = [];
    }

    const current = appState.answers[qId];
    const index = current.indexOf(optId);
    const isSingle = q.selectMode === 'single';

    if (isSingle) {
      if (index > -1) {
        // Toggle off
        appState.answers[qId] = [];
      } else {
        // Ganti dengan pilihan tunggal
        appState.answers[qId] = [optId];
        if (appState.customTexts[qId]) {
          appState.customTexts[qId] = "";
          const customInput = document.getElementById(`custom-input-${qId}`);
          if (customInput) customInput.value = "";
          updateCustomCardState(qId);
        }

        // AUTO-ADVANCE: Jika single select, berikan jeda visual 320ms lalu otomatis pindah ke pertanyaan berikutnya
        updateOptionUI(qId);
        updateProgressHeader();
        saveStateToStorage();

        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
          goToStep(appState.currentStep + 1);
        }, 320);
        return;
      }
    } else {
      // Multi-select mode
      if (index > -1) {
        current.splice(index, 1);
        hideMaxWarning(qId);
      } else {
        if (q.maxSelect && current.length >= q.maxSelect) {
          showMaxWarning(qId);
          return;
        }
        current.push(optId);
      }
    }

    saveStateToStorage();
    updateOptionUI(qId);
    updateProgressHeader();
  }

  function toggleCustomInput(qId) {
    const q = getQuestionById(qId);
    const box = document.getElementById(`custom-box-${qId}`);
    if (!box) return;

    const isHidden = box.style.display === 'none';
    if (isHidden) {
      box.style.display = 'flex';
      const input = document.getElementById(`custom-input-${qId}`);
      if (input) input.focus();

      if (q && q.selectMode === 'single') {
        appState.answers[qId] = [];
        updateOptionUI(qId);
      }
    } else {
      const input = document.getElementById(`custom-input-${qId}`);
      if (!input || !input.value.trim()) {
        box.style.display = 'none';
        appState.customTexts[qId] = "";
      }
    }

    updateCustomCardState(qId);
    updateProgressHeader();
    saveStateToStorage();
  }

  function updateCustomCardState(qId) {
    const hasText = !!(appState.customTexts[qId] && appState.customTexts[qId].trim());
    const card = document.getElementById(`custom-card-${qId}`);
    if (card) {
      if (hasText) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
      const badge = card.querySelector('.card-check-badge');
      if (badge) badge.textContent = hasText ? '✓' : '';
    }
  }

  function updateOptionUI(qId) {
    const q = getQuestionById(qId);
    if (!q) return;

    const chosen = appState.answers[qId] || [];
    const isMaxReached = q.maxSelect && chosen.length >= q.maxSelect;

    const wrap = document.getElementById(`options-wrap-${qId}`);
    if (!wrap) return;

    const cards = wrap.querySelectorAll('[data-optid]');
    cards.forEach((el) => {
      const optId = el.getAttribute('data-optid');
      const isSelected = chosen.includes(optId);

      if (isSelected) {
        el.classList.add('selected');
        el.setAttribute('aria-checked', 'true');
      } else {
        el.classList.remove('selected');
        el.setAttribute('aria-checked', 'false');
      }

      if (q.maxSelect) {
        if (isMaxReached && !isSelected) {
          el.classList.add('locked');
        } else {
          el.classList.remove('locked');
        }
      }

      const badge = el.querySelector('.card-check-badge');
      if (badge) {
        badge.textContent = isSelected ? '✓' : '';
      }
    });

    if (!isMaxReached) {
      hideMaxWarning(qId);
    }
  }

  function showMaxWarning(qId) {
    const warn = document.getElementById(`warn-${qId}`);
    if (warn) warn.classList.add('active');
  }

  function hideMaxWarning(qId) {
    const warn = document.getElementById(`warn-${qId}`);
    if (warn) warn.classList.remove('active');
  }

  // --- RECOMMENDATION ENGINE (100% LOCAL ALGORITHM) ---
  function computeRecommendations() {
    const scoreMap = {};
    const reasonMap = {};

    STYLE_PROFILES.forEach((profile) => {
      scoreMap[profile.id] = 0;
      reasonMap[profile.id] = [];
    });

    const scoredQuestions = ["suasana", "pencahayaan", "warna", "material", "ventilasi", "dihindari"];

    scoredQuestions.forEach((qId) => {
      const selected = appState.answers[qId] || [];
      selected.forEach((optId) => {
        const opt = getOptionById(qId, optId);
        const optLabel = opt ? opt.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : optId;

        STYLE_PROFILES.forEach((profile) => {
          const w = (profile.weights && profile.weights[optId]) || 0;
          scoreMap[profile.id] += w;

          if (w >= 2 && reasonMap[profile.id].length < 3) {
            reasonMap[profile.id].push(optLabel);
          }
        });
      });
    });

    const initialChosenStyles = appState.answers["gaya"] || [];
    initialChosenStyles.forEach((styleId) => {
      if (scoreMap[styleId] !== undefined) {
        scoreMap[styleId] += 6;
      }
    });

    const rawScores = Object.values(scoreMap);
    const maxScore = Math.max(...rawScores, 1);

    const ranked = STYLE_PROFILES.map((profile) => {
      const raw = scoreMap[profile.id];
      const percentage = Math.min(97, Math.max(64, Math.round(72 + (raw / maxScore) * 24)));

      let reasonText = "";
      const reasons = reasonMap[profile.id];
      if (reasons.length > 0) {
        reasonText = `Cocok karena kamu memilih ${joinWithAnd(reasons)}.`;
      } else {
        reasonText = `Cocok dengan preferensi ruang dan karakter tata cahaya yang kamu inginkan.`;
      }

      return {
        ...profile,
        score: raw,
        percentage: percentage,
        reasonText: reasonText
      };
    });

    ranked.sort((a, b) => b.score - a.score);
    const top3 = ranked.slice(0, 3);

    let mismatchNote = null;
    if (initialChosenStyles.length > 0) {
      const top1Id = top3[0].id;
      const isTop1ChosenInitially = initialChosenStyles.includes(top1Id);

      if (!isTop1ChosenInitially) {
        const initialLabels = initialChosenStyles.map(id => {
          const prof = STYLE_PROFILES.find(p => p.id === id);
          return prof ? prof.label : id;
        });

        mismatchNote = `Catatan Pengamatan Arsitek: Di awal kamu menyukai gaya ${joinWithAnd(initialLabels)}, namun berdasarkan kebutuhan suasana harian, sirkulasi hawa, dan material yang kamu prioritaskan, gaya ${top3[0].label} memiliki kecocokan fungsional tertinggi (${top3[0].percentage}%). Hal ini sangat wajar—kamu bisa memadukan karakter visual fasad ${initialLabels[0]} dengan kenyamanan tata ruang ${top3[0].label}.`;
      }
    }

    return {
      top3: top3,
      mismatchNote: mismatchNote,
      allRanked: ranked
    };
  }

  // --- NARRATIVE BRIEF BUILDER ---
  function buildNarrativeBrief(recs) {
    const paragraphs = [];
    const clientDisplay = appState.clientName ? `Bapak/Ibu ${appState.clientName}` : 'Keluarga Klien';

    const top1 = recs.top3[0];
    const top2 = recs.top3[1];
    const top3 = recs.top3[2];
    paragraphs.push(
      `Dokumen pradesain konseptual ini disusun khusus untuk ${clientDisplay}. Berdasarkan eksplorasi kebutuhan dan karakter hunian, arah desain yang paling selaras adalah gaya ${top1.label} (${top1.percentage}%), disusul oleh ${top2.label} (${top2.percentage}%) dan ${top3.label} (${top3.percentage}%). ${top1.ringkasan}`
    );

    const suasanaNames = getAnswerLabels('suasana');
    if (suasanaNames.length > 0) {
      paragraphs.push(
        `Saat melangkah pulang ke rumah setelah seharian beraktivitas, suasana utama yang ingin dirasakan adalah ${joinWithAnd(suasanaNames)}. Suasana ini dirancang menjadi jangkar kenyamanan batin bagi seluruh anggota keluarga.`
      );
    }

    const ruangNames = getAnswerLabels('ruang');
    let ruangText = `Untuk mendukung kegiatan harian, rumah ini dibayangkan memiliki ruang-ruang seperti: ${joinWithAnd(ruangNames)}.`;
    const noteRuang = (appState.extraNotes['ruang'] || '').trim();
    if (noteRuang) {
      ruangText += ` Khusus mengenai tata ruang, terdapat catatan prioritas: "${escapeHtml(noteRuang)}".`;
    }
    paragraphs.push(ruangText);

    const cahayaNames = getAnswerLabels('pencahayaan');
    if (cahayaNames.length > 0) {
      paragraphs.push(
        `Dari segi pencahayaan, konsep yang diinginkan memadukan ${joinWithAnd(cahayaNames)}, sehingga setiap sudut ruangan mendapatkan intensitas cahaya yang tepat dan menyejukkan baik di siang maupun malam hari.`
      );
    }

    const warnaNames = getAnswerLabels('warna');
    if (warnaNames.length > 0) {
      paragraphs.push(
        `Nuansa warna yang paling mewakili identitas rumah adalah ${joinWithAnd(warnaNames)}, menciptakan harmoni visual yang teduh dan konsisten di seluruh elemen bangunan.`
      );
    }

    const matNames = getAnswerLabels('material');
    if (matNames.length > 0) {
      paragraphs.push(
        `Untuk sentuhan tekstur dan materialitas, pilihan utama bertumpu pada ${joinWithAnd(matNames)}. Kombinasi material ini memberikan kekayaan visual yang menyenangkan saat dilihat sekaligus ramah saat disentuh sehari-hari.`
      );
    }

    const ventNames = getAnswerLabels('ventilasi');
    if (ventNames.length > 0) {
      paragraphs.push(
        `Sirkulasi udara dan kenyamanan termal diwujudkan melalui sistem ${joinWithAnd(ventNames)}, memastikan rumah selalu bernapas bebas dari udara pengap tanpa harus bergantung penuh pada pendingin ruangan.`
      );
    }

    const userNames = getAnswerLabels('penghuni');
    if (userNames.length > 0) {
      paragraphs.push(
        `Tata ruang dan sirkulasi dirancang dengan mempertimbangkan interaksi para penghuni dan pengunjung rutin, yaitu ${joinWithAnd(userNames)}, agar rumah menjadi tempat tumbuh yang aman, ramah, dan inklusif.`
      );
    }

    const progNames = getAnswerLabels('progres');
    if (progNames.length > 0) {
      paragraphs.push(
        `Tahap persiapan pembangunan saat ini berada pada posisi: ${joinWithAnd(progNames)}. Informasi ini menjadi pijakan awal yang sangat berharga dalam menentukan skala prioritas pada konsultasi arsitektur.`
      );
    }

    const hindarNames = getAnswerLabels('dihindari');
    if (hindarNames.length > 0) {
      paragraphs.push(
        `Hal-hal penting yang ingin dihindari dalam desain maupun konstruksi hunian ini meliputi: ${joinWithAnd(hindarNames)}. Poin-poin ini menjadi batasan tegas yang perlu diantisipasi sejak pembuatan konsep denah awal.`
      );
    }

    const land = (appState.landSize || '').trim();
    if (land) {
      paragraphs.push(
        `Mengenai lahan dan rencana bangunan, perkiraan ukuran yang disiapkan adalah: ${escapeHtml(land)}. Detail ini menjadi rujukan batas tapak dan koefisien dasar bangunan saat merancang tata ruang yang optimal.`
      );
    }

    return paragraphs;
  }

  function getAnswerLabels(qId) {
    const q = getQuestionById(qId);
    if (!q) return [];

    const result = [];
    const chosen = appState.answers[qId] || [];

    chosen.forEach((optId) => {
      const opt = q.options.find(o => o.id === optId);
      if (opt) {
        result.push(opt.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim());
      }
    });

    const custom = (appState.customTexts[qId] || '').trim();
    if (custom) {
      result.push(`(Catatan khusus: ${escapeHtml(custom)})`);
    }

    return result;
  }

  // --- LEAD GENERATION: WHATSAPP AUTOMATION URL ---
  function generateWhatsAppUrl(customClientName) {
    const client = (customClientName || appState.clientName || 'Klien').trim();
    const topStyle = (recommendationResult && recommendationResult.top3 && recommendationResult.top3[0])
      ? recommendationResult.top3[0].label
      : 'Modern';
    const topPct = (recommendationResult && recommendationResult.top3 && recommendationResult.top3[0])
      ? `${recommendationResult.top3[0].percentage}%`
      : '';

    const selectedRooms = appState.answers['ruang'] || [];
    const roomLabels = selectedRooms.map(r => {
      const o = getOptionById('ruang', r);
      return o ? o.label.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : r;
    }).slice(0, 4).join(', ');

    const land = (appState.landSize && appState.landSize.trim())
      ? appState.landSize.trim()
      : (currentFloorParams ? `${currentFloorParams.widthM}x${currentFloorParams.lengthM} m (${currentFloorParams.widthM * currentFloorParams.lengthM} m²)` : 'Standar');

    const msg = `Halo Studio Lentera, saya baru saja mencoba aplikasi Rumah Masa Depan dan mendapatkan hasil pradesain untuk *${client}*.\n\n` +
      `• Rekomendasi Gaya: *${topStyle}* ${topPct ? `(${topPct} cocok)` : ''}\n` +
      `• Estimasi Lahan: *${land}*\n` +
      (roomLabels ? `• Kebutuhan Ruang: ${roomLabels}\n` : '') +
      `• Standar Zonasi: Pradesain Layak Huni (SNI 03-1733)\n\n` +
      `Saya ingin berkonsultasi lebih lanjut dengan tim arsitek Studio Lentera untuk analisa tapak riil, struktur, dan desain profesional. Terima kasih!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function updateAllWhatsAppLinks() {
    const waUrl = generateWhatsAppUrl();

    const mainWaBtn = document.getElementById('btn-whatsapp');
    if (mainWaBtn) {
      mainWaBtn.onclick = () => window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    const lenteraWaBtn = document.getElementById('btn-lentera-consult-wa');
    if (lenteraWaBtn) {
      lenteraWaBtn.href = waUrl;
    }

    const footerWaLink = document.getElementById('footer-wa-link');
    if (footerWaLink) {
      footerWaLink.href = waUrl;
    }
  }

  // --- MODAL RENDERING & PERSONALIZATION ---
  function openResultsModal() {
    recommendationResult = computeRecommendations();
    const modal = document.getElementById('results-modal');
    if (!modal) return;

    // 1. Personalization Card
    const clientDisplayEl = document.getElementById('results-display-client-name');
    const clientInputEl = document.getElementById('modal-edit-client-name');
    const client = (appState.clientName || '').trim();

    if (clientDisplayEl) {
      clientDisplayEl.textContent = client ? `Rumah Impian ${client}` : 'Rumah Impian Bapak / Ibu';
    }
    if (clientInputEl) {
      clientInputEl.value = client;
    }

    // 2. Render Top 3 Styles
    const topStylesWrap = document.getElementById('top-styles-list');
    if (topStylesWrap) {
      topStylesWrap.innerHTML = '';
      recommendationResult.top3.forEach((style, index) => {
        const card = document.createElement('div');
        card.className = 'top-style-card';

        const svgArt = ArtEngine.getStyleSvg(style.id);

        card.innerHTML = `
          <div class="top-style-media">${svgArt}</div>
          <div class="top-style-content">
            <div class="top-style-header">
              <span class="top-style-name font-serif">Pilihan #${index + 1}: ${escapeHtml(style.label)}</span>
              <span class="top-style-pct">${style.percentage}% Cocok</span>
            </div>
            <p class="top-style-summary">${escapeHtml(style.ringkasan)}</p>
            <div class="top-style-reasons">${escapeHtml(style.reasonText)}</div>
          </div>
        `;
        topStylesWrap.appendChild(card);
      });
    }

    // Mismatch note
    const mismatchWrap = document.getElementById('mismatch-note-wrap');
    if (mismatchWrap) {
      if (recommendationResult.mismatchNote) {
        mismatchWrap.innerHTML = `<div class="style-mismatch-note">${escapeHtml(recommendationResult.mismatchNote)}</div>`;
        mismatchWrap.style.display = 'block';
      } else {
        mismatchWrap.innerHTML = '';
        mismatchWrap.style.display = 'none';
      }
    }

    // 3. Render Summary Grid
    const summaryGrid = document.getElementById('summary-grid');
    if (summaryGrid) {
      summaryGrid.innerHTML = '';
      QUESTIONS.forEach((q) => {
        const labels = getAnswerLabels(q.id);
        const card = document.createElement('div');
        card.className = 'summary-card';

        let extraNoteHtml = '';
        if (q.hasExtraNote && appState.extraNotes[q.id] && appState.extraNotes[q.id].trim()) {
          extraNoteHtml = `<div class="summary-extra-note">Catatan: "${escapeHtml(appState.extraNotes[q.id].trim())}"</div>`;
        }

        card.innerHTML = `
          <div class="summary-question-title">${escapeHtml(q.title)}</div>
          <div class="summary-answer-text">${labels.length > 0 ? joinWithAnd(labels) : '—'}</div>
          ${extraNoteHtml}
        `;
        summaryGrid.appendChild(card);
      });

      if (appState.landSize && appState.landSize.trim()) {
        const landCard = document.createElement('div');
        landCard.className = 'summary-card';
        landCard.innerHTML = `
          <div class="summary-question-title">Perkiraan Ukuran Lahan &amp; Bangunan</div>
          <div class="summary-answer-text">${escapeHtml(appState.landSize.trim())}</div>
        `;
        summaryGrid.appendChild(landCard);
      }
    }

    // 4. Render Narrative Brief
    const briefBox = document.getElementById('narrative-brief-box');
    if (briefBox) {
      const paragraphs = buildNarrativeBrief(recommendationResult);
      briefBox.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // 5. Render Floor Plan dengan nama klien
    renderFloorPlanToModal(1);

    // 6. Update WhatsApp URLs
    updateAllWhatsAppLinks();

    // 7. PWA install offer di halaman hasil
    const pwaResultsCard = document.getElementById('results-pwa-card');
    if (pwaResultsCard) {
      // Selalu tampilkan kartu ajakan install di hasil agar konversi tinggi
      pwaResultsCard.style.display = 'flex';
    }

    // Buka modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeResultsModal() {
    const modal = document.getElementById('results-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  // --- FLOOR PLAN ENGINE HANDLERS ---
  function renderFloorPlanToModal(level = 1) {
    if (typeof FloorPlanEngine === 'undefined') return;
    currentFloorLevel = level;
    currentFloorParams = FloorPlanEngine.analyzeRequirements(
      appState.answers,
      appState.landSize,
      appState.extraNotes,
      appState.clientName
    );

    const container = document.getElementById('floorplan-canvas-container');
    if (container) {
      const svgHtml = FloorPlanEngine.generateFloorPlanSvg(currentFloorParams, currentFloorLevel);
      container.innerHTML = svgHtml;
    }

    const tabsWrap = document.getElementById('floor-tabs-wrap');
    if (tabsWrap) {
      if (currentFloorParams.isTwoStories) {
        tabsWrap.style.display = 'flex';
        const tab1 = document.getElementById('btn-tab-floor-1');
        const tab2 = document.getElementById('btn-tab-floor-2');
        if (tab1) tab1.className = `btn-floor-tab ${currentFloorLevel === 1 ? 'active' : ''}`;
        if (tab2) tab2.className = `btn-floor-tab ${currentFloorLevel === 2 ? 'active' : ''}`;
      } else {
        tabsWrap.style.display = 'none';
      }
    }
  }

  function openFloorPlanZoomModal() {
    const modal = document.getElementById('floorplan-zoom-modal');
    const zoomContainer = document.getElementById('zoom-content-wrapper');
    const zoomTitle = document.getElementById('zoom-title');
    if (!modal || !zoomContainer || !currentFloorParams) return;

    zoomLevel = 1.0;
    const svgHtml = FloorPlanEngine.generateFloorPlanSvg(currentFloorParams, currentFloorLevel);
    zoomContainer.innerHTML = svgHtml;
    zoomContainer.style.transform = `scale(1.0)`;

    if (zoomTitle) {
      const client = appState.clientName ? ` (${appState.clientName})` : '';
      zoomTitle.textContent = `Pradesain Arsitektur Layak Huni — Lantai ${currentFloorLevel}${client}`;
    }

    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeFloorPlanZoomModal() {
    const modal = document.getElementById('floorplan-zoom-modal');
    if (modal) {
      modal.classList.remove('active');
      const mainModal = document.getElementById('results-modal');
      if (!mainModal || !mainModal.classList.contains('active')) {
        document.body.classList.remove('modal-open');
      }
    }
  }

  function handleZoom(delta) {
    const zoomContainer = document.getElementById('zoom-content-wrapper');
    if (!zoomContainer) return;
    if (delta === 0) {
      zoomLevel = 1.0;
    } else {
      zoomLevel = Math.min(2.5, Math.max(0.6, Math.round((zoomLevel + delta) * 10) / 10));
    }
    zoomContainer.style.transform = `scale(${zoomLevel})`;
  }

  function handleDownloadFloorPlanSvg() {
    if (!currentFloorParams) return;
    const svgContent = FloorPlanEngine.generateFloorPlanSvg(currentFloorParams, currentFloorLevel);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const clientSanitized = (appState.clientName || 'Klien').replace(/[^a-zA-Z0-9]/g, '-');
    link.href = url;
    link.download = `pradesain-denah-lantai-${currentFloorLevel}-${clientSanitized}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Denah Lantai ${currentFloorLevel} berhasil diunduh (vektor SVG) ✓`);
  }

  function handleDownloadFloorPlanPdf() {
    if (!currentFloorParams) {
      window.print();
      return;
    }
    const svgContent = FloorPlanEngine.generateFloorPlanSvg(currentFloorParams, currentFloorLevel);
    showToast('Menyiapkan lembar pradesain arsitektur PDF...');
    const client = appState.clientName ? `-${encodeURIComponent(appState.clientName)}` : '';
    printFloorPlanOnly(svgContent, `Pradesain-Denah-Lantai-${currentFloorLevel}${client}-Studio-Lentera`);
  }

  function printFloorPlanOnly(svgMarkup, title) {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    try {
      const doc = printFrame.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>${title || 'Pradesain Denah Layak Huni - Studio Lentera'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 6mm;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              background-color: #FFFFFF;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 0;
            }
            .blueprint-sheet {
              width: 100%;
              max-width: 195mm;
              height: auto;
              margin: 0 auto;
            }
            svg {
              width: 100%;
              height: auto;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="blueprint-sheet">
            ${svgMarkup}
          </div>
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        } catch (err) {
          window.print();
        }
        setTimeout(() => {
          if (printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
        }, 15000);
      }, 350);
    } catch (e) {
      window.print();
    }
  }

  // --- ACTIONS (COPY, SHARE, PRINT) ---
  function handleShareApp(includeResults = false) {
    const appUrl = window.location.href.split('#')[0];
    const shareTitle = "Rumah Masa Depan — Eksplorasi Desain & Denah Arsitektur";
    let shareText = "Yuk coba temukan gaya rumah dan denah layak hunimu secara online & gratis di sini:";

    if (includeResults && recommendationResult && recommendationResult.top3 && recommendationResult.top3[0]) {
      const top1 = recommendationResult.top3[0];
      const client = appState.clientName ? ` untuk ${appState.clientName}` : '';
      shareText = `Hasil eksplorasi rumah impian saya${client} di Rumah Masa Depan: Gaya ${top1.label} (${top1.percentage}% cocok). Coba temukan juga di:`;
    }

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: appUrl
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          copyLinkFallback(appUrl);
        }
      });
    } else {
      copyLinkFallback(appUrl);
    }
  }

  function copyLinkFallback(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link aplikasi berhasil disalin! Siap dikirim 🔗');
      }).catch(() => {
        fallbackCopyText(url);
        showToast('Link aplikasi berhasil disalin! 🔗');
      });
    } else {
      fallbackCopyText(url);
      showToast('Link aplikasi berhasil disalin! 🔗');
    }
  }

  function handleCopyBrief() {
    if (!recommendationResult) return;
    const paragraphs = buildNarrativeBrief(recommendationResult);
    const fullText = paragraphs.join('\n\n');

    const copyBtn = document.getElementById('btn-copy-brief');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        showCopyFeedback(copyBtn);
      }).catch(() => {
        fallbackCopyText(fullText, copyBtn);
      });
    } else {
      fallbackCopyText(fullText, copyBtn);
    }
  }

  function fallbackCopyText(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      if (btn) showCopyFeedback(btn);
    } catch (e) {
      showToast('Gagal menyalin brief. Silakan salin manual.');
    }
    document.body.removeChild(textarea);
  }

  function showCopyFeedback(btn) {
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Tersalin ✓';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
    showToast('Brief berhasil disalin ke clipboard ✓');
  }

  function handlePrintPdf() {
    window.print();
  }

  // --- RESET & BACKUP FILE HANDLERS ---
  function handleResetAnswers() {
    const btn = document.getElementById('btn-reset');
    if (!btn) return;

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
      btn.textContent = 'Mulai ulang';

      appState = {
        answers: {},
        customTexts: {},
        extraNotes: {},
        landSize: "",
        clientName: "",
        currentStep: 0,
        quizStarted: false
      };
      saveStateToStorage();
      renderQuizStage();
      showToast('Semua jawaban telah dibersihkan.');
    } else {
      btn.textContent = 'Ya, mulai ulang';
      btn.style.color = '#B91C1C';
      resetTimer = setTimeout(() => {
        btn.textContent = 'Mulai ulang';
        btn.style.color = '';
        resetTimer = null;
      }, 3000);
    }
  }

  function handleSaveToFile() {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "rumah_masa_depan_jawaban.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('File jawaban berhasil diunduh.');
    } catch (e) {
      showToast('Gagal menyimpan file.');
    }
  }

  function handleLoadFromFile() {
    const fileInput = document.getElementById('file-input-load');
    if (fileInput) fileInput.click();
  }

  function handleFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && typeof parsed === 'object') {
          appState = {
            answers: parsed.answers || {},
            customTexts: parsed.customTexts || {},
            extraNotes: parsed.extraNotes || {},
            landSize: parsed.landSize || "",
            clientName: parsed.clientName || "",
            currentStep: parsed.currentStep || 0,
            quizStarted: true
          };
          saveStateToStorage();
          renderQuizStage();
          showToast('Jawaban berhasil dipulihkan dari file ✓');
        }
      } catch (err) {
        showToast('Format file tidak sesuai.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  // --- PWA SETUP (Hanya muncul di hasil / bottom) ---
  function setupPwa() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const pwaCard = document.getElementById('results-pwa-card');
      if (pwaCard) pwaCard.style.display = 'flex';
    });

    const installBtn = document.getElementById('btn-pwa-install');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (!deferredInstallPrompt) {
          showToast('Untuk pasang di iPhone/iPad: tekan ikon Bagikan (Share) lalu "Tambah ke Layar Utama" 📲', 4500);
          return;
        }
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(() => {
          deferredInstallPrompt = null;
          showToast('Aplikasi berhasil dipasang di layar utama! ✓');
        });
      });
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      try {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      } catch (e) {}
    }
  }

  // --- THEME MANAGEMENT (MODE SIANG / MALAM) ---
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    const iconEl = document.getElementById('theme-icon');
    const textEl = document.getElementById('theme-text');
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (iconEl) iconEl.textContent = isDark ? '☀️' : '🌙';
    if (textEl) textEl.textContent = isDark ? 'Siang' : 'Malam';
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#121413' : '#FFFFFF');
    }
  }

  function setupThemeToggle() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('hvb_theme');
    } catch (e) {}

    if (!savedTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        savedTheme = 'dark';
      } else {
        savedTheme = 'light';
      }
    }

    applyTheme(savedTheme);

    const toggleBtn = document.getElementById('btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
          localStorage.setItem('hvb_theme', nextTheme);
        } catch (e) {}
        showToast(nextTheme === 'dark' ? 'Mode Malam aktif 🌙' : 'Mode Siang aktif ☀️');
      });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    setupThemeToggle();
    loadStateFromStorage();
    renderQuizStage();

    // Hero start button -> Masuk ke tampilan single-card kuis
    const heroStartBtn = document.getElementById('btn-hero-scroll');
    if (heroStartBtn) {
      heroStartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startQuiz();
      });
    }

    const brandHeaderLink = document.getElementById('brand-header-link');
    if (brandHeaderLink) {
      brandHeaderLink.addEventListener('click', (e) => {
        e.preventDefault();
        appState.quizStarted = false;
        saveStateToStorage();
        renderQuizStage();
      });
    }

    // Modal close & overlay
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeResultsModal);

    const modalOverlay = document.getElementById('results-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeResultsModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeResultsModal();
        closeFloorPlanZoomModal();
      }
    });

    // Personalization update in Modal
    const btnUpdateClient = document.getElementById('btn-update-client-name');
    const inputClientModal = document.getElementById('modal-edit-client-name');
    if (btnUpdateClient && inputClientModal) {
      btnUpdateClient.addEventListener('click', () => {
        const newName = inputClientModal.value.trim();
        appState.clientName = newName;
        saveStateToStorage();
        const displayEl = document.getElementById('results-display-client-name');
        if (displayEl) {
          displayEl.textContent = newName ? `Rumah Impian ${newName}` : 'Rumah Impian Bapak / Ibu';
        }
        renderFloorPlanToModal(currentFloorLevel);
        updateAllWhatsAppLinks();
        showToast('Nama pada dokumen & denah berhasil diperbarui ✓');
      });

      inputClientModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnUpdateClient.click();
        }
      });
    }

    // Modal action buttons
    const copyBtn = document.getElementById('btn-copy-brief');
    if (copyBtn) copyBtn.addEventListener('click', handleCopyBrief);

    const printBtn = document.getElementById('btn-print-pdf');
    if (printBtn) printBtn.addEventListener('click', handlePrintPdf);

    const waBtn = document.getElementById('btn-whatsapp');
    if (waBtn) waBtn.addEventListener('click', () => window.open(generateWhatsAppUrl(), '_blank'));

    // Share link buttons
    const headerShareBtn = document.getElementById('btn-header-share');
    if (headerShareBtn) headerShareBtn.addEventListener('click', () => handleShareApp(false));

    const heroShareBtn = document.getElementById('btn-hero-share');
    if (heroShareBtn) heroShareBtn.addEventListener('click', () => handleShareApp(false));

    const modalShareBtn = document.getElementById('btn-modal-share');
    if (modalShareBtn) modalShareBtn.addEventListener('click', () => handleShareApp(true));

    // Floor Plan Tabs & Action Buttons
    const tabFloor1 = document.getElementById('btn-tab-floor-1');
    if (tabFloor1) tabFloor1.addEventListener('click', () => renderFloorPlanToModal(1));

    const tabFloor2 = document.getElementById('btn-tab-floor-2');
    if (tabFloor2) tabFloor2.addEventListener('click', () => renderFloorPlanToModal(2));

    const viewZoomBtn = document.getElementById('btn-view-floorplan-zoom');
    if (viewZoomBtn) viewZoomBtn.addEventListener('click', openFloorPlanZoomModal);

    const closeZoomBtn = document.getElementById('btn-close-zoom');
    if (closeZoomBtn) closeZoomBtn.addEventListener('click', closeFloorPlanZoomModal);

    const zoomInBtn = document.getElementById('btn-zoom-in');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => handleZoom(0.2));

    const zoomOutBtn = document.getElementById('btn-zoom-out');
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => handleZoom(-0.2));

    const zoomResetBtn = document.getElementById('btn-zoom-reset');
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => handleZoom(0));

    const dlSvgBtn = document.getElementById('btn-download-floorplan-svg');
    if (dlSvgBtn) dlSvgBtn.addEventListener('click', handleDownloadFloorPlanSvg);

    const dlPdfBtn = document.getElementById('btn-download-floorplan-pdf');
    if (dlPdfBtn) dlPdfBtn.addEventListener('click', handleDownloadFloorPlanPdf);

    const dlZoomPdfBtn = document.getElementById('btn-zoom-download-pdf');
    if (dlZoomPdfBtn) dlZoomPdfBtn.addEventListener('click', handleDownloadFloorPlanPdf);

    const zoomOverlay = document.getElementById('floorplan-zoom-modal');
    if (zoomOverlay) {
      zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay) closeFloorPlanZoomModal();
      });
    }

    // Reset & Backup
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', handleResetAnswers);

    const saveFileBtn = document.getElementById('btn-save-file');
    if (saveFileBtn) saveFileBtn.addEventListener('click', handleSaveToFile);

    const loadFileBtn = document.getElementById('btn-load-file');
    if (loadFileBtn) loadFileBtn.addEventListener('click', handleLoadFromFile);

    const fileInput = document.getElementById('file-input-load');
    if (fileInput) fileInput.addEventListener('change', handleFileSelected);

    setupPwa();
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
