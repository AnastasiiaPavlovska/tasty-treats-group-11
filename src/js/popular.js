import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

const popularRecepies = document.querySelector('.js-popular-recepies');
const body = document.body;

// Функція отримання популярних рецептів з бекенду
async function getRecipes() {
    try {
        const response = await axios.get(`${BASE_URL}/recipes/popular`);
        // console.log(response);
        return response.data;
    } catch (error) {
        Notiflix.Notify.failure(
            'Sorry, something went wrong. Please try again later.'
        );
        console.log(error);
        throw error;
    }
}
getRecipes()
    .then(data => {
        popularRecepies.innerHTML = createMarkupPopularRecepies(data);
        // console.log(data);
    })
    .catch(err => {
        console.log(err);
    });

// Функція відмалювання популярних рецептів за данних отриманних з беку
function createMarkupPopularRecepies(arr) {
    return arr
        .map(
            ({ preview, title, description, _id }) => `
      <li class="popular-recepies-item" data-id="${_id}">
          <div class="thomb-popular-wrap">
            <div class="thomb-popular-img">
              <img src="${preview}" alt="${title}">
            </div>
            <div class="thomb-popular-info">
              <h3 class="thomb-popular-title points-title">${title}</h3>
              <p class="popular-recepie-descr points-desc">${description}</p>
            </div>
          </div>
      </li>
       
  `
        )
        .join('');
}

// Вішаемо слухач подій на список популярних рецептів
popularRecepies.addEventListener('click', openModalOnClick);

// Функція відкриття модалки по кліку на обраний популярний рецепт
function openModalOnClick(evt) {
    evt.preventDefault();

    const resepieID = evt.target.closest('.popular-recepies-item').dataset.id;
    let modal = require('./modal-recipe.js');
    modal.default.open(resepieID);
    // openModal(resepieID);
}
function openModal(id) {
    fetch(`https://tasty-treats-backend.p.goit.global/api/recipes/${id}`)
        .then(response => response.json())
        .then(recipe => {
            // Отримуемо з бекенду рецепт за обраним ID
            const {
                title,
                instructions,
                preview,
                rating,
                time,
                youtube,
                ingredients: { desc, id, measure, name },
                tags,
            } = recipe;
            // console.log(recipe);
            // console.log(description);

            createModalRecepieById(recipe);
            body.classList.add('no-scroll');
        })
        .catch(error => {
            Notiflix.Notify.failure(
                'Sorry, there is no information about this recipe. Please try another one.'
            );
            console.log(error);
        });
}

// Функція відмальовки модального вікна обриного рецепту
function createModalRecepieById({
    title,
    thumb,
    instructions,
    preview,
    rating,
    time,
    youtube,
    ingredients: { desc, id, measure, name },
    tags,
}) {
    const divModalBackdrop = document.createElement('div');
    divModalBackdrop.classList.add('js-modal');
    divModalBackdrop.classList.add('is-active');
    divModalBackdrop.innerHTML = `
      <div class="modal-bg">
      <div class="modal-body">
          <div class="modal-close">
              <button type="button" class="modal-close-btn">x
                  <svg class="modal-close-icon" width="16" height="16">
                      <use href="/src/img/sprite.svg#icon-modal-close"></use>
                  </svg>
              </button>
          </div>
          <div class="modal-content">
              <div class="video-oder">
                  <h2 class="modal-recepi-title">${title}</h2>
                  <div class="recipe-video-content">
                      <a href="" class="youtube-link">
                          <div class="recepi-video-wrap">
                              <img src="${preview}" alt="${title}">
                          </div>
                          <div class="youtube-btn">
                              <svg class="youtube-icon" width="32" height="32">
                                  <use href="/src/img/youtube.svg#youtube-icon"></use>
                              </svg>
                          </div>
                      </a>
                  </div>
              </div>
              <div class="recipe-info-order">
                  <div class="recepi-rating">
                      <p class="recepi-rating-value">${rating}</p>
                      <div class="recepi-rating-body">
                          <div class="rating-active">
                              <div class="rating-items">
                                  <input type="radio" class="rating-start-item" value="1" name="rating">
                                  <input type="radio" class="rating-start-item" value="2" name="rating">
                                  <input type="radio" class="rating-start-item" value="3" name="rating">
                                  <input type="radio" class="rating-start-item" value="4" name="rating">
                                  <input type="radio" class="rating-start-item" value="5" name="rating">
                              </div>
                          </div>
                      </div>
                      <p class="recepi-time-cook">${time} min</p>
                  </div>
                  <div class="recepi-ingredients-list list">
                      <li class="recepi-ingredients-item">
                          <p class="ingredient-name">Banana</p>
                          <p class="ingredient-mesure">1 large</p>
                      </li>
                      <li class="recepi-ingredients-item">
                          <p class="ingredient-name">Eggs</p>
                          <p class="ingredient-mesure">2 medium</p>
                      </li>
                      <li class="recepi-ingredients-item">
                          <p class="ingredient-name">Oil</p>
                          <p class="ingredient-mesure">1 tsp</p>
                      </li>
                      <li class="recepi-ingredients-item">
                          <p class="ingredient-name">Pecan nuts</p>
                          <p class="ingredient-mesure">25 tsp</p>
                      </li>
                      <li class="recepi-ingredients-item">
                          <p class="ingredient-name">Baking Powder</p>
                          <p class="ingredient-mesure">Pinch</p>
                      </li>
                  </div>
                  <div class="recepi-tags-wrap">
                      <ul class="recepi-tags-list list">
                          <li class="recepi-tags-item">
                              <button type="button" class="recepi-tags-btn">#Breakfast</button>
                          </li>
                          <li class="recepi-tags-item">
                              <button type="button" class="recepi-tags-btn">#Desert</button>
                          </li>
                          <li class="recepi-tags-item">
                              <button type="button" class="recepi-tags-btn">#Sweet</button>
                          </li>
                      </ul>
                  </div>
              </div>
              <p class="modal-recepi-description">${instructions}</p>
              <div class="modal-recepi-buttons">
                  <button type="button" class="add-favorit">Add to favorite</button>
                  <button type="button" class="give-rating">Give rating</button>
              </div>
          </div>
      </div>
    </div>
      `;
    document.body.appendChild(divModalBackdrop);
    //    Створюємо змінну кнопки для модалки і віщаємо обробку події закриття модалки
    const modalCloseBtn = divModalBackdrop.querySelector('.modal-close-btn');
    modalCloseBtn.addEventListener('click', closeModal);
}
// Функція закриття модалки
function closeModal() {
    const modal = document.querySelector('.js-modal.is-active');
    if (modal) {
        modal.remove();
        body.classList.remove('no-scroll');
    }
}
//   Закриття модалки по кнопкі Escape
window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
// Закриття модалки по кліку на область за модалкою
window.addEventListener('click', event => {
    if (
        event.target.classList.contains('modal-close-btn') ||
        event.target.classList.contains('modal-bg')
    ) {
        closeModal();
    }
});
