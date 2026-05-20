// ---------- Вспомогательные функции ----------

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
      else if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
    }
  } catch(e) {}
}

function openBotLink(cmd) {
  const url = `https://t.me/AssistentMilovskayaBot?start=${cmd}`;
  try { tg.openTelegramLink(url); } catch(e) { window.open(url, '_blank'); }
}

function closePolicyModal() {
  document.getElementById('policyModal').classList.remove('show');
}

// ---------- Хедер для квиза ----------

function renderQuizHeader() {
  const pct = Math.round(((S.qi + 1) / Q.length) * 100);

  const bar = document.createElement('div');
  bar.className = 'top-bar';

  const pbOuter = document.createElement('div');
  pbOuter.className = 'pb-outer';

  const pbInner = document.createElement('div');
  pbInner.className = 'pb-inner';
  pbInner.style.width = pct + '%';
  pbOuter.appendChild(pbInner);

  const stepTxt = document.createElement('div');
  stepTxt.className = 'step-txt';
  stepTxt.textContent = `${S.qi + 1} / ${Q.length}`;

  bar.appendChild(pbOuter);
  bar.appendChild(stepTxt);

  headerEl.appendChild(bar);
}

// ---------- Генераторы контента (тела) экранов ----------

function getBodyElement(screen) {
  switch (screen) {
    case 'welcome': return bWelcome();
    case 'prep':    return bPrep();
    case 'name':    return bName();
    case 'quiz':    return bQuiz();
    case 'consent': return bConsent();
    case 'result':  return bResult();
    case 'booking': return bBooking();
    default:        return document.createElement('div');
  }
}

function bWelcome() {
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
  p.innerHTML = `Привет${greeting}!<br>Давайте за 2 минуты определим клинический тип вашей кожи, и я подготовлю персональный протокол ухода и чекап организма.`;
  frag.appendChild(p);

  const methodNote = document.createElement('div');
  methodNote.className = 'method-note';
  methodNote.textContent = 'Алгоритм основан на международной классификации Baumann Skin Type System (BSTI) с клинической адаптацией';
  frag.appendChild(methodNote);

  const statsRow = document.createElement('div');
  statsRow.className = 'stats-row';
  statsRow.innerHTML = `
    <div class="stat-item"><div class="stat-num">12</div><div class="stat-lbl">вопросов</div></div>
    <div class="stat-item"><div class="stat-num">2</div><div class="stat-lbl">минуты</div></div>
    <div class="stat-item"><div class="stat-num">360°</div><div class="stat-lbl">подход</div></div>
  `;
  frag.appendChild(statsRow);

  const disclaimer = document.createElement('div');
  disclaimer.className = 'method-note';
  disclaimer.style.marginTop = '8px';
  disclaimer.textContent = '⚠️ Квиз — авторский образовательный инструмент. Результат носит ознакомительный характер и не является медицинским диагнозом.';
  frag.appendChild(disclaimer);

  return frag;
}

function bPrep() {
  const frag = document.createDocumentFragment();

  const wrap = document.createElement('div');
  wrap.className = 'name-screen';

  const icon = document.createElement('span');
  icon.className = 'prep-icon';
  icon.textContent = '💧';
  wrap.appendChild(icon);

  const h2 = document.createElement('h2');
  h2.className = 'cormorant ns-title';
  h2.textContent = 'Правила подготовки';
  wrap.appendChild(h2);

  const sub = document.createElement('p');
  sub.className = 'ns-sub';
  sub.textContent = 'Чтобы алгоритм сработал точно, мы должны оценить истинное состояние вашей гидролипидной мантии.';
  wrap.appendChild(sub);

  const list = document.createElement('div');
  list.className = 'prep-list';
  list.innerHTML = `
    <div class="prep-item">
      <div class="prep-num">1</div>
      <div class="prep-txt">Умойтесь вашим обычным очищающим средством (пенкой или гелем).</div>
    </div>
    <div class="prep-item">
      <div class="prep-num">2</div>
      <div class="prep-txt"><b>Не наносите ничего!</b> Ни тоник, ни сыворотку, ни крем.</div>
    </div>
    <div class="prep-item">
      <div class="prep-num">3</div>
      <div class="prep-txt">Подождите 30 минут. Прислушайтесь к ощущениям кожи.</div>
    </div>
  `;
  wrap.appendChild(list);

  frag.appendChild(wrap);
  return frag;
}

