tg.ready();
tg.setHeaderColor('#FFFFFF');
tg.setBackgroundColor('#FFFFFF');
setTimeout(() => tg.expand(), 120);

// Установим TOTAL_STEPS равным реальной длине вопросов
window.TOTAL_STEPS = Q.length;

render();