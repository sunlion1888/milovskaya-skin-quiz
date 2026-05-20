function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if(S.screen === 'loading') {
    app.innerHTML = `<div class="loading-full">
      <img src="${PHOTO_URL}" class="loading-logo" alt="Анализ...">
      <div class="cormorant loading-title">Синтезирую протокол...</div>
      <div style="font-size:13px; color:var(--gray)">Анализирую биомаркеры 🤍</div>
    </div>`;
    return;
  }

  const isQuiz = S.screen === 'quiz';
  let header = '';
  if(isQuiz) {
    const pct = Math.round(((S.qi + 1) / Q.length) * 100);
    header = `<div class="top-bar">
      <div class="pb-outer"><div class="pb-inner" style="width:${pct}%"></div></div>
      <div class="step-txt">${S.qi + 1} / ${Q.length}</div>
    </div>`;
  }

  let body = '', foot = '';
  if(S.screen === 'welcome') { body = bWelcome(); foot = fWelcome(); }
  else if(S.screen === 'prep')    { body = bPrep();    foot = fPrep();    }
  else if(S.screen === 'name')    { body = bName();    foot = fName();    }
  else if(S.screen === 'quiz')    { body = bQuiz();    foot = fQuiz();    }
  else if(S.screen === 'consent') { body = bConsent(); foot = fConsent(); }
  else if(S.screen === 'result')  { body = bResult();  foot = fResult();  }
  else if(S.screen === 'booking') { body = bBooking(); foot = fBooking(); }

  app.innerHTML = `${header}<div class="content${isQuiz ? ' quiz-content' : ''}">${body}</div>${foot ? `<div class="bottom">${foot}</div>` : ''}`;
  bind();
  
  if(S.screen === 'name') { setTimeout(() => document.getElementById('nameInput')?.focus(), 100); }
}

function navigateTo(screen) {
  S.screen = screen;
  render();
}

function bind() {
  document.querySelectorAll('.opt').forEach(el => {
    el.addEventListener('click', () => { triggerHaptic('light'); S.sel = +el.dataset.i; render(); });
  });
  const cr = document.getElementById('cr');
  if(cr) cr.addEventListener('click', () => { triggerHaptic('light'); S.consent = !S.consent; S.cerr = false; render(); });
  const ni = document.getElementById('nameInput');
  if(ni) ni.addEventListener('keydown', e => { if(e.key === 'Enter') submitName(); });
}