function bName() {
  const frag = document.createDocumentFragment();

  const wrap = document.createElement('div');
  wrap.className = 'name-screen';

  const icon = document.createElement('span');
  icon.className = 'prep-icon';
  icon.textContent = '📝';
  wrap.appendChild(icon);

  const h2 = document.createElement('h2');
  h2.className = 'cormorant ns-title';
  h2.textContent = 'Как к Вам обращаться?';
  wrap.appendChild(h2);

  const sub = document.createElement('p');
  sub.className = 'ns-sub';
  sub.textContent = 'Я сформирую именной протокол, который Вы сможете скачать в формате PDF.';
  wrap.appendChild(sub);

  const label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = 'Ваше имя';
  wrap.appendChild(label);

  const input = document.createElement('input');
  input.id = 'nameInput';
  input.className = 'input-field';
  input.type = 'text';
  input.placeholder = 'Например: Ирина';
  input.value = S.userName;
  input.maxLength = 30;
  input.addEventListener('input', () => {
    S.userName = input.value;
    S.nerr = false;
    const nerrEl = document.getElementById('nerr');
    if (nerrEl) nerrEl.classList.remove('show');
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitName();
  });
  wrap.appendChild(input);

  const nerr = document.createElement('div');
  nerr.id = 'nerr';
  nerr.className = 'err-hint' + (S.nerr ? ' show' : '');
  nerr.textContent = 'Пожалуйста, введите имя (от 2 букв)';
  wrap.appendChild(nerr);

  frag.appendChild(wrap);
  return frag;
}

function bQuiz() {
  const frag = document.createDocumentFragment();
  const q = Q[S.qi];

  const card = document.createElement('div');
  card.className = 'q-card';

  const h2 = document.createElement('h2');
  h2.className = 'cormorant q-title';
  h2.textContent = q.title;
  card.appendChild(h2);

  if (q.hint) {
    const hint = document.createElement('p');
    hint.className = 'q-hint';
    hint.textContent = q.hint;
    card.appendChild(hint);
  }
  frag.appendChild(card);

  const optsContainer = document.createElement('div');
  optsContainer.className = 'opts';

  q.opts.forEach((o, i) => {
    const opt = document.createElement('div');
    opt.className = 'opt' + (S.sel === i ? ' sel' : '');
    opt.dataset.i = i;

    const dot = document.createElement('div');
    dot.className = 'opt-dot';
    opt.appendChild(dot);

    const span = document.createElement('span');
    span.textContent = o.t;
    opt.appendChild(span);

    opt.addEventListener('click', () => {
      triggerHaptic('light');
      S.sel = i;
      render();
    });

    optsContainer.appendChild(opt);
  });

  frag.appendChild(optsContainer);
  return frag;
}

function bConsent() {
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.className = 'consent-screen';

  const icon = document.createElement('span');
  icon.className = 'prep-icon';
  icon.textContent = '📋';
  wrap.appendChild(icon);

  const nameGreet = S.userName ? `, ${S.userName.trim()}` : '';
  const h2 = document.createElement('h2');
  h2.className = 'cormorant ns-title';
  h2.textContent = `Финальный шаг${nameGreet}`;
  wrap.appendChild(h2);

  const sub = document.createElement('p');
  sub.className = 'consent-sub';
  sub.textContent = 'Подтвердите согласие для расчета клинического алгоритма';
  wrap.appendChild(sub);

  const consentRow = document.createElement('div');
  consentRow.id = 'cr';
  consentRow.className = 'consent-row' + (S.consent ? ' active' : '');

  const checkBox = document.createElement('div');
  checkBox.className = 'check-box';
  const checkMark = document.createElement('span');
  checkMark.className = 'check-mark';
  checkMark.textContent = '✓';
  checkBox.appendChild(checkMark);
  consentRow.appendChild(checkBox);

  const consentTxt = document.createElement('div');
  consentTxt.className = 'consent-txt';
  consentTxt.innerHTML = 'Соглашаюсь на обработку данных согласно <span class="consent-link">Политике конфиденциальности</span>';
  const link = consentTxt.querySelector('.consent-link');
  link.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('policyModal').classList.add('show');
  });
  consentRow.appendChild(consentTxt);

  consentRow.addEventListener('click', () => {
    triggerHaptic('light');
    S.consent = !S.consent;
    S.cerr = false;
    render();
  });

  wrap.appendChild(consentRow);

  const cerr = document.createElement('div');
  cerr.id = 'cerr';
  cerr.className = 'err-hint' + (S.cerr ? ' show' : '');
  cerr.textContent = 'Необходимо согласие для продолжения';
  wrap.appendChild(cerr);

  frag.appendChild(wrap);
  return frag;
}

