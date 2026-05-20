tg.ready();
tg.setHeaderColor('#FFFFFF');
tg.setBackgroundColor('#FFFFFF');
tg.expand();

// Тёмная тема
function applyTheme() {
  if (tg.colorScheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
applyTheme();
tg.onEvent('themeChanged', applyTheme);

// Проверка expanded
setTimeout(() => {
  if (!tg.isExpanded) {
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:var(--black); color:#fff; padding:12px; text-align:center; z-index:3000;';
    banner.innerHTML = 'Разверните приложение для комфортного прохождения <button id="expandBtn" style="margin-left:8px;">Развернуть</button>';
    document.body.appendChild(banner);
    document.getElementById('expandBtn').addEventListener('click', () => {
      tg.expand();
      banner.remove();
    });
  }
}, 500);

// Слушатель изменения viewport
tg.onEvent('viewportChanged', ({ isStateStable }) => {
  if (isStateStable && !tg.isExpanded) {
    const banner = document.createElement('div');
    banner.id = 'expandReminder';
    banner.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:var(--black); color:#fff; padding:12px; text-align:center; z-index:3000;';
    banner.innerHTML = 'Разверните приложение <button id="expandBtn2" style="margin-left:8px;">Развернуть</button>';
    if (!document.getElementById('expandReminder')) {
      document.body.appendChild(banner);
      document.getElementById('expandBtn2').addEventListener('click', () => {
        tg.expand();
        banner.remove();
      });
    }
  }
});

// Первый рендер
render();