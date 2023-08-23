import favApi from './js/favorites-api';
const throttle = require('lodash.throttle');

const categoryListFavorite = document.querySelector('.category-list-favorites');
const favoriteCards = document.querySelector('.favorites-list');
const favorPagin = document.querySelector('#pagination');
const favCaptive = document.querySelector('.favorites-text');

let AllCategories = [];

let favCount = 0;
let perPageLimit = 3;
let favObj = favApi.getLs();
let currentCategory = '';

console.log(favObj);

window.onresize = throttle(function () {
    renewRecipes();
}, 500);

// functions
function renewRecipes(page) {
    page ||= 1;
    page = Number(page);
    favObj = favApi.getLs();
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
                    `<li class="item-cards"><img class="card-img" data-recipe-id="${
                        recipe._id
                    }"src="${
                        recipe.preview
                    }"/><button class="add-fav-btn" data-recipe-id="${
                        recipe._id
                    }">love</button><span class="span-title">${recipe.title.toUpperCase()}</span><span class="span-descr">${
                        recipe.description
                    }</span><button class="main-see-recipe">See recipe</button></li>`
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
                let res = favApi.togleFav(e.target.dataset.recipeId);
                // console.log(res);
                renewRecipes(page);
                // if (res) togle class  'favorite' : 'unfavorite'
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
    } else {
        favCaptive.style.display = 'flex';
    }
}

renewRecipes();

//     let favObj = favApi.getLs();
//     testyApiService.getRecipes().then(data => {
//         let tmpContent = '';
//         data.results.forEach(recipe => {
//             let favClass = (recipe._id in favObj) ? 'favorite' : 'unfavorite';
//             tmpContent += `<li class="item-cards"><img class="card-img" data-recipe-id="${recipe._id}"src="${recipe.preview}"/><button class="add-fav-btn ${favClass}" data-recipe-id="${recipe._id}">love</button><span class="span-title">${(recipe.title).toUpperCase()}</span><span class="span-descr">${recipe.description}</span><button class="main-see-recipe">See recipe</button></li>`;
//         });

//         content.querySelectorAll('.main-see-recipe').forEach(button => {
//             button.addEventListener('click', openModal);
//         });

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
