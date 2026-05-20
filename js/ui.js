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
      else if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
    }
  } catch(e) {}
}

function openBotLink(cmd) {
  const url = `https://t.me/AssistentMilovskayaBot?start=${cmd}`;
  try { tg.openTelegramLink(url); } catch(e) { window.open(url, '_blank'); }
}

function closePolicyModal() { document.getElementById('policyModal').classList.remove('show'); }

// ========== Генераторы контента (возвращают DOM-элементы) ==========

function buildWelcomeContent() {
  const frag = document.createDocumentFragment();
  const logoWrap = document.createElement('div');
  logoWrap.className = 'logo-wrap';
  const img = document.createElement('img');
  img.className = 'logo-img';
  img.src = LOGO_URL;  // используем LOGO_URL из state.js
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
  const stats = [
    { num: '12', lbl: 'вопросов' },
    { num: '2', lbl: 'минуты' },
    { num: '360°', lbl: 'подход' }
  ];
  stats.forEach(s => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `<div class="stat-num">${s.num}</div><div class="stat-lbl">${s.lbl}</div>`;
    statsRow.appendChild(item);
  });
  frag.appendChild(statsRow);

  // disclaimer
  const disclaimer = document.createElement('div');
  disclaimer.className = 'method-note';
  disclaimer.textContent = '⚠️ Квиз — авторский образовательный инструмент. Результат носит ознакомительный характер и не является медицинским диагнозом.';
  frag.appendChild(disclaimer);

  return frag;
}

function buildWelcomeFooter() {
  const f = document.createDocumentFragment();
  const btn = createButton('Начать диагностику →', {
    cls: 'btn-black',
    onClick: () => { triggerHaptic('medium'); navigateTo('science'); }  // идем на научный слайд
  });
  f.appendChild(btn);
  const micro = document.createElement('div');
  micro.style.fontSize = '10px';
  micro.style.color = '#999';
  micro.style.textAlign = 'center';
  micro.style.marginTop = '8px';
  micro.textContent = 'Нажимая, вы соглашаетесь на обработку персональных данных';
  f.appendChild(micro);
  return f;
}

function buildScienceContent() {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.innerHTML = `
    <span class="prep-icon">🧬</span>
    <h2 class="cormorant ns-title">Ваш тип кожи — не навсегда</h2>
    <p class="ns-sub">Согласно системе типирования кожи Бауманн (BSTI), тип кожи — это динамическая характеристика, которая может меняться под влиянием множества факторов.</p>
    <div class="prep-list">
      <div class="prep-item"><div class="prep-num">1</div><div class="prep-txt">Возраст и гормональные изменения (беременность, менопауза)</div></div>
      <div class="prep-item"><div class="prep-num">2</div><div class="prep-txt">Смена климата и сезонов</div></div>
      <div class="prep-item"><div class="prep-num">3</div><div class="prep-txt">Уровень стресса, питание, лекарства</div></div>
    </div>
    <p style="font-size:12px; color:#666; margin-top:16px;">Доктор Лесли Бауманн рекомендует проходить типирование ежегодно или после значительных жизненных изменений.</p>
  `;
  frag.appendChild(div);
  return frag;
}

function buildScienceFooter() {
  return createButton('Понятно, продолжаем →', {
    onClick: () => navigateTo('prep')
  });
}

function buildPrepContent() {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.innerHTML = `
    <span class="prep-icon">💧</span>
    <h2 class="cormorant ns-title">Правила подготовки</h2>
    <p class="ns-sub">Чтобы алгоритм сработал точно, мы должны оценить истинное состояние вашей гидролипидной мантии.</p>
    <div class="prep-list">
      <div class="prep-item"><div class="prep-num">1</div><div class="prep-txt">Умойтесь вашим обычным очищающим средством (пенкой или гелем).</div></div>
      <div class="prep-item"><div class="prep-num">2</div><div class="prep-txt"><b>Не наносите ничего!</b> Ни тоник, ни сыворотку, ни крем.</div></div>
      <div class="prep-item"><div class="prep-num">3</div><div class="prep-txt">Подождите 30 минут. Прислушайтесь к ощущениям кожи.</div></div>
    </div>
  `;
  frag.appendChild(div);
  return frag;
}

