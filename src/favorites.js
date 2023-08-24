const throttle = require('lodash.throttle');

const categoryListFavorite = document.querySelector('.category-list-favorites');
const favoriteCards = document.querySelector('.favorites-list');
const favorPagin = document.querySelector('#pagination');
const favCaptive = document.querySelector('.favorites-text');

let AllCategories = [];

let favCount = 0;
let perPageLimit = 3;
let currentCategory = '';

window.onresize = throttle(function () {
    renewRecipes();
}, 500);

// functions
function renewRecipes(page) {
    page ||= 1;
    page = Number(page);
    let favApi = require('./js/favorites-api').default;
    let favObj = favApi.getLs();
    let cardsArray = [];
    AllCategories = [];
    favCount = 0;
    perPageLimit = window.innerWidth < 768 ? 2 : 3;
    let counter = 0;
    Object.keys(favObj).forEach(id => {
        let recipe = favObj[id];
        //console.log(id, recipe);
        favCount++;
        if (!AllCategories.includes(recipe.category)) {
            AllCategories.push(recipe.category);
        }
    });
    currentCategory = AllCategories.includes(currentCategory)
        ? currentCategory
        : '';
    Object.keys(favObj).forEach(id => {
        let recipe = favObj[id];
        //console.log(recipe);
        let totalCards = 0;
        let start = page === 1 ? 0 : (page - 1) * perPageLimit;
        let end = page === 1 ? perPageLimit : page * perPageLimit;
        if (
            (currentCategory && recipe.category === currentCategory) ||
            !currentCategory
        ) {
            counter++;
            if (
                cardsArray.length < perPageLimit &&
                counter > start &&
                counter <= end
            ) {
                totalCards++;
                cardsArray.push(
                    `<li class="item-cards">
                      <img class="card-img" data-recipe-id="${recipe._id}" src="${recipe.preview}"/>
                      <button class="add-fav-btn" data-recipe-id="${recipe._id}">
                          <svg class="heart-svg" width="22" height="22" viewBox="0 0 22 22" fill="#F8F8F8" xmlns="http://www.w3.org/2000/svg">
                              <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </button>
                      <span class="span-title">${recipe.title.toUpperCase()}</span>
                      <span class="span-descr">${recipe.description}</span>
                      <button class="main-see-recipe" data-recipe-id="${recipe._id}">See recipe</button>
                    </li>`
                );
            }
        }
    });
    const markup = AllCategories.sort()
        .map(category => {
            return `<li class="favourites-list-btn"><button class="category-btn" data-recipe-category="${category}">${category}</button></li>`;
        })
        .join('');
    categoryListFavorite.innerHTML = markup;

    categoryListFavorite.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            currentCategory = e.target.dataset.recipeCategory;
            console.log(e.target.dataset.recipeCategory);
            // renew favors
            renewRecipes();
        });
    });

    document.querySelector('.all-tags').addEventListener('click', () => {
        currentCategory = '';
        console.log('categories reset', currentCategory);
        // renew favors
        renewRecipes();
    });
    if (cardsArray.length) {
        favoriteCards.innerHTML = cardsArray.join('');
        favoriteCards.querySelectorAll('.add-fav-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                favApi.togleFav(e.target.closest('button').dataset.recipeId);
                renewRecipes(page);
            });
        });
        favoriteCards.querySelectorAll('.main-see-recipe').forEach(button => {
            let modal = require('./js/modal-recipe');
            button.addEventListener('click', (e) => {
                console.log(e.target.dataset);
                modal.default.open(e.target.closest('button').dataset.recipeId);
            });
        });
        if (counter > perPageLimit) {
            pagination(
                page,
                Math.ceil(counter / perPageLimit),
                favorPagin,
                renewRecipes
            );
        } else {
            favorPagin.innerHTML = '';
        }
        favCaptive.style.display = 'none';
        document.querySelector('.favorites-tags').style.display='flex';
    } else {
        favoriteCards.innerHTML = '';
        favCaptive.style.display = 'flex';
        document.querySelector('.favorites-tags').style.display='none';
    }
}

renewRecipes();

// pagination
function pagination(page, total, container, callback) {
    page = Number(page);
    total = Number(total);
    let btns = window.innerWidth < 768 ? 2 : 3;
    console.log(page, total);

    if (total > 1) {
        container.innerHTML = '';
        if (page === 1) {
            // inactive prev b
            container.innerHTML += `<button class="main-pag-btn" disabled><<</button>`;
            container.innerHTML += `<button class="main-pag-btn" disabled><</button>`;
        } else {
            // active prev b
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="1"><<</button>`;
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${
                page - 1
            }"><</button>`;
        }
        for (let i = page - btns; i <= page + btns; i++) {
            if (i > 0 && i <= total) {
                if (i === page) {
                    //current page b
                    container.innerHTML += `<button class="main-pag-btn main-pag-btn-green active"  data-topage="${i}">${i}</button>`;
                } else if (i === page + btns || i === page - btns) {
                    //other pages b
                    container.innerHTML += `<button class="main-pag-btn" data-topage="${i}">...</button>`;
                } else {
                    //other pages b
                    container.innerHTML += `<button class="main-pag-btn" data-topage="${i}">${i}</button>`;
                }
            }
        }
        if (page === total) {
            // inactive forward b
            container.innerHTML += `<button class="main-pag-btn" disabled>></button>`;
            container.innerHTML += `<button class="main-pag-btn" disabled>>></button>`;
        } else {
            // active forward b
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${
                page + 1
            }">></button>`;
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${total}">>></button>`;
        }
        container.querySelectorAll('[data-topage]').forEach(btn => {
            /* console.log(btn.dataset.topage) */ btn.addEventListener(
                'click',
                function (e) {
                    e.preventDefault();
                    callback(Number(e.target.dataset.topage));
                }
            );
        });
    }
}
