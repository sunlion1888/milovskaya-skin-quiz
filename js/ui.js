// ========== Вспомогательные функции ==========

function createButton(text, options = {}) {
  const btn = document.createElement('button');
  btn.className = `btn ${options.cls || 'btn-black'}`;
  btn.textContent = text;
  if (options.onClick) btn.addEventListener('click', options.onClick);
  if (options.disabled) btn.disabled = true;
  return btn;
}

function triggerHaptic(type = 'light') {
  try {
    if (tg.HapticFeedback) {
      if (type === 'light') tg.HapticFeedback.impactOccurred('light');
      else if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
      else if (type === 'warning') tg.HapticFeedback.notificationOccurred('warning');
      else if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
    }
  } catch(e) {}
}

function openBotLink(cmd) {
  const url = `https://t.me/AssistentMilovskayaBot?start=${cmd}`;
  try { tg.openTelegramLink(url); } catch(e) { alert('Не удалось открыть ссылку'); }
}

function closePolicyModal() { document.getElementById('policyModal').classList.remove('show'); }

// ========== Генераторы контента ==========

function buildWelcomeContent() {
  const frag = document.createDocumentFragment();
  const logoWrap = document.createElement('div');
  logoWrap.className = 'logo-wrap';
  const img = document.createElement('img');
  img.className = 'logo-img';
  img.src = LOGO_URL;
  img.alt = 'Ирина Миловская';
  img.onerror = () => { img.style.display = 'none'; };
  logoWrap.appendChild(img);
  frag.appendChild(logoWrap);

  const h1 = document.createElement('h1');
  h1.className = 'cormorant welcome-title';
  h1.innerHTML = 'Карта кожи<br>от Ирины Миловской';
  frag.appendChild(h1);

  const gr = tg.initDataUnsafe?.user?.first_name || '';
  const greeting = gr ? `, ${gr}` : '';
  const p = document.createElement('p');
  p.className = 'welcome-by';
  p.textContent = `Привет${greeting}! Я Ирина — ваш личный мини-косметолог 👩‍⚕️\n\nДавайте за 2 минуты определим клинический тип вашей кожи, и я подготовлю персональный протокол ухода и чекап организма.`;
  frag.appendChild(p);

  const method = document.createElement('div');
  method.className = 'method-note';
  method.textContent = 'Алгоритм основан на международной классификации Baumann Skin Type System (BSTI) с клинической адаптацией';
  frag.appendChild(method);

  const statsRow = document.createElement('div');
  statsRow.className = 'stats-row';
  ['12|вопросов', '2|минуты', '360°|подход'].forEach(s => {
    const [num, lbl] = s.split('|');
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `<div class="stat-num">${num}</div><div class="stat-lbl">${lbl}</div>`;
    statsRow.appendChild(item);
  });
  frag.appendChild(statsRow);

  const disclaimer = document.createElement('div');
  disclaimer.className = 'method-note';
  disclaimer.textContent = '⚠️ Квиз — авторский образовательный инструмент. Результат носит ознакомительный характер и не является медицинским диагнозом.';
  frag.appendChild(disclaimer);

  return frag;
}

function buildWelcomeFooter() {
  const f = document.createDocumentFragment();
  f.appendChild(createButton('Начать диагностику →', {
    cls: 'btn-black',
    onClick: () => { triggerHaptic('medium'); checkLockAndNavigate(); }
  }));
  const micro = document.createElement('div');
  micro.style.fontSize = '10px'; micro.style.color = '#999';
  micro.style.textAlign = 'center'; micro.style.marginTop = '8px';
  micro.textContent = 'Нажимая, вы соглашаетесь на обработку персональных данных';
  f.appendChild(micro);
  return f;
}

// Проверка блокировки 30 дней
function checkLockAndNavigate() {
  const lockUntil = localStorage.getItem(LOCK_KEY);
  if (lockUntil && Date.now() < parseInt(lockUntil)) {
    const daysLeft = Math.ceil((parseInt(lockUntil) - Date.now()) / (1000 * 60 * 60 * 24));
    alert(`Повторное тестирование будет доступно через ${daysLeft} дн.`);
    return;
  }
  navigateTo('science');
}