function buildPrepFooter() {
  return createButton('Я выполнил(а) условия →', {
    onClick: () => { triggerHaptic('light'); navigateTo('name'); }
  });
}

function buildNameContent() {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.innerHTML = `
    <span class="prep-icon">📝</span>
    <h2 class="cormorant ns-title">Как к Вам обращаться?</h2>
    <p class="ns-sub">Я сформирую именной протокол, который вы сможете скачать в формате PDF.</p>
  `;
  const label = document.createElement('label');
  label.className = 'input-label';
  label.textContent = 'Ваше имя';
  div.appendChild(label);

  const input = document.createElement('input');
  input.id = 'nameInput';
  input.className = 'input-field';
  input.type = 'text';
  input.placeholder = 'Например: Екатерина';
  input.value = S.userName;
  input.maxLength = 30;
  input.addEventListener('input', (e) => {
    S.userName = e.target.value;
    S.nerr = false;
    const nerrEl = document.getElementById('nerr');
    if (nerrEl) nerrEl.classList.remove('show');
  });
  div.appendChild(input);

  const nerr = document.createElement('div');
  nerr.id = 'nerr';
  nerr.className = 'err-hint';
  nerr.textContent = 'Пожалуйста, введите имя (от 2 букв)';
  if (S.nerr) nerr.classList.add('show');
  div.appendChild(nerr);

  frag.appendChild(div);
  return frag;
}

function buildNameFooter() {
  const f = document.createDocumentFragment();
  f.appendChild(createButton('Перейти к вопросам →', {
    onClick: () => {
      const c = (S.userName || '').trim();
      if(c.length < 2) {
        S.nerr = true;
        const nerr = document.getElementById('nerr');
        if(nerr) nerr.classList.add('show');
        triggerHaptic('warning');
        return;
      }
      triggerHaptic('medium');
      navigateTo('quiz');
    }
  }));
  f.appendChild(createButton('← Назад', {
    cls: 'btn-outline',
    onClick: () => { triggerHaptic('light'); navigateTo('prep'); }
  }));
  return f;
}

function buildQuizContent() {
  const q = Q[S.qi];
  const frag = document.createDocumentFragment();
  const qCard = document.createElement('div');
  qCard.className = 'q-card';
  qCard.innerHTML = `
    <h2 class="cormorant q-title">${q.title}</h2>
    ${q.hint ? `<p class="q-hint">${q.hint}</p>` : ''}
  `;
  frag.appendChild(qCard);

  const optsDiv = document.createElement('div');
  optsDiv.className = 'opts';
  q.opts.forEach((o, i) => {
    const opt = document.createElement('button');
    opt.className = `opt ${S.sel === i ? 'sel' : ''}`;
    opt.setAttribute('role', 'radio');
    opt.setAttribute('aria-checked', S.sel === i ? 'true' : 'false');
    opt.innerHTML = `<div class="opt-dot"></div><span>${o.t}</span>`;
    opt.addEventListener('click', () => {
      triggerHaptic('light');
      S.sel = i;
      // обновляем только опции, не перерисовывая весь контент
      document.querySelectorAll('.opt').forEach(el => el.classList.remove('sel'));
      opt.classList.add('sel');
      opt.setAttribute('aria-checked', 'true');
      updateQuizFooter(); // обновим состояние кнопки "Далее"
    });
    optsDiv.appendChild(opt);
  });
  frag.appendChild(optsDiv);
  return frag;
}