function bResult() {
  const frag = document.createDocumentFragment();
  const t = TYPES[S.result];
  if (!t) return frag;

  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px 0 40px';

  // Верхний блок
  const top = document.createElement('div');
  top.style.textAlign = 'center';
  top.style.marginBottom = '24px';
  top.innerHTML = `
    <span class="res-emoji">${t.emoji}</span>
    <div class="res-tag">Ваш клинический профиль</div>
    <h2 class="cormorant res-name">${t.name}</h2>
    <p class="res-desc">${t.desc}</p>
  `;
  wrapper.appendChild(top);

  // Процедуры
  const sec1 = document.createElement('div');
  sec1.className = 'r-section';
  sec1.innerHTML = `<div class="r-title">💉 Рекомендованные процедуры</div>
    <div class="r-card">
      <ul class="r-ul">
        ${t.procs.map(p => `<li class="r-li">${p}</li>`).join('')}
      </ul>
    </div>`;
  wrapper.appendChild(sec1);

  // Check-Up
  const sec2 = document.createElement('div');
  sec2.className = 'r-section';
  sec2.innerHTML = `<div class="r-title">🧪 Лабораторный Check-Up</div>
    <div class="r-card" style="background: #FAFAFA;">
      <ul class="r-ul">
        ${t.tests.map(c => `<li class="r-li">${c}</li>`).join('')}
      </ul>
    </div>`;
  wrapper.appendChild(sec2);

  // Нутрицевтики
  const sec3 = document.createElement('div');
  sec3.className = 'r-section';
  const title3 = document.createElement('div');
  title3.className = 'r-title';
  title3.textContent = '💊 Нутрицевтическая поддержка';
  sec3.appendChild(title3);
  const tagsDiv = document.createElement('div');
  tagsDiv.style.marginTop = '8px';
  t.nutri.forEach(n => {
    const tag = document.createElement('span');
    tag.className = 'nutri-tag';
    tag.textContent = n;
    tagsDiv.appendChild(tag);
  });
  sec3.appendChild(tagsDiv);
  wrapper.appendChild(sec3);

  // Дисклеймер
  const fine = document.createElement('div');
  fine.className = 'fine-print';
  fine.textContent = 'Данный протокол носит информационный характер и требует клинического подтверждения на очной консультации врача-косметолога.';
  wrapper.appendChild(fine);

  frag.appendChild(wrapper);
  return frag;
}

function bBooking() {
  // Заглушка — будет доработана позже
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.className = 'name-screen';
  const h2 = document.createElement('h2');
  h2.className = 'cormorant ns-title';
  h2.textContent = 'Запись к Ирине';
  wrap.appendChild(h2);
  const p = document.createElement('p');
  p.textContent = 'Здесь будет форма записи';
  wrap.appendChild(p);
  frag.appendChild(wrap);
  return frag;
}

// ---------- Генераторы футера ----------

function getFooterElement(screen) {
  switch (screen) {
    case 'welcome': return fWelcome();
    case 'prep':    return fPrep();
    case 'name':    return fName();
    case 'quiz':    return fQuiz();
    case 'consent': return fConsent();
    case 'result':  return fResult();
    case 'booking': return fBooking();
    default:        return document.createElement('div');
  }
}