function buildScienceContent() {
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.innerHTML = `
    <span class="prep-icon">🧬</span>
    <h2 class="cormorant ns-title">Ваш тип кожи — не навсегда</h2>
    <p class="ns-sub">Согласно системе типирования Бауманн (BSTI), тип кожи — это динамическая характеристика.</p>
    <div class="prep-list">
      <div class="prep-item"><div class="prep-num">1</div><div class="prep-txt">Возраст и гормональные изменения</div></div>
      <div class="prep-item"><div class="prep-num">2</div><div class="prep-txt">Смена климата и сезонов</div></div>
      <div class="prep-item"><div class="prep-num">3</div><div class="prep-txt">Стресс, питание, лекарства</div></div>
    </div>
    <p style="font-size:12px; color:#666; margin-top:16px;">Рекомендуется проходить типирование ежегодно.</p>
  `;
  return div;
}

function buildScienceFooter() {
  return createButton('Понятно, продолжаем →', { onClick: () => navigateTo('prep') });
}

// ... (buildPrepContent, buildPrepFooter, buildNameContent, buildNameFooter – аналогично предыдущему этапу,
// только buildNameFooter использует проверку имени и переход к quiz)

function buildNameFooter() {
  const f = document.createDocumentFragment();
  f.appendChild(createButton('Перейти к вопросам →', {
    onClick: () => {
      const c = (S.userName || '').trim();
      if (c.length < 2) {
        S.nerr = true;
        document.getElementById('nerr')?.classList.add('show');
        triggerHaptic('warning');
        return;
      }
      triggerHaptic('medium');
      navigateTo('quiz');
    }
  }));
  f.appendChild(createButton('← Назад', { cls: 'btn-outline', onClick: () => navigateTo('prep') }));
  return f;
}

// === Квиз ===
function buildQuizContent() {
  const q = Q[S.qi];
  const frag = document.createDocumentFragment();
  const qCard = document.createElement('div');
  qCard.className = 'q-card';
  qCard.innerHTML = `<h2 class="cormorant q-title">${q.title}</h2>${q.hint ? `<p class="q-hint">${q.hint}</p>` : ''}`;
  frag.appendChild(qCard);

  const optsDiv = document.createElement('div');
  optsDiv.className = 'opts';
  q.opts.forEach((o, i) => {
    const opt = document.createElement('button');
    opt.className = `opt ${S.sel === i ? 'sel' : ''}`;
    opt.setAttribute('role', 'radio');
    opt.setAttribute('aria-checked', S.sel === i);
    opt.tabIndex = 0;
    opt.innerHTML = `<div class="opt-dot"></div><span>${o.t}</span>`;
    opt.addEventListener('click', () => selectOption(i, opt));
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(i, opt);
      }
    });
    optsDiv.appendChild(opt);
  });
  frag.appendChild(optsDiv);
  return frag;
}

function selectOption(index, element) {
  triggerHaptic('light');
  S.sel = index;
  document.querySelectorAll('.opt').forEach(el => {
    el.classList.remove('sel');
    el.setAttribute('aria-checked', 'false');
  });
  element.classList.add('sel');
  element.setAttribute('aria-checked', 'true');
  updateQuizFooter();
}

function buildQuizFooter() {
  const f = document.createDocumentFragment();
  // Кнопка "Назад" (если не первый вопрос)
  if (S.qi > 0) {
    f.appendChild(createButton('← Назад', {
      cls: 'btn-outline',
      onClick: () => goBackQuestion()
    }));
  }
  f.appendChild(createButton('Далее →', {
    cls: 'btn-black',
    disabled: S.sel === null,
    onClick: () => goNextQuestion()
  }));
  return f;
}