function buildQuizFooter() {
  const f = document.createDocumentFragment();
  const backBtn = createButton('← Назад', {
    cls: 'btn-outline',
    onClick: () => {
      if (S.qi > 0) {
        // откат баллов за последний ответ
        if (S.answers.length > 0) {
          const lastAnswer = S.answers.pop();
          const lastQ = Q[S.qi - 1];
          const o = lastQ.opts[lastAnswer];
          for (const [k, v] of Object.entries(o.s)) S.scores[k] -= v;
        }
        S.qi--;
        S.sel = (S.answers.length > 0) ? S.answers[S.answers.length - 1] : null;
        updateQuizUI();
      }
    }
  });
  f.appendChild(backBtn);

  const nextBtn = createButton('Далее →', {
    cls: 'btn-black',
    disabled: S.sel === null,
    onClick: () => {
      if (S.sel === null) return;
      triggerHaptic('medium');
      const o = Q[S.qi].opts[S.sel];
      for (const [k, v] of Object.entries(o.s)) S.scores[k] += v;
      S.answers.push(S.sel);
      if (S.qi < Q.length - 1) {
        S.qi++;
        S.sel = null;
        updateQuizUI();
      } else {
        navigateTo('consent');
      }
    }
  });
  f.appendChild(nextBtn);
  return f;
}

// Быстрое обновление интерфейса квиза без полной перерисовки
function updateQuizUI() {
  // Обновить прогресс-бар
  const pct = Math.round(((S.qi + 1) / Q.length) * 100);
  const pbInner = document.querySelector('.pb-inner');
  const stepTxt = document.querySelector('.step-txt');
  if (pbInner) pbInner.style.width = pct + '%';
  if (stepTxt) stepTxt.textContent = `${S.qi + 1} / ${Q.length}`;

  // Обновить контент вопроса
  const content = document.getElementById('appContent');
  if (content) {
    content.innerHTML = '';
    content.appendChild(buildQuizContent());
  }

  // Обновить футер
  const footer = document.getElementById('appFooter');
  if (footer) {
    footer.innerHTML = '';
    footer.appendChild(buildQuizFooter());
  }

  // Установить фокус на первой опции, если десктоп
  const firstOpt = document.querySelector('.opt');
  if (firstOpt && window.innerWidth > 768) firstOpt.focus();
}

function updateQuizFooter() {
  const footer = document.getElementById('appFooter');
  if (footer) {
    footer.innerHTML = '';
    footer.appendChild(buildQuizFooter());
  }
}

function buildConsentContent() {
  const nameGreet = S.userName ? `, ${S.userName.trim()}` : '';
  const frag = document.createDocumentFragment();
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
    S.cerr = false;
    row.classList.toggle('active', S.consent);
    const cerr = document.getElementById('cerr');
    if (cerr) cerr.classList.remove('show');
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

  frag.appendChild(div);
  return frag;
}

function buildConsentFooter() {
  return createButton('Сформировать мой протокол 🎯', {
    cls: 'btn-black',
    disabled: !S.consent,
    onClick: () => {
      if (!S.consent) {
        S.cerr = true;
        const cerr = document.getElementById('cerr');
        if (cerr) cerr.classList.add('show');
        triggerHaptic('warning');
        return;
      }
      triggerHaptic('success');
      navigateTo('loading');
      setTimeout(calcResult, 2200);
    }
  });
}

function updateConsentFooter() {
  const footer = document.getElementById('appFooter');
  if (footer) {
    footer.innerHTML = '';
    footer.appendChild(buildConsentFooter());
  }
}

