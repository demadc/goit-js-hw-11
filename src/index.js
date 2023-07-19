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

import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import {refs} from './js/refs'
import { spinnerPlay, spinnerStop } from './js/spinner';


// const API_KEY = '38340280-b003a391f90344c60b113d02d';
// axios.defaults.headers.common['key'] = API_KEY;
//const BASE_URL = 'https://pixabay.com/api/';

const BASE_URL = 'https://pixabay.com/api/?key=38340280-b003a391f90344c60b113d02d';



const {formEl, inputEl, btnEl, gallery, btnLoadMore} = refs;
let currentPage = 1;
const lightbox = new SimpleLightbox('.gallery a', { 
  captionDelay: 250,
  captionsData: 'alt',
});

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = inputEl.value.trim();
  
  if (!searchQuery) {
    return;
  }
  
  currentPage = 1;

  try {
    const response = await axios.get(`${BASE_URL}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const { data } = response;
    
    console.log(data);
    
    if (data.totalHits > currentPage * 40) {
      btnLoadMore.classList.remove("is-hidden");
    }
    
    if (data.total === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
    }
    
    gallery.innerHTML = "";
    renderCollection(data.hits);
    lightbox.refresh();
    console.log(currentPage);
  } catch (error) {
    console.log(error);
    
  }
});

function createMarkup ({webformatURL, tags, likes, views, comments, downloads, largeImageURL}) {
    const markup = `<div class="photo-card">
      <a href ="${largeImageURL}" class="link">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads }</b>
        </p>
      </div>
    </div>`;
    
    gallery.insertAdjacentHTML("beforeend", markup);
  }
  
  function renderCollection (el) {
    el.forEach(el => {
        createMarkup(el);
      console.log(el);
    });
  }


btnLoadMore.addEventListener('click', async () => {
  currentPage++;
  
  try {
    const response = await axios.get(`${BASE_URL}&q=${inputEl.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
    const { data } = response;
    
    if (data.totalHits <= currentPage * 40) {
      Notiflix.Notify.warning('We are sorry, but you have reached the end of the search results.');
      btnLoadMore.classList.add("is-hidden");
    }
    
    renderCollection(data.hits);
    lightbox.refresh();
    console.log(currentPage);
  } catch (error) {
    console.log(error);
  }
});

//--
const observer = new IntersectionObserver(loadMorePhotos, options);

const onSubmitClick = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;

  const search_query = searchQuery.value.trim().toLowerCase();

  if (!search_query) {
    clearPage();
    Notify.info('Enter data to search!', notifyInit);

    refs.searchInput.placeholder = 'What`re we looking for?';
    return;
  }

  pixaby.query = search_query;

  clearPage();

  try {
    spinnerPlay();
    const { hits, total } = await pixaby.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${search_query}. Please try again.`,
        notifyInit
      );

      return;
    }
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    pixaby.setTotal(total);
    Notify.success(`Hooray! We found ${total} images.`, notifyInit);

    if (pixaby.hasMorePhotos) {
      

      const lastItem = document.querySelector('.gallery a:last-child');
      observer.observe(lastItem);
    }

    modalLightboxGallery.refresh();
    
    // scrollPage();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!', notifyInit);

    clearPage();
  } finally {
    spinnerStop();
  }
};


const onLoadMore = async () => {
    pixaby.incrementPage();
  
    if (!pixaby.hasMorePhotos) {
      refs.btnLoadMore.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      notifyInit;
    }
    try {
      const { hits } = await pixaby.getPhotos();
      const markup = createMarkup(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
  
      modalLightboxGallery.refresh();
    } catch (error) {
      Notify.failure(error.message, 'Something went wrong!', notifyInit);
  
      clearPage();
    }
  };
  
  function clearPage() {
    pixaby.resetPage();
    refs.gallery.innerHTML = '';
    refs.btnLoadMore.classList.add('is-hidden');
  }
  
  refs.form.addEventListener('submit', onSubmitClick);
  refs.btnLoadMore.addEventListener('click', onLoadMore);
  
  //  smooth scrolling
  function scrollPage() {
    const { height: cardHeight } = document
      .querySelector('.photo-gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

















//-------------------------------------------------
// import axios from 'axios';
// const API_KEY = '38277598-05a082c915074d2caf7c5aa6f';
// axios.defaults.headers.common['key'] = API_KEY;
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import Notiflix from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const refs = {
//     formEl: document.querySelector('.search-form'),
//     formBtnEl: document.querySelector('.search-form-btn'),
//     inputEl: document.querySelector('.search-form-input'),
//     gallery: document.querySelector('.gallery'),
//     btnLoadMore: document.querySelector('.load-more'),
// };

// let currentPage = 1;

// //refs.formBtnEl.addEventListener('submit', onSubmitClick);
// refs.formEl.addEventListener('submit', onSubmitClick);
// refs.btnLoadMore.classList.add('is-hidden');

// async function onSubmitClick(evt) {
//     evt.preventDefault();
//     const BASE_URL = 'https://pixabay.com/api/';
//     const params = new URLSearchParams({
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page: 1,
//         per_page: 40,
//     });

//   const searchQuery = inputEl.value.trim().toLowerCase();

//   if (!searchQuery) {
//    clearPage();
//      Notify.info('Enter data to search!', notifyInit);
//      refs.inputEl.placeholder = 'What we are looking for?';
//     return;
//   }
//   currentPage = 1;

//   try {
//     const response = await axios.get(`${BASE_URL}${params}`);
//     const { data } = response;
    
//     console.log(data);
    
//     if (data.totalHits > currentPage * 40) {
//       btnLoadMore.classList.remove("is-hidden");
//     }
    
//     if (data.total === 0) {
//       Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//     } else {
//       Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
//     }
    
//     gallery.innerHTML = "";
//     renderCollection(data.hits);
//     lightbox.refresh();
//     console.log(currentPage);
//   } catch (error) {
//     console.log(error);
    
//   }
// };
//   getPhotos()
//   .then(data =>  {
    
//     const markup = createMarkup(data.hits);
//     refs.gallery.insertAdjacentHTML('beforeend', markup);
   
//     return data;
//   })
//   .catch(err => {
//     console.log(err.massege);
    
//   });


// async function getPhotos() {

//     const query = input.value;
//     const BASE_URL = 'https://pixabay.com/api/';
//     const params = new URLSearchParams({
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page: 1,
//         per_page: 40,
//     });
//   return await axios(`${BASE_URL}?${params}`).then((response) => {
    
//     // { status, data }
//     if (response.status !== 200) {
//       throw new Error(error);
//     }

//       return response.hint;
      
//   });
// };

// function createMarkup(arr) {
//     return arr
//       .map(
//         ({
//           tags,
//           webformatURL,
//           largeImageURL,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `
//               <a href='${largeImageURL}' class="card-link js-card-link">
//               <div class="photo-card">
//                 <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
//                 <div class="info">
//                   <div class="info-item info-item-likes">
//                     <button type="button" class="circle"></button>
//                     <div class="box-likes"><b>Likes</b>
//                     <span id="value">${likes}</span>
//                     </div>
                    
//                   </div>
//                   <p class="info-item">
//                     <b>Views</b>
//                     ${views}
//                   </p>
//                   <p class="info-item">
//                     <b>Comments</b>
//                     ${comments}
//                   </p>
//                   <p class="info-item">
//                     <b>Downloads</b>
//                     ${downloads}
//                   </p>
//                 </div>
//               </div>
//               </a>`;
//         }
//       )
//       .join('');
//   }

//------------------------------------


    


 
