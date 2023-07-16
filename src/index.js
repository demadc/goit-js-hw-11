// HTTP-запити

// Для бекенду використовуй публічний API сервісу Pixabay.
//Зареєструйся, отримай свій унікальний ключ доступу і ознайомся з документацією.

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії,
//тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.
// У відповіді буде масив зображень, що задовольнили критерії параметрів
//запиту. Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

// Якщо бекенд повертає порожній масив, значить нічого підходящого не було
// знайдено.У такому разі показуй повідомлення з текстом
// "Sorry, there are no images matching your search query. Please try again.".
// Для повідомлень використовуй бібліотеку notiflix.

import axios from 'axios';
axios.defaults.headers.common['key'] = API_KEY;
//import Notiflix from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '38277598-05a082c915074d2caf7c5aa6f';
const BASE_URL = 'https://pixabay.com/api/';
const query = input.value;

new URLSearchParams({
  q: query,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});

const refs = {
  selectEl: document.querySelector('.breed-select'),
  contentEl: document.querySelector('.cat-info'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
};
