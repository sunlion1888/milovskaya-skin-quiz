const tg = window.Telegram.WebApp;

const PHOTO_URL  = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/assets/photo.jpg';
const LOGO_URL   = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/assets/logo.jpg';

// ID пользователей, которым разрешено проходить тест без ограничения 30 дней
const ADMIN_IDS = [
  437459182,   // @looatin_sun
  455906678    // @MilovskayaDR
];

// URL Google Apps Script для записи в таблицу
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0G9p15PYufZxm-CEx3d3V6qGudbmqIa4jucgk3SmH7Q-b6QY_K2P0V1h5rBnBcW-5UQ/exec';

// Ключи localStorage с привязкой к пользователю
const STORAGE_PREFIX = 'skin_quiz_' + (tg.initDataUnsafe?.user?.id || 'anonymous') + '_';
const STORAGE_PROGRESS_KEY = STORAGE_PREFIX + 'progress';
const STORAGE_RESULT_KEY = STORAGE_PREFIX + 'result';
const STORAGE_DATE_KEY = STORAGE_PREFIX + 'last_test_date';

let S = {
  screen: 'welcome',
  userName: '',
  qi: 0,
  scores: {T1:0, T2:0, T3:0, T4:0, T5:0},
  answers: [],
  sel: null,
  result: null,
  consent: false,
  cerr: false,
  nerr: false,
  direction: 'forward'
};

let TOTAL_STEPS = 12;