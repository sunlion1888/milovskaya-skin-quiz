tg.ready();
tg.setHeaderColor('#FFFFFF');
tg.setBackgroundColor('#FFFFFF');
setTimeout(() => tg.expand(), 120);

// Если нужно, можно установить TOTAL_STEPS равной Q.length
// TOTAL_STEPS уже объявлена в state.js, переопределим
window.TOTAL_STEPS = Q.length;

render();