function goNextQuestion() {
  if (S.sel === null) return;
  triggerHaptic('medium');
  const o = Q[S.qi].opts[S.sel];
  for (const [k, v] of Object.entries(o.s)) S.scores[k] += v;
  S.answers.push(S.sel);
  saveProgress();

  if (S.qi < Q.length - 1) {
    S.qi++;
    S.sel = null;
    S.direction = 1;
    updateQuizUI();
  } else {
    navigateTo('consent');
  }
}

function goBackQuestion() {
  if (S.qi === 0) return;
  // откат баллов
  const lastAnswer = S.answers.pop();
  const lastQ = Q[S.qi - 1];
  const o = lastQ.opts[lastAnswer];
  for (const [k, v] of Object.entries(o.s)) S.scores[k] -= v;
  S.qi--;
  S.sel = (S.answers.length > 0) ? S.answers[S.answers.length - 1] : null;
  S.direction = -1;
  updateQuizUI();
}

function saveProgress() {
  const stateToSave = {
    qi: S.qi,
    scores: S.scores,
    answers: S.answers,
    userName: S.userName,
    consent: S.consent
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
}

// Обновление UI квиза с анимацией
function updateQuizUI() {
  // анимация контента
  const content = document.getElementById('appContent');
  const exitClass = S.direction === 1 ? 'slide-left-exit' : 'slide-right-exit';
  const enterClass = S.direction === 1 ? 'slide-left-enter' : 'slide-right-enter';
  content.classList.add(exitClass);
  setTimeout(() => {
    content.innerHTML = '';
    content.classList.remove(exitClass);
    content.appendChild(buildQuizContent());
    content.classList.add(enterClass);
    setTimeout(() => content.classList.remove(enterClass), 300);
  }, 300);

  // обновить прогресс и футер
  const pct = Math.round(((S.qi + 1) / Q.length) * 100);
  document.querySelector('.pb-inner').style.width = pct + '%';
  document.querySelector('.step-txt').textContent = `${S.qi + 1} / ${Q.length}`;
  updateQuizFooter();

  // автофокус
  if (window.innerWidth > 768) {
    const firstOpt = document.querySelector('.opt');
    if (firstOpt) firstOpt.focus();
  }
}

function updateQuizFooter() {
  const footer = document.getElementById('appFooter');
  footer.innerHTML = '';
  footer.appendChild(buildQuizFooter());
}

// === Consent ===
function buildConsentContent() {
  const nameGreet = S.userName ? `, ${S.userName.trim()}` : '';
  const div = document.createElement('div');
  div.className = 'consent-screen';
  div.innerHTML = `
    <span class="prep-icon">📋</span>
    <h2 class="cormorant ns-title">Финальный шаг${nameGreet}</h2>
    <p class="consent-sub">Подтвердите согласие для расчета клинического алгоритма</p>
  `;
  const row = document.createElement('div');
  row.id = 'cr';
  row.className = `consent-row ${S.consent ? 'active' : ''}`;
  row.addEventListener('click', () => {
    S.consent = !S.consent;
    row.classList.toggle('active', S.consent);
    document.getElementById('cerr')?.classList.remove('show');
    updateConsentFooter();
  });
  row.innerHTML = `
    <div class="check-box"><span class="check-mark">✓</span></div>
    <div class="consent-txt">Даю согласие на обработку данных согласно <span class="consent-link" id="policyLink">Политике конфиденциальности</span></div>
  `;
  row.querySelector('#policyLink').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('policyModal').classList.add('show');
  });
  div.appendChild(row);
  const cerr = document.createElement('div');
  cerr.id = 'cerr';
  cerr.className = 'err-hint';
  cerr.textContent = 'Необходимо согласие для продолжения';
  if (S.cerr) cerr.classList.add('show');
  div.appendChild(cerr);
  return div;
}

function buildConsentFooter() {
  return createButton('Сформировать мой протокол 🎯', {
    cls: 'btn-black',
    disabled: !S.consent,
    onClick: () => {
      if (!S.consent) {
        S.cerr = true;
        document.getElementById('cerr')?.classList.add('show');
        triggerHaptic('warning');
        return;
      }
      triggerHaptic('success');
      navigateTo('loading');
      startLoading();
    }
  });
}

