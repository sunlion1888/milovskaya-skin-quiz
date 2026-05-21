const app = document.getElementById('app');
const headerEl = document.createElement('div');
headerEl.id = 'header';
const contentEl = document.createElement('div');
contentEl.id = 'content';
contentEl.className = 'content';
const footerEl = document.createElement('div');
footerEl.id = 'footer';
footerEl.className = 'bottom';
app.appendChild(headerEl);
app.appendChild(contentEl);
app.appendChild(footerEl);

tg.ready();
tg.setHeaderColor('#FFFFFF');
tg.setBackgroundColor('#FFFFFF');
setTimeout(() => tg.expand(), 120);

window.TOTAL_STEPS = Q.length;

// Проверяем сохранённый прогресс
if (loadProgress()) {
  // Если есть прогресс, предлагаем продолжить (автоматически переходим на квиз)
  // Можно сделать диалог, но для простоты сразу продолжаем
  S.screen = 'quiz';
  render();
} else {
  // Проверяем, есть ли результат, чтобы показать предыдущий протокол
  const lastResult = loadLastResult();
  if (lastResult && lastResult.result) {
    // Показываем результат с возможностью повторного теста
    S.result = lastResult.result;
    S.userName = lastResult.userName || '';
    S.screen = 'result';
    render();
  } else {
    navigateTo('welcome');
  }
}