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
  nerr: false,
  // для анимации сдвига
  direction: 1, // 1 = forward, -1 = backward
  // для загрузки
  loadingHintIndex: 0,
  loadingInterval: null,
  // для истории
  history: []
};

const TOTAL_STEPS = Q.length;
const STORAGE_KEY = 'skinQuizState';
const HISTORY_KEY = 'skinQuizHistory';
const LOCK_KEY = 'skinQuizLockUntil';
const LOCK_DAYS = 30;

// Загрузка сохранённого состояния
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    S = { ...S, ...parsed };
  }
  const savedHistory = localStorage.getItem(HISTORY_KEY);
  if (savedHistory) {
    S.history = JSON.parse(savedHistory);
  }
} catch(e) {}