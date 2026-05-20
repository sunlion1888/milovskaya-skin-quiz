const tg = window.Telegram.WebApp;

const PHOTO_URL  = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/photo.jpg';
const LOGO_URL   = 'https://raw.githubusercontent.com/sunlion1888/milovskaya-skin-quiz/main/logo.png';

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
  nerr: false
};

let TOTAL_STEPS = 12; // будет переопределено после загрузки quizData