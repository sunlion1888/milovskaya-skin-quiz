const tg = window.Telegram.WebApp;

const PHOTO_URL  = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/assets/photo.jpg';
const LOGO_URL   = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/assets/logo.jpg';

const STORAGE_PROGRESS_KEY = 'skin_quiz_progress';
const STORAGE_RESULT_KEY = 'skin_quiz_result';
const STORAGE_DATE_KEY = 'skin_quiz_last_test_date';

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