function buildLoadingScreen() {
  const div = document.createElement('div');
  div.className = 'loading-full';
  div.innerHTML = `
    <img src="${LOGO_URL}" class="loading-logo" alt="Анализ...">
    <div class="cormorant loading-title">Синтезирую протокол...</div>
    <div style="font-size:13px; color:var(--gray)">Анализирую биомаркеры 🤍</div>
  `;
  return div;
}

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
      <div class="r-title">💉 Косметология (Клинический этап)</div>
      <div class="r-card"><ul class="r-ul">${t.procs.map(p => `<li class="r-li">${p}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">🧪 Check-Up (Лабораторный контроль)</div>
      <div class="r-card" style="background: #FAFAFA;"><ul class="r-ul">${t.tests.map(c => `<li class="r-li">${c}</li>`).join('')}</ul></div>
    </div>
    <div class="r-section">
      <div class="r-title">💊 Нутрицевтическая поддержка</div>
      <div style="margin-top: 8px;">${t.nutri.map(n => `<span class="nutri-tag">${n}</span>`).join('')}</div>
    </div>
    <div class="fine-print">Данный протокол носит информационный характер и требует клинического подтверждения на очной консультации врача-косметолога.</div>
  `;
  frag.appendChild(wrap);
  return frag;
}

function buildResultFooter() {
  const f = document.createDocumentFragment();
  f.appendChild(createButton('📥 Скачать PDF (в бот)', {
    cls: 'btn-gold',
    onClick: () => { triggerHaptic('medium'); openBotLink('get_pdf_protocol'); }
  }));
  f.appendChild(createButton('✍️ Записаться на диагностику к Ирине', {
    cls: 'btn-black',
    onClick: () => { triggerHaptic('medium'); navigateTo('booking'); }
  }));
  f.appendChild(createButton('📤 Поделиться результатом', {
    cls: 'btn-outline-dark',
    onClick: () => {
      const t = TYPES[S.result];
      const text = `Мой тип кожи по Бауманну — ${t.emoji} ${t.name}. Пройди тест: https://t.me/AssistentMilovskayaBot`;
      if (navigator.share) {
        navigator.share({ title: 'Карта кожи', text: text }).catch(() => {});
      } else {
        tg.openTelegramLink(`https://t.me/share/url?url=https://t.me/AssistentMilovskayaBot&text=${encodeURIComponent(text)}`);
      }
    }
  }));
  return f;
}

function buildBookingContent() {
  const frag = document.createDocumentFragment();
  const div = document.createElement('div');
  div.className = 'name-screen';
  div.style.paddingTop = '16px';
  div.innerHTML = `
    <img src="${PHOTO_URL}" style="width: 100%; max-width: 280px; border-radius: 20px; display: block; margin: 0 auto 20px;" alt="Ирина Миловская">
    <h2 class="cormorant ns-title" style="font-size: 24px;">Ирина Миловская</h2>
    <p style="text-align:center; font-size:14px; color: var(--gray); margin-bottom: 16px;">Врач-косметолог, дерматолог, главный врач FGF Medical</p>
    <div style="background: var(--gray-light); border-radius: var(--r); padding: 16px; margin-bottom: 16px;">
      <p style="font-size:13px; line-height:1.5;"><b>📍 Санкт-Петербург</b><br>Малый пр. В.О., д. 64, корп. 1, стр. 1, помещение 100-Н<br>(ЖК The Residence)</p>
      <p style="font-size:13px; margin-top:8px;"><b>🕒 Приём:</b> четверг, пятница, воскресенье<br>с 10:00 до 21:00</p>
    </div>
  `;
  const btn1 = document.createElement('a');
  btn1.href = 'https://t.me/fgf_medical';
  btn1.target = '_blank';
  btn1.className = 'btn btn-black';
  btn1.style.marginBottom = '8px';
  btn1.textContent = 'Написать в клинику FGF Medical';
  div.appendChild(btn1);

  const btn2 = document.createElement('a');
  btn2.href = 'https://t.me/MilovskayaDR';
  btn2.target = '_blank';
  btn2.className = 'btn btn-outline-dark';
  btn2.textContent = 'Написать Ирине лично';
  div.appendChild(btn2);

  frag.appendChild(div);
  return frag;
}

function buildBookingFooter() {
  return createButton('← Назад к протоколу', {
    cls: 'btn-outline',
    onClick: () => navigateTo('result')
  });
}

// Функция расчёта результата
function calcResult() {
  let max = -1, win = 'T5';
  for (const [k, v] of Object.entries(S.scores)) {
    if (v > max) { max = v; win = k; }
  }
  S.result = win;
  navigateTo('result');
}