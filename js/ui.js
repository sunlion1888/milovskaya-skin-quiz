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

// --- Генераторы экранов (пока возвращают строки, позже перепишем на createElement) ---

function bWelcome() {
  const gr = tg.initDataUnsafe?.user?.first_name || '';
  const greeting = gr ? `, ${gr}` : '';
  return `
    <div class="logo-wrap">
      <img class="logo-img" src="${LOGO_URL}" onerror="this.style.display='none'" alt="Ирина Миловская">
    </div>
    <h1 class="cormorant welcome-title">Карта кожи<br>от Ирины Миловской</h1>
    <p class="welcome-by">Привет${greeting}!<br>Я Ирина — ваш личный косметолог 👩‍⚕️<br><br>Давайте за 2 минуты определим клинический тип вашей кожи, и я подготовлю персональный протокол ухода и чекап организма.</p>
    <div class="method-note">Алгоритм основан на международной классификации Baumann Skin Type System (BSTI) с клинической адаптацией</div>
    <div class="stats-row">
      <div class="stat-item"><div class="stat-num">12</div><div class="stat-lbl">вопросов</div></div>
      <div class="stat-item"><div class="stat-num">2</div><div class="stat-lbl">минуты</div></div>
      <div class="stat-item"><div class="stat-num">360°</div><div class="stat-lbl">подход</div></div>
    </div>
    <div class="method-note" style="margin-top: 8px;">⚠️ Квиз — авторский образовательный инструмент. Результат носит ознакомительный характер и не является медицинским диагнозом.</div>`;
}

function fWelcome() {
  return `<button class="btn btn-black" onclick="triggerHaptic('medium'); navigateTo('prep')">Начать диагностику →</button>`;
}

function bPrep() {
  return `
    <div class="name-screen">
      <span class="prep-icon">💧</span>
      <h2 class="cormorant ns-title">Правила подготовки</h2>
      <p class="ns-sub">Чтобы алгоритм сработал точно, мы должны оценить истинное состояние вашей гидролипидной мантии.</p>
      <div class="prep-list">
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
      </div>
    </div>`;
}

function fPrep() {
  return `<button class="btn btn-black" onclick="triggerHaptic('light'); navigateTo('name')">Я выполнил(а) условия →</button>`;
}

function bName() {
  return `
    <div class="name-screen">
      <span class="prep-icon">📝</span>
      <h2 class="cormorant ns-title">Как к Вам обращаться?</h2>
      <p class="ns-sub">Я сформирую именной протокол, который вы сможете скачать в формате PDF.</p>
      <label class="input-label">Ваше имя</label>
      <input id="nameInput" class="input-field" type="text" placeholder="Например: Ирина" value="${S.userName}" maxlength="30" oninput="S.userName=this.value; S.nerr=false; document.getElementById('nerr').classList.remove('show');">
      <div id="nerr" class="err-hint ${S.nerr?'show':''}">Пожалуйста, введите имя (от 2 букв)</div>
    </div>`;
}

function fName() {
  return `
    <button class="btn btn-black" onclick="submitName()">Перейти к вопросам →</button>
    <button class="btn btn-outline" onclick="triggerHaptic('light'); navigateTo('prep')">← Назад</button>`;
}

function bQuiz() {
  const q = Q[S.qi];
  return `
    <div class="q-card">
      <h2 class="cormorant q-title">${q.title}</h2>
      ${q.hint ? `<p class="q-hint">${q.hint}</p>` : ''}
    </div>
    <div class="opts">
      ${q.opts.map((o,i) => `
        <div class="opt${S.sel===i?' sel':''}" data-i="${i}">
          <div class="opt-dot"></div><span>${o.t}</span>
        </div>`).join('')}
    </div>`;
}

function fQuiz() {
  return `<button class="btn btn-black" ${S.sel===null?'disabled':''} onclick="nextQ()">Далее →</button>`;
}

