/**
 * Очищает содержимое элемента (удаляет все дочерние узлы)
 */
function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Главная функция рендеринга экрана.
 * Обновляет header, content и footer в зависимости от текущего S.screen.
 */
function render() {
  clearElement(headerEl);
  clearElement(contentEl);
  clearElement(footerEl);

  // Особый случай — экран загрузки (нет футера, особый контент)
  if (S.screen === 'loading') {
    renderLoadingScreen();
    return;
  }

  // Хедер (прогресс-бар) только для квиза
  if (S.screen === 'quiz') {
    renderQuizHeader();
  }

  // Контент
  const bodyEl = getBodyElement(S.screen);
  if (bodyEl) {
    contentEl.appendChild(bodyEl);
  }

  // Футер
  const footEl = getFooterElement(S.screen);
  if (footEl) {
    footerEl.appendChild(footEl);
  }

  // Дополнительные действия после рендера
  postRender();
}

/**
 * Навигация: меняет состояние и вызывает render.
 */
function navigateTo(screen) {
  S.screen = screen;
  render();
}