function updateConsentFooter() {
  const footer = document.getElementById('appFooter');
  footer.innerHTML = '';
  footer.appendChild(buildConsentFooter());
}

// === Loading ===
function buildLoadingScreen() {
  const div = document.createElement('div');
  div.className = 'loading-full';
  div.innerHTML = `
    <img src="${LOGO_URL}" class="loading-logo" alt="Анализ...">
    <div class="cormorant loading-title">Синтезирую протокол...</div>
    <div class="loading-progress">
      <div id="loadingBar" class="loading-progress-bar" style="width:0%"></div>
    </div>
    <div id="loadingHint" class="loading-hint">Анализирую ответы...</div>
  `;
  return div;
}

function startLoading() {
  const hints = [
    'Анализирую ответы...',
    'Подбираю нутрицевтики...',
    'Формирую протокол...'
  ];
  let progress = 0;
  const bar = document.getElementById('loadingBar');
  const hintEl = document.getElementById('loadingHint');
  const interval = setInterval(() => {
    progress += 20;
    if (bar) bar.style.width = progress + '%';
    if (hintEl && hints[Math.floor(progress/34)]) hintEl.textContent = hints[Math.floor(progress/34)];
    if (progress >= 100) {
      clearInterval(interval);
      calcResult();
    }
  }, 400);
  S.loadingInterval = interval;
}

