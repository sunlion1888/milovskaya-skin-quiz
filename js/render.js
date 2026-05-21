function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function render() {
  // Очищаем таймер предыдущего экрана (если был)
  if (contentEl.firstChild && contentEl.firstChild._timer) {
    clearInterval(contentEl.firstChild._timer);
  }
  if (contentEl.firstChild && contentEl.firstChild._interval) {
    clearInterval(contentEl.firstChild._interval);
  }

  clearElement(headerEl);
  clearElement(contentEl);
  clearElement(footerEl);

  if (S.screen === 'loading') {
    renderLoadingScreen();
    return;
  }

  if (S.screen === 'quiz') {
    renderQuizHeader();
  }

  const bodyEl = getBodyElement(S.screen);
  if (bodyEl) contentEl.appendChild(bodyEl);

  const footEl = getFooterElement(S.screen);
  if (footEl) footerEl.appendChild(footEl);

  postRender();
}

function navigateTo(screen) {
  S.screen = screen;
  render();
}

function postRender() {
  if (S.screen === 'name') {
    setTimeout(() => {
      const input = document.getElementById('nameInput');
      if (input) input.focus();
    }, 100);
  }
}