function bConsent() {
  const nameGreet = S.userName ? `, ${S.userName.trim()}` : '';
  return `
    <div class="consent-screen">
      <span class="prep-icon">📋</span>
      <h2 class="cormorant ns-title">Финальный шаг${nameGreet}</h2>
      <p class="consent-sub">Подтвердите согласие для расчета клинического алгоритма</p>
      <div id="cr" class="consent-row ${S.consent?'active':''}">
        <div class="check-box"><span class="check-mark">✓</span></div>
        <div class="consent-txt">Соглашаюсь на обработку данных согласно <span class="consent-link" onclick="event.stopPropagation(); document.getElementById('policyModal').classList.add('show');">Политике конфиденциальности</span></div>
      </div>
      <div id="cerr" class="err-hint ${S.cerr?'show':''}">Необходимо согласие для продолжения</div>
    </div>`;
}

function fConsent() {
  return `<button class="btn btn-black" onclick="submitConsent()">Сформировать мой протокол 🎯</button>`;
}

function bResult() {
  const t = TYPES[S.result];
  return `
    <div style="padding: 24px 0 40px;">
      <div style="text-align:center; margin-bottom:24px;">
        <span class="res-emoji">${t.emoji}</span>
        <div class="res-tag">Ваш клинический профиль</div>
        <h2 class="cormorant res-name">${t.name}</h2>
        <p class="res-desc">${t.desc}</p>
      </div>

      <div class="r-section">
        <div class="r-title">💉 Рекомендованные процедуры</div>
        <div class="r-card">
          <ul class="r-ul">
            ${t.procs.map(p => `<li class="r-li">${p}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="r-section">
        <div class="r-title">🧪 Лабораторный Check-Up</div>
        <div class="r-card" style="background: #FAFAFA;">
          <ul class="r-ul">
            ${t.tests.map(c => `<li class="r-li">${c}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="r-section">
        <div class="r-title">💊 Нутрицевтическая поддержка</div>
        <div style="margin-top: 8px;">
          ${t.nutri.map(n => `<span class="nutri-tag">${n}</span>`).join('')}
        </div>
      </div>

      <div class="fine-print">Данный протокол носит информационный характер и требует клинического подтверждения на очной консультации врача-косметолога.</div>
    </div>`;
}

function fResult() {
  return `
    <button class="btn btn-gold" onclick="triggerHaptic('medium'); openBotLink('get_pdf_protocol')">📥 Скачать PDF-протокол (в бот)</button>
    <button class="btn btn-black" style="margin-top:2px;" onclick="triggerHaptic('medium'); navigateTo('booking')">✍️ Записаться на диагностику к Ирине</button>
    `;
}

function bBooking() {
  return `<div class="name-screen"><h2 class="cormorant ns-title">Запись к Ирине</h2><p>Здесь будет форма записи</p></div>`;
}
function fBooking() {
  return `<button class="btn btn-outline" onclick="navigateTo('result')">← Назад к протоколу</button>`;
}

// Вспомогательные функции навигации
function submitName() {
  const c = (S.userName || '').trim();
  if(c.length < 2) { S.nerr = true; render(); triggerHaptic('warning'); return; }
  triggerHaptic('medium'); S.screen = 'quiz'; render();
}

function nextQ() {
  if(S.sel === null) return;
  triggerHaptic('medium');
  const o = Q[S.qi].opts[S.sel];
  for(const [k, v] of Object.entries(o.s)) S.scores[k] += v;
  S.answers.push(S.sel); S.sel = null;
  if(S.qi < Q.length - 1) { S.qi++; render(); }
  else { S.screen = 'consent'; render(); }
}

function submitConsent() {
  if(!S.consent) { S.cerr = true; render(); triggerHaptic('warning'); return; }
  triggerHaptic('success'); S.screen = 'loading'; render();
  setTimeout(calcResult, 2200);
}

function calcResult() {
  let max = -1, win = 'T5';
  for(const [k, v] of Object.entries(S.scores)) { if(v > max) { max = v; win = k; } }
  S.result = win; S.screen = 'result'; render();
}