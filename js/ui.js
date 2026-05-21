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

  if (S.qi >= 2) {
    const leader = getLeadingType();
    if (leader) {
      const emoji = document.createElement('span');
      emoji.className = 'pb-emoji';
      emoji.textContent = TYPES[leader].emoji;
      emoji.style.left = pct + '%';
      pbInner.appendChild(emoji);
    }
  }

  pbOuter.appendChild(pbInner);

  const stepTxt = document.createElement('div');
  stepTxt.className = 'step-txt';
  stepTxt.textContent = `${S.qi + 1} / ${Q.length}`;

  bar.appendChild(pbOuter);
  bar.appendChild(stepTxt);

  headerEl.appendChild(bar);
}

function getLeadingType() {
  let max = -1, leader = null, tie = false;
  for (const [k, v] of Object.entries(S.scores)) {
    if (v > max) { max = v; leader = k; tie = false; }
    else if (v === max && max > 0) { tie = true; }
  }
  return tie ? null : leader;
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

  const p = document.createElement('p');
  p.className = 'welcome-by';
  p.textContent = 'Добрый день! Давайте за 2 минуты определим клинический тип Вашей кожи, и я подготовлю персональный протокол ухода и чекап организма.';
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
  wrap.innerHTML = `
    <span class="prep-icon">💧</span>
    <h2 class="cormorant ns-title">Правила подготовки</h2>
    <p class="ns-sub">Чтобы алгоритм сработал точно, мы должны оценить истинное состояние Вашей гидролипидной мантии.</p>
    <div class="prep-list">
      <div class="prep-item"><div class="prep-num">1</div><div class="prep-txt">Умойтесь Вашим обычным очищающим средством (пенкой или гелем).</div></div>
      <div class="prep-item"><div class="prep-num">2</div><div class="prep-txt"><b>Не наносите ничего!</b> Ни тоник, ни сыворотку, ни крем.</div></div>
      <div class="prep-item"><div class="prep-num">3</div><div class="prep-txt">Подождите 30 минут. Прислушайтесь к ощущениям кожи.</div></div>
    </div>`;
  frag.appendChild(wrap);
  return frag;
}

function bName() {
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.className = 'name-screen';
  wrap.innerHTML = `
    <span class="prep-icon">📝</span>
    <h2 class="cormorant ns-title">Как к Вам обращаться?</h2>
    <p class="ns-sub">Я сформирую именной протокол, который Вы сможете скачать в формате PDF.</p>
    <label class="input-label">Ваше имя</label>`;

  const input = document.createElement('input');
  input.id = 'nameInput';
  input.className = 'input-field';
  input.type = 'text';
  input.placeholder = 'Например: Ирина';
  input.value = S.userName;   // пустое после изменений в state
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
  card.innerHTML = `<h2 class="cormorant q-title">${q.title}</h2>${q.hint ? `<p class="q-hint">${q.hint}</p>` : ''}`;
  frag.appendChild(card);

  const optsContainer = document.createElement('div');
  optsContainer.className = 'opts';

  q.opts.forEach((o, i) => {
    const opt = document.createElement('div');
    opt.className = 'opt' + (S.sel === i ? ' sel' : '');
    opt.dataset.i = i;
    opt.innerHTML = `<div class="opt-dot"></div><span>${o.t}</span>`;
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
  wrap.innerHTML = `
    <span class="prep-icon">📋</span>
    <h2 class="cormorant ns-title" style="text-transform: uppercase;">Согласие на обработку персональных данных</h2>
    <p class="ns-sub" style="font-size:12px; color:var(--gray);">Обязательное поле</p>
    <div id="cr" class="consent-row${S.consent ? ' active' : ''}">
      <div class="check-box"><span class="check-mark">✓</span></div>
      <div class="consent-txt">Даю согласие на обработку персональных данных</div>
    </div>
    <p style="font-size:11px; color:var(--gray); margin-top:6px; line-height:1.5;">
      Нажимая на чекбокс, Вы соглашаетесь с 
      <span class="consent-link" style="text-decoration:underline; cursor:pointer;">политикой обработки персональных данных</span>
    </p>
    <div id="cerr" class="err-hint${S.cerr ? ' show' : ''}">Необходимо согласие для продолжения</div>
    <p style="font-size:10px; color:var(--gray); margin-top:4px;">* Обязательный вопрос</p>`;

  const cr = wrap.querySelector('#cr');
  const link = wrap.querySelector('.consent-link');
  link.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('policyModal').classList.add('show');
  });
  cr.addEventListener('click', () => {
    triggerHaptic('light');
    S.consent = !S.consent;
    S.cerr = false;
    render();
  });

  frag.appendChild(wrap);
  return frag;
}

