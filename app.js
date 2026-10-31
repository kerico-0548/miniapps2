const config = window.STUDIO_CONFIG || {};
document.querySelectorAll('[data-studio-name]').forEach(el => { el.textContent = config.name || 'клякса'; });
document.title = `${config.name || 'Клякса'} — детская художественная мастерская`;

const courses = {
  music: { title: 'Рисование под музыку', tag: 'Для малышей', description: 'Звуки становятся отправной точкой для рисунка: спокойная мелодия может превратиться в мягкую линию, а весёлый ритм — в россыпь цветных пятен. Здесь интересно исследовать и придумывать.', activities: ['Слушать музыку и замечать её настроение', 'Подбирать цвета к своим впечатлениям', 'Экспериментировать с линиями, пятнами и ритмом'] },
  sketch: { title: 'Скетчинг для детей', tag: '7–14 лет', description: 'Скетч — это быстрая зарисовка, которая сохраняет идею или впечатление. Знакомимся с основами рисунка через простые предметы и сюжеты, учимся наблюдать и свободнее выражать свои идеи.', activities: ['Замечать пропорции и простые формы', 'Знакомиться с композицией и объёмом', 'Делать быстрые зарисовки и искать свой почерк'] },
  clay: { title: 'Лепка на гончарном круге', tag: 'Возраст уточняйте у мастерской', description: 'Глина, вода и вращение круга — знакомство с ремеслом, в котором форма рождается прямо под руками. Пробуем чувствовать материал и понимать, как движение влияет на будущую работу.', activities: ['Знакомиться с глиной и гончарным кругом', 'Пробовать создавать объёмную форму', 'Узнавать об этапах изготовления керамики'] },
};

const tg = window.Telegram?.WebApp;
if (tg && tg.initData) {
  tg.ready();
  tg.expand();
  if (tg.isVersionAtLeast('6.1')) {
    tg.setHeaderColor('#f8f5ed');
    tg.setBackgroundColor('#f8f5ed');
  }
  tg.BackButton.onClick(() => document.querySelector('dialog[open]')?.close());
}

const courseDialog = document.getElementById('course-dialog');
const contactDialog = document.getElementById('contact-dialog');
let selectedCourse = '';
function showDialog(dialog) {
  document.querySelectorAll('dialog[open]').forEach(d => d.close());
  dialog.showModal();
  document.body.classList.add('modal-open');
  if (tg?.initData) tg.BackButton.show();
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (tg?.initData) tg.BackButton.hide();
  });
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
});
document.querySelectorAll('[data-course]').forEach(button => button.addEventListener('click', () => {
  const course = courses[button.dataset.course];
  selectedCourse = course.title;
  document.getElementById('dialog-title').textContent = course.title;
  document.getElementById('dialog-tag').textContent = course.tag;
  document.getElementById('dialog-description').textContent = course.description;
  document.getElementById('dialog-list').replaceChildren(...course.activities.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  showDialog(courseDialog);
}));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));

function contact(course = '') {
  const username = (config.telegramUsername || '').replace(/^@/, '').trim();
  if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) { showDialog(contactDialog); return; }
  const message = course ? `Здравствуйте! Хочу узнать о занятии «${course}»: стоимость, расписание и свободные места.` : 'Здравствуйте! Хочу узнать о занятиях в вашей художественной мастерской.';
  const url = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
  if (tg?.initData) tg.openTelegramLink(url);
  else window.open(url, '_blank', 'noopener,noreferrer');
}
document.querySelectorAll('.contact-button').forEach(button => button.addEventListener('click', () => contact()));
document.getElementById('course-contact').addEventListener('click', () => contact(selectedCourse));
document.querySelector('.close-contact').addEventListener('click', () => contactDialog.close());
