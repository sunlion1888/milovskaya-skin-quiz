let appHeader, appContent, appFooter;

function initContainers() {
  const app = document.getElementById('app');
  app.innerHTML = ''; // очищаем
  appHeader = document.createElement('header');
  appHeader.id = 'appHeader';
  appContent = document.createElement('main');
  appContent.id = 'appContent';
  appContent.className = 'content';
  appFooter = document.createElement('footer');
  appFooter.id = 'appFooter';
  appFooter.className = 'bottom';
  app.append(appHeader, appContent, appFooter);
}

function render() {
  if (!appHeader) initContainers();

  // Экран загрузки
  if (S.screen === 'loading') {
    appHeader.innerHTML = '';
    appContent.innerHTML = '';
    appContent.classList.remove('quiz-content');
    appContent.appendChild(buildLoadingScreen());
    appFooter.innerHTML = '';
    return;
  }

  // Квиз требует особого заголовка с прогресс-баром
  if (S.screen === 'quiz') {
    const pct = Math.round(((S.qi + 1) / Q.length) * 100);
    appHeader.innerHTML = `
      <div class="top-bar">
        <div class="pb-outer"><div class="pb-inner" style="width:${pct}%"></div></div>
        <div class="step-txt">${S.qi + 1} / ${Q.length}</div>
      </div>
    `;
    appContent.classList.add('quiz-content');
    appContent.innerHTML = '';
    appContent.appendChild(buildQuizContent());
    appFooter.innerHTML = '';
    appFooter.appendChild(buildQuizFooter());
    // автофокус на первой опции (десктоп)
    if (window.innerWidth > 768) {
      const firstOpt = document.querySelector('.opt');
      if (firstOpt) firstOpt.focus();
    }
    return;
  } else {
    appHeader.innerHTML = '';
    appContent.classList.remove('quiz-content');
  }

  // Остальные экраны
  appContent.innerHTML = '';
  appFooter.innerHTML = '';

  switch (S.screen) {
    case 'welcome':
      appContent.appendChild(buildWelcomeContent());
      appFooter.appendChild(buildWelcomeFooter());
      break;
    case 'science':
      appContent.appendChild(buildScienceContent());
      appFooter.appendChild(buildScienceFooter());
      break;
    case 'prep':
      appContent.appendChild(buildPrepContent());
      appFooter.appendChild(buildPrepFooter());
      break;
    case 'name':
      appContent.appendChild(buildNameContent());
      appFooter.appendChild(buildNameFooter());
      // фокус на поле ввода
      setTimeout(() => document.getElementById('nameInput')?.focus(), 100);
      break;
    case 'consent':
      appContent.appendChild(buildConsentContent());
      appFooter.appendChild(buildConsentFooter());
      break;
    case 'result':
      appContent.appendChild(buildResultContent());
      appFooter.appendChild(buildResultFooter());
      break;
    case 'booking':
      appContent.appendChild(buildBookingContent());
      appFooter.appendChild(buildBookingFooter());
      break;
    default:
      break;
  }
}

function navigateTo(screen) {
  S.screen = screen;
  render();
}