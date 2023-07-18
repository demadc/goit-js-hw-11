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
const API_KEY = '38277598-05a082c915074d2caf7c5aa6f';
axios.defaults.headers.common['key'] = API_KEY;

import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    formBtnEl: document.querySelector('.search-form-btn'),
    inputEl: document.querySelector('.search-form-input'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
};
refs.formBtnEl.addEventListener('submit', onSubmitClick);
refs.btnLoadMore.classList.add('is-hidden');



function onSubmitClick(evt) {
    evt.preventDefault();

  const { submitQuery } = evt.target.elements;
  const search_query = submitQuery.value.trim().toLowerCase();

  if (!search_query) {
   clearPage();
     Notify.info('Enter data to search!', notifyInit);

     refs.searchInput.placeholder = 'What we are looking for?';
    return search_query;
  }

  getPhotos()
  .then(data =>  {
    
    const markup = createMarkup(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
   
    return data;
  })
  .catch(err => {
    console.log(err.massege);
    
  });
}

async function getPhotos(page = 1) {

    const query = input.value;
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    });
  return await axios(`${BASE_URL}?${params}`).then((response) => {
    
    // { status, data }
    if (response.status !== 200) {
      throw new Error(error);
    }

      return response.hint;
      
  });
};

  function createMarkup(arr) {
    return arr
      .map(
        ({
          tags,
          webformatURL,
          largeImageURL,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
              <a href='${largeImageURL}' class="card-link js-card-link">
              <div class="photo-card">
                <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <div class="info-item info-item-likes">
                    <button type="button" class="circle"></button>
                    <div class="box-likes"><b>Likes</b>
                    <span id="value">${likes}</span>
                    </div>
                    
                  </div>
                  <p class="info-item">
                    <b>Views</b>
                    ${views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                  </p>
                </div>
              </div>
              </a>`;
        }
      )
      .join('');
  }