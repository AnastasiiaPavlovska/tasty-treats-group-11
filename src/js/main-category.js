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
    categoryList.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active-button');
    });

    e.target.classList.add('active-button');
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
                <use href="/src/img/modal-recipe#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="2" width="16" height="16">
                <use href="/src/img/modal-recipe#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="3" width="16" height="16">
                <use href="/src/img/modal-recipe#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="4" width="16" height="16">
                <use href="/src/img/modal-recipe#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="5" width="16" height="16">
                <use href="/src/img/modal-recipe#icon-star"></use>
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
            let svgFill = recipe._id in favObj ? '#F8F8F8' : 'none';
            tmpContent += `    
            <li class="item-cards">
                <div class="shadow-on-img" data-recipe-id="${recipe._id}">
                    <img class="card-img" src="${recipe.preview}" />
                </div>
                ${recipeRating}
                <button class="add-fav-btn" data-recipe-id="${recipe._id}">
                    <svg class="heart-svg" width="22" height="22" viewBox="0 0 22 22" fill="${svgFill}" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234 5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912 17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629 19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219 19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961 13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434 2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                let svgFill = res ? '#F8F8F8' : 'none'
                e.target.closest('svg').style.fill = svgFill;
            });
        });
        content.querySelectorAll('.main-see-recipe').forEach(button => {
            let modal = require('./modal-recipe.js');
            button.addEventListener('click', e => {
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
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${page - 1}"><</button>`;
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
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${page + 1}">></button>`;
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