function bResult() {
  const t = TYPES[S.result];
  if (!t) return document.createDocumentFragment();

  const wrapper = document.createElement('div');
  wrapper.style.padding = '24px 0 40px';
  wrapper.innerHTML = `
    <div style="text-align:center; margin-bottom:24px;">
      <span class="res-emoji">${t.emoji}</span>
      <div class="res-tag">Ваш клинический профиль</div>
      <h2 class="cormorant res-name">${t.name}</h2>
      <p class="res-desc">${t.desc}</p>
    </div>
    <div class="r-section">
      <div class="r-title">💉 Рекомендованные процедуры</div>
      <div class="r-card"><ul class="r-ul">${t.procs.map(p => `<li class="r-li">${p}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">🧪 Лабораторный Check-Up</div>
      <div class="r-card" style="background: #FAFAFA;"><ul class="r-ul">${t.tests.map(c => `<li class="r-li">${c}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">💊 Нутрицевтическая поддержка</div>
      <div style="margin-top: 8px;">${t.nutri.map(n => `<span class="nutri-tag">${n}</span>`).join('')}</div>
    </div>
    <div class="fine-print">Данный протокол носит информационный характер и требует клинического подтверждения на очной консультации врача-косметолога.</div>`;

  return wrapper;
}

function bBooking() {
  const frag = document.createDocumentFragment();
  const wrap = document.createElement('div');
  wrap.style.padding = '24px 16px';
  wrap.innerHTML = `
    <img src="${PHOTO_URL}" alt="Ирина Миловская" style="width:120px;height:120px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 16px;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
    <h2 class="cormorant" style="font-size:24px;font-weight:600;text-align:center;margin-bottom:4px;">Ирина Миловская</h2>
    <p style="font-size:13px;color:var(--gray);text-align:center;margin-bottom:4px;">Врач-косметолог, дерматолог</p>
    <p style="font-size:13px;color:var(--gray);text-align:center;margin-bottom:20px;">Главный врач FGF Medical</p>
    <div style="background:var(--gray-light);border-radius:var(--r);padding:16px;margin-bottom:20px;font-size:13px;line-height:1.6;">
      <p style="margin-bottom:8px;"><b>📍 Адрес:</b><br>Санкт-Петербург, Малый пр. В.О., д. 64, корп. 1, стр. 1, помещение 100-Н<br>(ЖК The Residence, проход со стороны 24-й и 25-й линий В.О.)</p>
      <p><b>🕒 Приём:</b> четверг, пятница, воскресенье с 10:00 до 21:00</p>
    </div>`;
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
  container.appendChild(createButton('Начать диагностику →', { cls: 'btn-black', onClick: () => { triggerHaptic('medium'); navigateTo('prep'); } }));
  return container;
}

function fPrep() {
  const container = document.createElement('div');
  container.appendChild(createButton('Я выполнил(а) условия →', { cls: 'btn-black', onClick: () => { triggerHaptic('light'); navigateTo('name'); } }));
  container.appendChild(createButton('← Назад', { cls: 'btn-outline', onClick: () => { triggerHaptic('light'); navigateTo('welcome'); } }));
  return container;
}

function fName() {
  const container = document.createElement('div');
  container.appendChild(createButton('Перейти к вопросам →', { cls: 'btn-black', onClick: submitName }));
  container.appendChild(createButton('← Назад', { cls: 'btn-outline', onClick: () => { triggerHaptic('light'); navigateTo('prep'); } }));
  return container;
}

function fQuiz() {
  const container = document.createElement('div');
  container.appendChild(createButton('Далее →', { cls: 'btn-black', onClick: nextQ, disabled: S.sel === null }));
  const backTarget = S.qi === 0 ? 'name' : null; // на первом вопросе назад к имени
  const backOnClick = S.qi === 0
    ? () => { triggerHaptic('light'); navigateTo('name'); }
    : () => prevQ();
  container.appendChild(createButton('← Назад', { cls: 'btn-outline', onClick: backOnClick }));
  return container;
}

function fConsent() {
  const container = document.createElement('div');
  container.appendChild(createButton('Сформировать мой протокол 🎯', { cls: 'btn-black', onClick: submitConsent }));
  return container;
}

function fResult() {
  const container = document.createElement('div');
  container.style.gap = '12px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  container.appendChild(createButton('📥 Скачать PDF на устройство', { cls: 'btn-gold', onClick: () => { triggerHaptic('medium'); generateLocalPDF(); } }));
  container.appendChild(createButton('📩 Получить протокол в Telegram', { cls: 'btn-outline-dark', onClick: () => { triggerHaptic('medium'); openBotLink('get_pdf_protocol'); } }));
  container.appendChild(createButton('✍️ Записаться на диагностику к Ирине', { cls: 'btn-black', onClick: () => { triggerHaptic('medium'); navigateTo('booking'); } }));

  return container;
}

function fBooking() {
  const container = document.createElement('div');
  container.style.gap = '10px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';

  container.appendChild(createButton('Написать Ирине лично', { cls: 'btn-black', onClick: () => { triggerHaptic('medium'); try { tg.openTelegramLink('https://t.me/MilovskayaDR'); } catch(e) { window.open('https://t.me/MilovskayaDR', '_blank'); } } }));
  container.appendChild(createButton('Написать администратору', { cls: 'btn-outline-dark', onClick: () => { triggerHaptic('medium'); try { tg.openTelegramLink('https://t.me/fgf_medical'); } catch(e) { window.open('https://t.me/fgf_medical', '_blank'); } } }));
  container.appendChild(createButton('← Назад к протоколу', { cls: 'btn-outline', onClick: () => navigateTo('result') }));

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
  S.direction = 'forward';
  const o = Q[S.qi].opts[S.sel];
  for (const [k, v] of Object.entries(o.s)) S.scores[k] += v;
  S.answers.push(S.sel);
  S.sel = null;

  if (S.qi < Q.length - 1) {
    S.qi++;
    renderWithAnimation();
  } else {
    navigateTo('consent');
  }
}

function prevQ() {
  if (S.qi === 0) return;
  triggerHaptic('light');
  S.direction = 'backward';

  const lastSel = S.answers.pop();
  const o = Q[S.qi - 1].opts[lastSel];
  for (const [k, v] of Object.entries(o.s)) S.scores[k] -= v;

  S.qi--;
  S.sel = lastSel;
  renderWithAnimation();
}

function renderWithAnimation() {
  const animClass = S.direction === 'forward' ? 'animate-forward' : 'animate-backward';
  contentEl.classList.add(animClass);

  setTimeout(() => {
    contentEl.classList.remove(animClass);
    render();
  }, 300);
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
    if (v > max) { max = v; win = k; }
  }
  S.result = win;
  navigateTo('result');
}

// ---------- Экран загрузки ----------

function renderLoadingScreen() {
  clearElement(headerEl);
  clearElement(contentEl);
  clearElement(footerEl);

  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-full';
  loadingDiv.innerHTML = `
    <img src="${PHOTO_URL}" class="loading-logo" alt="Анализ...">
    <div class="cormorant loading-title">Синтезирую протокол...</div>
    <div class="progress-outer"><div class="progress-inner" style="width:0%"></div></div>
    <div class="loading-hint">Анализирую ответы...</div>`;

  const progressInner = loadingDiv.querySelector('.progress-inner');
  const hintText = loadingDiv.querySelector('.loading-hint');
  const hints = ['Анализирую ответы...', 'Подбираю процедуры...', 'Формирую лабораторный чек-ап...', 'Собираю нутрицевтики 🤍'];
  
  contentEl.appendChild(loadingDiv);

  let progress = 0;
  const interval = setInterval(() => {
    progress += 100 / (2200 / 200);
    if (progress > 100) progress = 100;
    progressInner.style.width = progress + '%';
    const hintIndex = Math.min(Math.floor(progress / 25), hints.length - 1);
    hintText.textContent = hints[hintIndex];
    if (progress >= 100) clearInterval(interval);
  }, 200);

  loadingDiv._interval = interval;
}

// ---------- Генерация PDF ----------

function generateLocalPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const t = TYPES[S.result];
  if (!t) return;

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Карта кожи — Персональный протокол', pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Пациент: ${S.userName || 'Не указано'}`, 15, y);
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Тип: ${t.emoji} ${t.name}`, 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(t.desc, pageWidth - 30);
  doc.text(descLines, 15, y);
  y += descLines.length * 5 + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Рекомендованные процедуры:', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  t.procs.forEach(p => { doc.text(`• ${p}`, 20, y); y += 5; });
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Лабораторный Check-Up:', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  t.tests.forEach(c => { doc.text(`• ${c}`, 20, y); y += 5; });
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Нутрицевтическая поддержка:', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  t.nutri.forEach(n => { doc.text(`• ${n}`, 20, y); y += 5; });
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Данный протокол носит информационный характер и не является медицинским диагнозом.', pageWidth / 2, y, { align: 'center' });

  // Вместо прямого doc.save (может не работать в WebApp) создаём Blob и открываем ссылку
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Протокол_${S.userName || 'пациент'}_${new Date().toISOString().slice(0,10)}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}