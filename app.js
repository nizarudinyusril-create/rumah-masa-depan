/**
 * House Vision Builder - App Logic
 * 100% Offline, Vanilla JS, Zero External Libraries, Zero API calls.
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const STORAGE_KEY = 'hvb_answers_v1';

  let appState = {
    answers: {},        // { [questionId]: [optionId, ...] }
    customTexts: {},    // { [questionId]: "teks kustom" }
    extraNotes: {},     // { [questionId]: "catatan tambahan" }
    landSize: ""        // string ukuran lahan
  };

  // Cached recommendation results
  let recommendationResult = null;

  // Track reset button timer
  let resetTimer = null;

  // Track PWA install prompt
  let deferredInstallPrompt = null;

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
      // Local storage might be disabled in private mode or file:// origin in some browsers
    }
  }

  function loadStateFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          appState = {
            answers: parsed.answers || {},
            customTexts: parsed.customTexts || {},
            extraNotes: parsed.extraNotes || {},
            landSize: parsed.landSize || ""
          };
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

  // --- RENDER QUESTIONS DOM ---
  function renderQuestions() {
    const container = document.getElementById('questions-list');
    if (!container) return;
    container.innerHTML = '';

    QUESTIONS.forEach((q) => {
      const block = document.createElement('section');
      block.className = 'question-block';
      block.id = `q-block-${q.id}`;
      block.setAttribute('data-qid', q.id);

      const answered = isQuestionAnswered(q.id);

      // Header
      const header = document.createElement('div');
      header.className = 'question-header';

      header.innerHTML = `
        <div class="question-badge-row">
          <span class="question-badge">Pertanyaan ${q.number} dari 10</span>
          <span class="question-status-tag ${answered ? 'answered' : ''}" id="status-tag-${q.id}">
            ${answered ? '✓ Terjawab' : 'Belum dijawab'}
          </span>
        </div>
        <h2 class="question-title font-serif">${escapeHtml(q.title)}</h2>
        ${q.subtitle ? `<p class="question-subtitle">${escapeHtml(q.subtitle)}</p>` : ''}
      `;
      block.appendChild(header);

      // Options
      if (q.displayStyle === 'photo') {
        const photoGrid = document.createElement('div');
        photoGrid.className = 'options-photo-grid';
        photoGrid.id = `options-wrap-${q.id}`;

        const chosenList = appState.answers[q.id] || [];
        const isMaxReached = q.maxSelect && chosenList.length >= q.maxSelect;

        q.options.forEach((opt) => {
          const isSelected = chosenList.includes(opt.id);
          const isLocked = isMaxReached && !isSelected;

          const card = document.createElement('button');
          card.type = 'button';
          card.className = `option-photo-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
          card.setAttribute('role', q.selectMode === 'single' ? 'radio' : 'checkbox');
          card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
          card.setAttribute('data-qid', q.id);
          card.setAttribute('data-optid', opt.id);

          const visualMarkup = ArtEngine.renderOptionVisual(opt, q.id);

          card.innerHTML = `
            ${visualMarkup}
            <div class="card-check-badge" aria-hidden="true">${isSelected ? '✓' : ''}</div>
            <div class="card-content">
              <span class="card-label">${escapeHtml(opt.label)}</span>
              ${opt.desc ? `<span class="card-desc">${escapeHtml(opt.desc)}</span>` : ''}
            </div>
          `;

          card.addEventListener('click', () => handleOptionClick(q.id, opt.id));
          photoGrid.appendChild(card);
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
            <span class="card-desc">Tuliskan kebutuhan atau idemu sendiri jika opsi di atas belum pas.</span>
          </div>
          <div class="custom-input-box" id="custom-box-${q.id}" style="${hasCustom ? 'display:flex;' : 'display:none;'}">
            <input type="text" maxlength="120" class="custom-text-input" id="custom-input-${q.id}" placeholder="Ketik ide atau preferensimu di sini..." value="${escapeHtml(appState.customTexts[q.id] || '')}" />
            <div class="char-limit-hint"><span id="custom-count-${q.id}">${(appState.customTexts[q.id] || '').length}</span>/120 karakter</div>
          </div>
        `;

        customCard.addEventListener('click', (e) => {
          if (e.target.tagName.toLowerCase() === 'input') return;
          toggleCustomInput(q.id);
        });

        photoGrid.appendChild(customCard);
        block.appendChild(photoGrid);

      } else {
        // Chip Style
        const chipWrap = document.createElement('div');
        chipWrap.className = 'options-chip-wrap';
        chipWrap.id = `options-wrap-${q.id}`;

        const chosenList = appState.answers[q.id] || [];

        q.options.forEach((opt) => {
          const isSelected = chosenList.includes(opt.id);

          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `option-chip ${isSelected ? 'selected' : ''}`;
          chip.setAttribute('role', q.selectMode === 'single' ? 'radio' : 'checkbox');
          chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');
          chip.setAttribute('data-qid', q.id);
          chip.setAttribute('data-optid', opt.id);
          chip.innerHTML = `<span>${escapeHtml(opt.label)}</span>`;

          chip.addEventListener('click', () => handleOptionClick(q.id, opt.id));
          chipWrap.appendChild(chip);
        });

        // "✎ Tidak ada yang pas?" Chip
        const hasCustom = !!(appState.customTexts[q.id] && appState.customTexts[q.id].trim());
        const customChip = document.createElement('button');
        customChip.type = 'button';
        customChip.className = `option-chip ${hasCustom ? 'selected' : ''}`;
        customChip.id = `custom-chip-${q.id}`;
        customChip.innerHTML = `<span>✎ Tidak ada yang pas?</span>`;

        customChip.addEventListener('click', () => toggleCustomInput(q.id));
        chipWrap.appendChild(customChip);
        block.appendChild(chipWrap);

        // Custom text box for chips
        const customBox = document.createElement('div');
        customBox.className = 'custom-input-box';
        customBox.id = `custom-box-${q.id}`;
        customBox.style.display = hasCustom ? 'flex' : 'none';
        customBox.innerHTML = `
          <input type="text" maxlength="120" class="custom-text-input" id="custom-input-${q.id}" placeholder="Ketik ide atau preferensimu di sini..." value="${escapeHtml(appState.customTexts[q.id] || '')}" />
          <div class="char-limit-hint"><span id="custom-count-${q.id}">${(appState.customTexts[q.id] || '').length}</span>/120 karakter</div>
        `;
        block.appendChild(customBox);
      }

      // Max select warning container
      if (q.maxSelect) {
        const warn = document.createElement('div');
        warn.className = 'max-select-warning';
        warn.id = `warn-${q.id}`;
        warn.textContent = `Kamu sudah memilih ${q.maxSelect}. Lepas salah satu dulu untuk memilih yang lain.`;
        block.appendChild(warn);
      }

      // Extra Note Section (e.g. Question 3)
      if (q.hasExtraNote) {
        const noteBox = document.createElement('div');
        noteBox.className = 'extra-note-section';
        noteBox.innerHTML = `
          <label for="extra-note-${q.id}" class="extra-note-label">${escapeHtml(q.extraNoteLabel || 'Catatan tambahan')}</label>
          <textarea id="extra-note-${q.id}" maxlength="500" class="extra-note-textarea" placeholder="${escapeHtml(q.extraNotePlaceholder || '')}">${escapeHtml(appState.extraNotes[q.id] || '')}</textarea>
          <div class="char-limit-hint"><span id="extra-count-${q.id}">${(appState.extraNotes[q.id] || '').length}</span>/500 karakter</div>
        `;
        block.appendChild(noteBox);

        // Textarea event
        setTimeout(() => {
          const textarea = document.getElementById(`extra-note-${q.id}`);
          const countSpan = document.getElementById(`extra-count-${q.id}`);
          if (textarea && countSpan) {
            textarea.addEventListener('input', (e) => {
              appState.extraNotes[q.id] = e.target.value;
              countSpan.textContent = e.target.value.length;
              saveStateToStorage();
            });
          }
        }, 0);
      }

      container.appendChild(block);

      // Bind input events for custom text
      setTimeout(() => {
        const customInput = document.getElementById(`custom-input-${q.id}`);
        const customCount = document.getElementById(`custom-count-${q.id}`);
        if (customInput && customCount) {
          customInput.addEventListener('input', (e) => {
            const val = e.target.value;
            appState.customTexts[q.id] = val;
            customCount.textContent = val.length;
            updateCustomCardState(q.id);
            updateQuestionStatus(q.id);
            updateProgressBar();
            saveStateToStorage();
          });
        }
      }, 0);
    });

    // Render Land Size Question at Bottom
    renderLandSizeBlock();

    // Setup intersection observer for scroll fade-in
    setupScrollAnimations();

    // Update Progress
    updateProgressBar();
  }

  function renderLandSizeBlock() {
    const container = document.getElementById('land-size-container');
    if (!container) return;

    container.innerHTML = `
      <section class="land-size-card" id="land-size-block">
        <span class="land-size-badge">${escapeHtml(LAND_SIZE_QUESTION.subtitle)}</span>
        <div class="font-serif" style="font-size:0.85rem; color:var(--pine); font-weight:700; text-transform:uppercase; margin-bottom:4px;">
          ${escapeHtml(LAND_SIZE_QUESTION.eyebrow)}
        </div>
        <h2 class="question-title font-serif" style="font-size:1.4rem;">
          ${escapeHtml(LAND_SIZE_QUESTION.title)}
        </h2>
        <textarea id="land-size-input" class="land-size-textarea" maxlength="400" placeholder="${escapeHtml(LAND_SIZE_QUESTION.placeholder)}">${escapeHtml(appState.landSize || '')}</textarea>
        <div class="char-limit-hint" style="margin-top:6px;"><span id="land-size-count">${(appState.landSize || '').length}</span>/400 karakter</div>
      </section>
    `;

    const textarea = document.getElementById('land-size-input');
    const countSpan = document.getElementById('land-size-count');
    if (textarea && countSpan) {
      textarea.addEventListener('input', (e) => {
        appState.landSize = e.target.value;
        countSpan.textContent = e.target.value.length;
        saveStateToStorage();
      });
    }
  }

  // --- INTERACTION LOGIC ---
  function handleOptionClick(qId, optId) {
    const q = getQuestionById(qId);
    if (!q) return;

    if (!appState.answers[qId]) {
      appState.answers[qId] = [];
    }

    const current = appState.answers[qId];
    const index = current.indexOf(optId);

    if (q.selectMode === 'single') {
      if (index > -1) {
        // Toggle off
        appState.answers[qId] = [];
      } else {
        // Replace with new single choice
        appState.answers[qId] = [optId];
        // In single mode, clear custom text if any
        if (appState.customTexts[qId]) {
          appState.customTexts[qId] = "";
          const customInput = document.getElementById(`custom-input-${qId}`);
          if (customInput) customInput.value = "";
          updateCustomCardState(qId);
        }
      }
    } else {
      // Multi select mode
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
    updateQuestionStatus(qId);
    updateProgressBar();
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

      // If single mode, unselect regular choices
      if (q && q.selectMode === 'single') {
        appState.answers[qId] = [];
        updateOptionUI(qId);
      }
    } else {
      // If toggled off and empty, hide
      const input = document.getElementById(`custom-input-${qId}`);
      if (!input || !input.value.trim()) {
        box.style.display = 'none';
        appState.customTexts[qId] = "";
      }
    }

    updateCustomCardState(qId);
    updateQuestionStatus(qId);
    updateProgressBar();
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

    const chip = document.getElementById(`custom-chip-${qId}`);
    if (chip) {
      if (hasText) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
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

  function updateQuestionStatus(qId) {
    const tag = document.getElementById(`status-tag-${qId}`);
    if (!tag) return;
    const answered = isQuestionAnswered(qId);
    if (answered) {
      tag.classList.add('answered');
      tag.textContent = '✓ Terjawab';
    } else {
      tag.classList.remove('answered');
      tag.textContent = 'Belum dijawab';
    }
  }

  function updateProgressBar() {
    const answeredCount = countAnsweredQuestions();
    const total = 10;
    const pct = Math.round((answeredCount / total) * 100);

    const countText = document.getElementById('progress-text');
    if (countText) countText.textContent = `${answeredCount} / ${total} terjawab`;

    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const genBtn = document.getElementById('btn-generate');
    const genHint = document.getElementById('generate-hint');

    if (genBtn) {
      if (answeredCount === total) {
        genBtn.disabled = false;
        if (genHint) {
          genHint.className = 'generate-hint ready';
          genHint.textContent = 'Semua pertanyaan terjawab. Kamu bisa mengisi ukuran lahan di bawah (disarankan) sebelum generate.';
        }
      } else {
        genBtn.disabled = true;
        if (genHint) {
          genHint.className = 'generate-hint';
          const remaining = total - answeredCount;
          genHint.textContent = `Tinggal ${remaining} pertanyaan lagi untuk membuka hasil.`;
        }
      }
    }
  }

  function setupScrollAnimations() {
    const blocks = document.querySelectorAll('.question-block');
    if (!('IntersectionObserver' in window)) {
      blocks.forEach(b => b.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    blocks.forEach(b => observer.observe(b));
  }

  // --- RECOMMENDATION ENGINE (100% LOCAL ALGORITHM) ---
  function computeRecommendations() {
    const scoreMap = {};
    const reasonMap = {};

    STYLE_PROFILES.forEach((profile) => {
      scoreMap[profile.id] = 0;
      reasonMap[profile.id] = [];
    });

    // Evaluasi bobot dari Q2, Q4, Q5, Q6, Q7, Q10
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

    // Bonus +6 jika gaya itu dipilih langsung di Pertanyaan 1
    const initialChosenStyles = appState.answers["gaya"] || [];
    initialChosenStyles.forEach((styleId) => {
      if (scoreMap[styleId] !== undefined) {
        scoreMap[styleId] += 6;
      }
    });

    // Hitung persentase kecocokan yang wajar (Top style berkisar 76%–96%)
    const rawScores = Object.values(scoreMap);
    const maxScore = Math.max(...rawScores, 1);

    const ranked = STYLE_PROFILES.map((profile) => {
      const raw = scoreMap[profile.id];
      // Formula penskalaan: gaya tertinggi mendapat ~88-96%, gaya lain terdistribusi proporsional
      const percentage = Math.min(97, Math.max(64, Math.round(72 + (raw / maxScore) * 24)));

      // Format kalimat alasan
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

    // Urutkan menurun
    ranked.sort((a, b) => b.score - a.score);

    const top3 = ranked.slice(0, 3);

    // Cek mismatch antara gaya pilihan awal di Q1 vs Top 1 hasil skor
    let mismatchNote = null;
    if (initialChosenStyles.length > 0) {
      const top1Id = top3[0].id;
      const isTop1ChosenInitially = initialChosenStyles.includes(top1Id);

      if (!isTop1ChosenInitially) {
        const initialLabels = initialChosenStyles.map(id => {
          const prof = STYLE_PROFILES.find(p => p.id === id);
          return prof ? prof.label : id;
        });

        mismatchNote = `Catatan Pengamatan: Di awal kamu menyukai gaya ${joinWithAnd(initialLabels)}, namun berdasarkan kebutuhan suasana harian, sirkulasi hawa, dan material yang kamu prioritaskan, gaya ${top3[0].label} memiliki kecocokan fungsional tertinggi (${top3[0].percentage}%). Hal ini sangat wajar—kamu bisa memadukan karakter visual fasad ${initialLabels[0]} dengan kenyamanan tata ruang ${top3[0].label}.`;
      }
    }

    return {
      top3: top3,
      mismatchNote: mismatchNote,
      allRanked: ranked
    };
  }

  // --- BRIEF & SUMMARY GENERATION ---
  function buildNarrativeBrief(recs) {
    const paragraphs = [];

    // Paragraf 1: Pembuka & Top 3 Gaya
    const top1 = recs.top3[0];
    const top2 = recs.top3[1];
    const top3 = recs.top3[2];
    paragraphs.push(
      `Berdasarkan eksplorasi kebutuhan dan selera hunian melalui ${APP_CONFIG.appName}, arah desain yang paling selaras adalah gaya ${top1.label} (${top1.percentage}%), disusul oleh ${top2.label} (${top2.percentage}%) dan ${top3.label} (${top3.percentage}%). ${top1.ringkasan}`
    );

    // Paragraf 2: Suasana (Q2)
    const suasanaNames = getAnswerLabels('suasana');
    if (suasanaNames.length > 0) {
      paragraphs.push(
        `Saat melangkah pulang ke rumah setelah seharian beraktivitas, suasana utama yang ingin dirasakan adalah ${joinWithAnd(suasanaNames)}. Suasana ini dirancang menjadi jangkar kenyamanan batin bagi seluruh anggota keluarga.`
      );
    }

    // Paragraf 3: Ruang (Q3) + Extra Note
    const ruangNames = getAnswerLabels('ruang');
    let ruangText = `Untuk mendukung kegiatan harian, rumah ini dibayangkan memiliki ruang-ruang seperti: ${joinWithAnd(ruangNames)}.`;
    const noteRuang = (appState.extraNotes['ruang'] || '').trim();
    if (noteRuang) {
      ruangText += ` Khusus mengenai tata ruang, terdapat catatan prioritas: "${escapeHtml(noteRuang)}".`;
    }
    paragraphs.push(ruangText);

    // Paragraf 4: Pencahayaan (Q4)
    const cahayaNames = getAnswerLabels('pencahayaan');
    if (cahayaNames.length > 0) {
      paragraphs.push(
        `Dari segi pencahayaan, konsep yang diinginkan memadukan ${joinWithAnd(cahayaNames)}, sehingga setiap sudut ruangan mendapatkan intensitas cahaya yang tepat dan menyejukkan baik di siang maupun malam hari.`
      );
    }

    // Paragraf 5: Warna (Q5)
    const warnaNames = getAnswerLabels('warna');
    if (warnaNames.length > 0) {
      paragraphs.push(
        `Nuansa warna yang paling mewakili identitas rumah adalah ${joinWithAnd(warnaNames)}, menciptakan harmoni visual yang teduh dan konsisten di seluruh elemen bangunan.`
      );
    }

    // Paragraf 6: Material (Q6)
    const matNames = getAnswerLabels('material');
    if (matNames.length > 0) {
      paragraphs.push(
        `Untuk sentuhan tekstur dan materialitas, pilihan utama bertumpu pada ${joinWithAnd(matNames)}. Kombinasi material ini memberikan kekayaan visual yang menyenangkan saat dilihat sekaligus ramah saat disentuh sehari-hari.`
      );
    }

    // Paragraf 7: Ventilasi (Q7)
    const ventNames = getAnswerLabels('ventilasi');
    if (ventNames.length > 0) {
      paragraphs.push(
        `Sirkulasi udara dan kenyamanan termal diwujudkan melalui sistem ${joinWithAnd(ventNames)}, memastikan rumah selalu bernapas bebas dari udara pengap tanpa harus bergantung penuh pada pendingin ruangan.`
      );
    }

    // Paragraf 8: Penghuni (Q8)
    const userNames = getAnswerLabels('penghuni');
    if (userNames.length > 0) {
      paragraphs.push(
        `Tata ruang dan sirkulasi dirancang dengan mempertimbangkan interaksi para penghuni dan pengunjung rutin, yaitu ${joinWithAnd(userNames)}, agar rumah menjadi tempat tumbuh yang aman, ramah, dan inklusif.`
      );
    }

    // Paragraf 9: Progres (Q9)
    const progNames = getAnswerLabels('progres');
    if (progNames.length > 0) {
      paragraphs.push(
        `Tahap persiapan pembangunan saat ini berada pada posisi: ${joinWithAnd(progNames)}. Informasi ini menjadi pijakan awal yang sangat berharga dalam menentukan skala prioritas pada konsultasi arsitektur.`
      );
    }

    // Paragraf 10: Hal Dihindari (Q10)
    const hindarNames = getAnswerLabels('dihindari');
    if (hindarNames.length > 0) {
      paragraphs.push(
        `Hal-hal penting yang ingin dihindari dalam desain maupun konstruksi hunian ini meliputi: ${joinWithAnd(hindarNames)}. Poin-poin ini menjadi batasan tegas yang perlu diantisipasi sejak pembuatan konsep denah awal.`
      );
    }

    // Paragraf 11: Ukuran Lahan (jika diisi)
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

  // --- MODAL RENDERING ---
  function openResultsModal() {
    recommendationResult = computeRecommendations();
    const modal = document.getElementById('results-modal');
    if (!modal) return;

    // 1. Render Top 3 Styles
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

    // 2. Render Summary Grid
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

      // Tambahkan kartu ukuran lahan jika diisi
      if (appState.landSize && appState.landSize.trim()) {
        const landCard = document.createElement('div');
        landCard.className = 'summary-card';
        landCard.innerHTML = `
          <div class="summary-question-title">Perkiraan Ukuran Lahan & Bangunan</div>
          <div class="summary-answer-text">${escapeHtml(appState.landSize.trim())}</div>
        `;
        summaryGrid.appendChild(landCard);
      }
    }

    // 3. Render Narrative Brief
    const briefBox = document.getElementById('narrative-brief-box');
    if (briefBox) {
      const paragraphs = buildNarrativeBrief(recommendationResult);
      briefBox.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // 4. Render Denah Arsitektural Layak Huni
    renderFloorPlanToModal(1);

    // Tampilkan modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus ke close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeResultsModal() {
    const modal = document.getElementById('results-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }

    const genBtn = document.getElementById('btn-generate');
    if (genBtn) genBtn.focus();
  }

  // --- FLOOR PLAN STATE & ENGINE HANDLERS ---
  let currentFloorParams = null;
  let currentFloorLevel = 1;
  let zoomLevel = 1.0;

  function renderFloorPlanToModal(level = 1) {
    if (typeof FloorPlanEngine === 'undefined') return;
    currentFloorLevel = level;
    currentFloorParams = FloorPlanEngine.analyzeRequirements(appState.answers, appState.landSize, appState.extraNotes);

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

    // Update WhatsApp link for Studio Lentera consultation
    const lenteraWaBtn = document.getElementById('btn-lentera-consult-wa');
    if (lenteraWaBtn) {
      const topStyleName = (recommendationResult && recommendationResult.top3 && recommendationResult.top3[0])
        ? recommendationResult.top3[0].label
        : 'Modern';
      const msg = `Halo Studio Lentera, saya telah mengisi form eksplorasi di Rumah Masa Depan dan mendapatkan rekomendasi gaya ${topStyleName} serta skema denah pembagian ruang untuk lahan ${currentFloorParams.widthM}x${currentFloorParams.lengthM} m.\n\nAlangkah baiknya saya ingin berkonsultasi lebih lanjut dengan Studio Lentera untuk membuat denah yang lebih profesional, perhitungan struktur, dan gambar kerja teknis.`;
      lenteraWaBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
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
      zoomTitle.textContent = `Denah Arsitektur Layak Huni — Lantai ${currentFloorLevel}`;
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
    link.href = url;
    link.download = `denah-arsitektur-lantai-${currentFloorLevel}.svg`;
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
    showToast('Menyiapkan lembar denah arsitektur PDF...');
    printFloorPlanOnly(svgContent, `Denah-Arsitektur-Lantai-${currentFloorLevel}-Studio-Lentera`);
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
          <title>${title || 'Denah Arsitektur Layak Huni - Studio Lentera'}</title>
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

  // --- ACTIONS (COPY, PDF, WHATSAPP, SHARE LINK) ---
  function handleShareApp(includeResults = false) {
    const appUrl = window.location.href.split('#')[0];
    const shareTitle = "House Vision Builder — Temukan Gambaran Rumah Impianmu";
    let shareText = "Yuk coba eksplorasi gaya arsitektur rumah impianmu gratis secara online di sini:";

    if (includeResults && recommendationResult && recommendationResult.top3 && recommendationResult.top3[0]) {
      const top1 = recommendationResult.top3[0];
      shareText = `Hasil eksplorasi rumah impian saya di House Vision Builder: Gaya ${top1.label} (${top1.percentage}% cocok). Coba temukan gaya rumahmu juga gratis di sini:`;
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
        showToast('Link aplikasi berhasil disalin! Siap dikirim ke teman atau keluarga 🔗');
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
      showCopyFeedback(btn);
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

  function handleWhatsAppConsultation() {
    if (!APP_CONFIG.whatsappEnabled) return;

    if (!navigator.onLine) {
      showToast('Butuh internet untuk membuka WhatsApp. Gunakan Copy Brief dulu.');
      return;
    }

    if (!recommendationResult) return;

    const prefix = `Halo kakak, saya telah mengisi semua jawaban dari House Vision Builder. Saya menginginkan draft informasi hasil pilihan berikut, oleh karena itu saya ingin berkonsultasi mengenai style dan pilihan untuk rumah impian saya:`;

    const paragraphs = buildNarrativeBrief(recommendationResult);
    const fullBrief = paragraphs.join('\n\n');
    let fullMessage = `${prefix}\n\n${fullBrief}`;

    // Jika pesan terlalu panjang (> 1500 karakter), gunakan ringkasan per pertanyaan
    if (fullMessage.length > 1500) {
      const summaryLines = [];
      summaryLines.push(`*Rekomendasi Gaya:* ${recommendationResult.top3.map(t => `${t.label} (${t.percentage}%)`).join(', ')}`);
      QUESTIONS.forEach(q => {
        const labels = getAnswerLabels(q.id);
        if (labels.length > 0) {
          summaryLines.push(`*${q.title}:* ${joinWithAnd(labels)}`);
        }
      });
      if (appState.landSize && appState.landSize.trim()) {
        summaryLines.push(`*Ukuran Lahan:* ${appState.landSize.trim()}`);
      }
      fullMessage = `${prefix}\n\n${summaryLines.join('\n')}`;
    }

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // --- RESET & BACKUP FILE HANDLERS ---
  function handleResetAnswers() {
    const btn = document.getElementById('btn-reset');
    if (!btn) return;

    if (resetTimer) {
      // Konfirmasi kedua: eksekusi reset
      clearTimeout(resetTimer);
      resetTimer = null;
      btn.textContent = 'Mulai ulang';

      appState = {
        answers: {},
        customTexts: {},
        extraNotes: {},
        landSize: ""
      };
      saveStateToStorage();
      renderQuestions();
      showToast('Semua jawaban telah dibersihkan.');
    } else {
      // Klik pertama: tampilkan konfirmasi selama 3 detik
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
      downloadAnchor.setAttribute("download", "hvb_jawaban_rumah.json");
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
            landSize: parsed.landSize || ""
          };
          saveStateToStorage();
          renderQuestions();
          showToast('Jawaban berhasil dipulihkan dari file ✓');
        }
      } catch (err) {
        showToast('Format file tidak sesuai.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }

  // --- PWA INSTALL BANNER ---
  function setupPwa() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const banner = document.getElementById('install-banner');
      if (banner) banner.classList.add('active');
    });

    const installBtn = document.getElementById('btn-pwa-install');
    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(() => {
          deferredInstallPrompt = null;
          const banner = document.getElementById('install-banner');
          if (banner) banner.classList.remove('active');
        });
      });
    }

    // Registrasi Service Worker hanya jika bukan file://
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
    renderQuestions();

    // Event listeners tombol utama
    const genBtn = document.getElementById('btn-generate');
    if (genBtn) genBtn.addEventListener('click', openResultsModal);

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeResultsModal);

    const modalOverlay = document.getElementById('results-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeResultsModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeResultsModal();
    });

    // Modal action buttons
    const copyBtn = document.getElementById('btn-copy-brief');
    if (copyBtn) copyBtn.addEventListener('click', handleCopyBrief);

    const printBtn = document.getElementById('btn-print-pdf');
    if (printBtn) printBtn.addEventListener('click', handlePrintPdf);

    const waBtn = document.getElementById('btn-whatsapp');
    if (waBtn) waBtn.addEventListener('click', handleWhatsAppConsultation);

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

    // Hero scroll button
    const heroScrollBtn = document.getElementById('btn-hero-scroll');
    if (heroScrollBtn) {
      heroScrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const firstQ = document.getElementById('q-block-gaya');
        if (firstQ) firstQ.scrollIntoView({ behavior: 'smooth' });
      });
    }

    setupPwa();
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
