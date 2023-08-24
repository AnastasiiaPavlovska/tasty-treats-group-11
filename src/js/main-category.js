import TestyApiService from './testyApiService';
import favApi from './favorites-api';

var debounce = require('lodash.debounce');
var throttle = require('lodash.throttle');

const testyApiService = new TestyApiService();
const categoryList = document.querySelector('.category-list');
const content = document.querySelector('.list-item');
const inputFilter = document.querySelector('.filter-input');
const areaFilter = document.querySelector('.area');
const ingredientsFilter = document.querySelector('.ingrediends');
const timeFilter = document.querySelector('.time');
const allCategoryBtn = document.querySelector('.all-category-btn');
const resetFilter = document.querySelector('.reset-filters');

resetFilter.addEventListener('click', e => {
    document.querySelector('.form-filters').reset();
    testyApiService.setResetFilters();
    renewRecipes();
});

for (let i = 5; i <= 120; i += 5) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i + ' min';
    timeFilter.appendChild(opt);
}

// triggers
inputFilter.addEventListener(
    'input',
    debounce(function (e) {
        console.log(e.target.value.trim());
        testyApiService.setSearchText(e.target.value.trim());
        renewRecipes();
    }, 300)
);

ingredientsFilter.addEventListener('change', function (e) {
    console.log(e.target.value);
    testyApiService.setSearchIngredient(e.target.value);
    renewRecipes();
});

areaFilter.addEventListener('change', function (e) {
    console.log(e.target.selectedOptions[0].dataset.param);
    testyApiService.setSearchArea(e.target.selectedOptions[0].dataset.param);
    renewRecipes();
});

categoryList.addEventListener('click', function (e) {
    console.log(e.target.dataset.recipeCategory);
    testyApiService.setCategory(e.target.dataset.recipeCategory);
    renewRecipes();
});

timeFilter.addEventListener('change', function (e) {
    console.log(e.target.value);
    testyApiService.setSearchTime(e.target.value);
    renewRecipes();
});

allCategoryBtn.addEventListener('click', function () {
    testyApiService.setCategory('');
    renewRecipes();
});

//ОТРИМУЄМО СПИСОК КАТЕГОРІЙ ПРИ ЗАВАНТАЖЕНІ СТОРІНКИ
testyApiService.getCategories().then(data => {
    data.forEach(category => {
        categoryList.innerHTML += `<li class="category-item-list"><button class="category-btn" data-recipe-category="${category.name}">${category.name}</button></li>`;
    });
});

//ОТРИМУЄМО СПИСОК КРАЇН
testyApiService.getAreas().then(data => {
    data.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area._id;
        opt.innerHTML = area.name;
        opt.dataset.param = area.name;
        areaFilter.appendChild(opt);
    });
});

//ОТРИМУЄМО СПИСОК ІНГРІДІЄНТІВ
testyApiService.getIngredients().then(data => {
    data.forEach(element => {
        const opt = document.createElement('option');
        opt.value = element._id;
        opt.innerHTML = element.name;
        ingredientsFilter.appendChild(opt);
    });
});

window.onresize = throttle(function () {
    renewRecipes();
}, 500);

function perPage() {
    if (window.innerWidth < 768) testyApiService.setPerPage(6);
    else if (window.innerWidth < 1280) testyApiService.setPerPage(8);
    else testyApiService.setPerPage(9);
}

//ОТРИМУЄМО СПИСОК РЕЦЕПТІВ ПРИ ЗАВАНТАЖЕНІ СТОРІНКИ
renewRecipes();

const recipeRating = `
<div class="rating-recipe" id="rating-container">
    <span class="rating-number-recipe">4.5</span>
    <ul class="stars">
        <li>
            <svg class="star" data-rating="1" width="16" height="16">
                <use href="/src/img/sprite.svg#icon-Star-1"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="2" width="16" height="16">
                <use href="/src/img/sprite.svg#icon-Star-1"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="3" width="16" height="16">
                <use href="/src/img/sprite.svg#icon-Star-1"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="4" width="16" height="16">
                <use href="/src/img/sprite.svg#icon-Star-1"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="5" width="16" height="16">
                <use href="/src/img/sprite.svg#icon-Star-1"></use>
            </svg>
        </li>
    </ul>
</div>
`;

// functions
function renewRecipes() {
    perPage();
    let favObj = favApi.getLs();
    testyApiService.getRecipes().then(data => {
        let tmpContent = '';
        data.results.forEach(recipe => {
            let favClass = recipe._id in favObj ? 'favorite' : 'unfavorite';
            tmpContent += `    
            <li class="item-cards">
                <div class="shadow-on-img" data-recipe-id="${recipe._id}">
                    <img class="card-img" src="${recipe.preview}" />
                </div>
                ${recipeRating}
                <button class="add-fav-btn ${favClass}">
                    <svg class="heard-icon">
                        <use href="../img/sprite.svg#icon-heart1"></use>
                    </svg>
                </button>
                <span class="span-title" data-recipe-id="${recipe._id}">
                    ${recipe.title.toUpperCase()}
                </span>
                <span class="span-descr" data-recipe-id="${recipe._id}">
                    ${recipe.description}
                </span>
                <button class="main-see-recipe" data-recipe-id="${recipe._id}">
                    See recipe
                </button>
            </li>
            `;
        });
        content.innerHTML = tmpContent;
        content.querySelectorAll('.add-fav-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                let res = favApi.togleFav(
                    e.target.closest('button').dataset.recipeId
                );
                
                console.log(res);
                // if (res) togle class  'favorite' : 'unfavorite'
            });
        });
        content.querySelectorAll('.main-see-recipe').forEach(button => {
            let modal = require('./modal-recipe.js');
            button.addEventListener('click', (e) => {
                modal.default.open(e.target.dataset.recipeId);
            });
        });

        const container = document.querySelector('.pagination');
        pagination(data.page, data.totalPages, container, renewRecipes);
        console.log(data);
    });
}
// Пагінація*************************************************************************************
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
            /* console.log(btn.dataset.topage); */
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                testyApiService.setPage(Number(e.target.dataset.topage));
                callback();
            });
        });
    }
}
// const buttonPag = document.querySelectorAll('.main-pag-btn');
// buttonPag.addEventListener('click',)

// 22 /08 /

function addToLocalStor(e) {
    console.log(e.target.dataset.recipeId);
    // localStorage.setItem(JSON.stringify(a))
}
