// Создаём статический скелет приложения
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

// Инициализация Telegram
tg.ready();
tg.setHeaderColor('#FFFFFF');
tg.setBackgroundColor('#FFFFFF');
setTimeout(() => tg.expand(), 120);

// Установим TOTAL_STEPS
window.TOTAL_STEPS = Q.length;

// Запускаем первый рендер
navigateTo('welcome');