function fWelcome() {
  const container = document.createElement('div');
  const btn = createButton('Начать диагностику →', {
    cls: 'btn-black',
    onClick: () => {
      triggerHaptic('medium');
      navigateTo('prep');
    }
  });
  container.appendChild(btn);
  return container;
}

function fPrep() {
  const container = document.createElement('div');
  const btn = createButton('Я выполнил(а) условия →', {
    cls: 'btn-black',
    onClick: () => {
      triggerHaptic('light');
      navigateTo('name');
    }
  });
  container.appendChild(btn);
  return container;
}

function fName() {
  const container = document.createElement('div');

  const nextBtn = createButton('Перейти к вопросам →', {
    cls: 'btn-black',
    onClick: submitName
  });
  container.appendChild(nextBtn);

  const backBtn = createButton('← Назад', {
    cls: 'btn-outline',
    onClick: () => {
      triggerHaptic('light');
      navigateTo('prep');
    }
  });
  container.appendChild(backBtn);

  return container;
}

function fQuiz() {
  const container = document.createElement('div');
  const btn = createButton('Далее →', {
    cls: 'btn-black',
    onClick: nextQ,
    disabled: S.sel === null
  });
  container.appendChild(btn);
  return container;
}

function fConsent() {
  const container = document.createElement('div');
  const btn = createButton('Сформировать мой протокол 🎯', {
    cls: 'btn-black',
    onClick: submitConsent
  });
  container.appendChild(btn);
  return container;
}

function fResult() {
  const container = document.createElement('div');

  const pdfBtn = createButton('📥 Скачать PDF-протокол (в бот)', {
    cls: 'btn-gold',
    onClick: () => {
      triggerHaptic('medium');
      openBotLink('get_pdf_protocol');
    }
  });
  container.appendChild(pdfBtn);

  const bookBtn = createButton('✍️ Записаться на диагностику к Ирине', {
    cls: 'btn-black',
    onClick: () => {
      triggerHaptic('medium');
      navigateTo('booking');
    }
  });
  bookBtn.style.marginTop = '2px';
  container.appendChild(bookBtn);

  return container;
}

function fBooking() {
  const container = document.createElement('div');
  const backBtn = createButton('← Назад к протоколу', {
    cls: 'btn-outline',
    onClick: () => navigateTo('result')
  });
  container.appendChild(backBtn);
  return container;
}

// ---------- Логика навигации и расчёта ----------

function submitName() {
  const name = S.userName.trim();
  if (name.length < 2) {
    S.nerr = true;
    render();
    triggerHaptic('warning');
    return;
  }
  triggerHaptic('medium');
  navigateTo('quiz');
}

function nextQ() {
  if (S.sel === null) return;
  triggerHaptic('medium');
  const o = Q[S.qi].opts[S.sel];
  for (const [k, v] of Object.entries(o.s)) {
    S.scores[k] += v;
  }
  S.answers.push(S.sel);
  S.sel = null;

  if (S.qi < Q.length - 1) {
    S.qi++;
    render();
  } else {
    navigateTo('consent');
  }
}

function submitConsent() {
  if (!S.consent) {
    S.cerr = true;
    render();
    triggerHaptic('warning');
    return;
  }
  triggerHaptic('success');
  S.screen = 'loading';
  render();
  setTimeout(calcResult, 2200);
}

function calcResult() {
  let max = -1, win = 'T5';
  for (const [k, v] of Object.entries(S.scores)) {
    if (v > max) {
      max = v;
      win = k;
    }
  }
  S.result = win;
  navigateTo('result');
}

// ---------- Экран загрузки (особый, полностью перестраивает #app) ----------

function renderLoadingScreen() {
  clearElement(headerEl);
  clearElement(contentEl);
  clearElement(footerEl);

  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-full';
  loadingDiv.innerHTML = `
    <img src="${LOGO_URL}" class="loading-logo" alt="Анализ...">
    <div class="cormorant loading-title">Синтезирую протокол...</div>
    <div style="font-size:13px; color:var(--gray)">Анализирую биомаркеры 🤍</div>
  `;
  contentEl.appendChild(loadingDiv);
}