// === Результат ===
function buildResultContent() {
  const t = TYPES[S.result];
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.style.padding = '24px 0 40px';
  wrap.innerHTML = `
    <div style="text-align:center; margin-bottom:24px;">
      <span class="res-emoji">${t.emoji}</span>
      <div class="res-tag">Ваш клинический профиль</div>
      <h2 class="cormorant res-name">${t.name}</h2>
      <p class="res-desc">${t.desc}</p>
    </div>
    <div class="r-section">
      <div class="r-title">💉 Косметология</div>
      <div class="r-card"><ul class="r-ul">${t.procs.map(p => `<li class="r-li">${p}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">🧪 Check-Up</div>
      <div class="r-card" style="background: var(--gray-light);"><ul class="r-ul">${t.tests.map(c => `<li class="r-li">${c}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">💊 Нутрицевтики</div>
      <div>${t.nutri.map(n => `<span class="nutri-tag">${n}</span>`).join('')}</div>
    </div>
    <div class="fine-print">Протокол носит информационный характер. Не является медицинским диагнозом.</div>
  `;

  // История
  if (S.history.length > 0) {
    const histBlock = document.createElement('div');
    histBlock.className = 'history-block';
    histBlock.innerHTML = '<div class="history-title">📋 История прохождений</div>';
    S.history.slice(-3).reverse().forEach(h => {
      const date = new Date(h.date).toLocaleDateString();
      const tname = TYPES[h.result]?.name || h.result;
      const emoji = TYPES[h.result]?.emoji || '';
      histBlock.innerHTML += `<div class="history-item">${emoji} ${tname} — ${date}</div>`;
    });
    wrap.appendChild(histBlock);
  }

  frag.appendChild(wrap);
  return frag;
}

function buildResultFooter() {
  const f = document.createDocumentFragment();
  f.appendChild(createButton('📥 Скачать PDF (локально)', {
    cls: 'btn-gold',
    onClick: generatePDF
  }));
  f.appendChild(createButton('📥 Получить в боте', {
    cls: 'btn-outline',
    onClick: () => openBotLink('get_pdf_protocol')
  }));
  f.appendChild(createButton('✍️ Записаться к Ирине', {
    cls: 'btn-black',
    onClick: () => navigateTo('booking')
  }));
  f.appendChild(createButton('📤 Поделиться', {
    cls: 'btn-outline-dark',
    onClick: () => {
      const t = TYPES[S.result];
      const text = `Мой тип кожи по Бауманну — ${t.emoji} ${t.name}. Пройди тест: https://t.me/AssistentMilovskayaBot`;
      if (navigator.share) {
        navigator.share({ title: 'Карта кожи', text }).catch(() => {});
      } else {
        tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/AssistentMilovskayaBot&text=${encodeURIComponent(text)}`);
      }
    }
  }));
  return f;
}

// PDF генерация
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const t = TYPES[S.result];
  let y = 10;
  doc.setFontSize(16);
  doc.text(`Протокол для: ${S.userName || 'Пациент'}`, 10, y);
  y += 10;
  doc.setFontSize(14);
  doc.text(`Тип кожи: ${t.name} ${t.emoji}`, 10, y);
  y += 10;
  doc.setFontSize(12);
  doc.text(t.desc, 10, y, { maxWidth: 190 });
  y += 20;
  doc.text('Косметология:', 10, y);
  t.procs.forEach(p => { y += 7; doc.text(`• ${p}`, 15, y); });
  y += 10;
  doc.text('Check-Up:', 10, y);
  t.tests.forEach(c => { y += 7; doc.text(`• ${c}`, 15, y); });
  y += 10;
  doc.text('Нутрицевтики:', 10, y);
  t.nutri.forEach(n => { y += 7; doc.text(`• ${n}`, 15, y); });
  doc.save(`протокол_${S.userName || 'кожа'}.pdf`);
}

// Booking
function buildBookingContent() {
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.innerHTML = `
    <img src="${PHOTO_URL}" style="width:100%; max-width:280px; border-radius:20px; display:block; margin:0 auto 20px;" alt="Ирина Миловская">
    <h2 class="cormorant ns-title" style="font-size:24px;">Ирина Миловская</h2>
    <p style="text-align:center; font-size:14px; color:var(--gray); margin-bottom:16px;">Врач-косметолог, дерматолог, главный врач FGF Medical</p>
    <div style="background:var(--gray-light); border-radius:var(--r); padding:16px; margin-bottom:16px;">
      <p style="font-size:13px; line-height:1.5;"><b>📍 Санкт-Петербург</b><br>Малый пр. В.О., д. 64, корп. 1, стр. 1, помещение 100-Н<br>(ЖК The Residence)</p>
      <p style="font-size:13px; margin-top:8px;"><b>🕒 Приём:</b> четверг, пятница, воскресенье с 10:00 до 21:00</p>
    </div>
    <a href="https://t.me/fgf_medical" target="_blank" class="btn btn-black" style="margin-bottom:8px;">Написать в клинику FGF Medical</a>
    <a href="https://t.me/MilovskayaDR" target="_blank" class="btn btn-outline-dark">Написать Ирине лично</a>
  `;
  return div;
}

function buildBookingFooter() {
  return createButton('← Назад к протоколу', { cls: 'btn-outline', onClick: () => navigateTo('result') });
}

function calcResult() {
  // Остановить таймер загрузки
  if (S.loadingInterval) clearInterval(S.loadingInterval);
  let max = -1, win = 'T5';
  for (const [k, v] of Object.entries(S.scores)) {
    if (v > max) { max = v; win = k; }
  }
  S.result = win;

  // Сохранить результат и историю
  const entry = {
    result: win,
    scores: S.scores,
    date: Date.now()
  };
  S.history.push(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(S.history.slice(-10))); // храним последние 10
  // Установить блокировку на 30 дней
  localStorage.setItem(LOCK_KEY, Date.now() + LOCK_DAYS * 24 * 60 * 60 * 1000);
  // Очистить прогресс квиза
  localStorage.removeItem(STORAGE_KEY);

  navigateTo('result');

  // Отправка в Google Sheets (заглушка)
  /*
  fetch('https://script.google.com/macros/s/.../exec', {
    method: 'POST',
    body: JSON.stringify({
      name: S.userName,
      result: win,
      date: new Date().toISOString()
    })
  });
  */
}