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
navigateTo('welcome');