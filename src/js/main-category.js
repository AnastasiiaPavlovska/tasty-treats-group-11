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
                <use href="/src/img/modal-recipe/modal-recipe.svg#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="2" width="16" height="16">
                <use href="/src/img/modal-recipe/modal-recipe.svg#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="3" width="16" height="16">
                <use href="/src/img/modal-recipe/modal-recipe.svg#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="4" width="16" height="16">
                <use href="/src/img/modal-recipe/modal-recipe.svg#icon-star"></use>
            </svg>
        </li>
        <li>
            <svg class="star" data-rating="5" width="16" height="16">
                <use href="/src/img/modal-recipe/modal-recipe.svg#icon-star"></use>
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
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                
                console.log(res);
                // if (res) togle class  'favorite' : 'unfavorite'
            });
        });
        content.querySelectorAll('.main-see-recipe').forEach(button => {
            button.addEventListener('click', addToLocalStor);
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
            container.innerHTML += `<button class="main-pag-btn" disabled>
            
            <svg class="pag-btn-dark" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>

<svg class="pag-btn-dark" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>
            </button>`;
            container.innerHTML += `<button class="main-pag-btn" disabled>
        
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>
            </button>`;
        } else {
            // active prev b
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="1">
            <svg class="icon-pag-btn transform-dark-pag" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg>

<svg class="icon-pag-btn transform-dark-pag" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg></button>`;
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${
                page - 1
                }">
            <svg class="icon-pag-btn transform-dark-pag" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg>
                </button>`;
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
            container.innerHTML += `<button class="main-pag-btn" disabled>
            <svg class="pag-btn-dark pag-transform-dark" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>
            </button>`;
            container.innerHTML += `<button class="main-pag-btn" disabled>
            <svg class="pag-btn-dark pag-transform-dark" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>
<svg class="pag-btn-dark pag-transform-dark" xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
<path d="M9.33387 10.5917C9.25576 10.5142 9.19377 10.4221 9.15146 10.3205C9.10915 10.219 9.08737 10.11 9.08737 10C9.08737 9.89001 9.10915 9.78109 9.15146 9.67954C9.19377 9.57799 9.25576 9.48582 9.33387 9.40835L13.1589 5.59168C13.237 5.51421 13.299 5.42204 13.3413 5.32049C13.3836 5.21894 13.4054 5.11002 13.4054 5.00001C13.4054 4.89 13.3836 4.78108 13.3413 4.67953C13.299 4.57798 13.237 4.48581 13.1589 4.40834C13.0027 4.25313 12.7915 4.16602 12.5714 4.16602C12.3512 4.16602 12.14 4.25313 11.9839 4.40834L8.15887 8.23335C7.6907 8.7021 7.42773 9.33752 7.42773 10C7.42773 10.6625 7.6907 11.2979 8.15887 11.7667L11.9839 15.5917C12.1391 15.7457 12.3486 15.8324 12.5672 15.8334C12.6769 15.834 12.7856 15.813 12.8871 15.7715C12.9887 15.73 13.081 15.6689 13.1589 15.5917C13.237 15.5142 13.299 15.4221 13.3413 15.3205C13.3836 15.219 13.4054 15.11 13.4054 15C13.4054 14.89 13.3836 14.7811 13.3413 14.6795C13.299 14.578 13.237 14.4858 13.1589 14.4084L9.33387 10.5917Z" fill="#F8F8F8" fill-opacity="0.5"/>
</svg>
            </button>`;
        } else {
            // active forward b
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${
                page + 1
                }">
                 <svg class="icon-pag-btn" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg>
            </button>`;
            container.innerHTML += `<button class="main-pag-btn main-pag-btn-green" data-topage="${total}">
            <svg class="icon-pag-btn" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg>
<svg class="icon-pag-btn" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="white">
<path d="M11.6661 10.5917C11.7442 10.5142 11.8062 10.422 11.8485 10.3205C11.8908 10.2189 11.9126 10.11 11.9126 10C11.9126 9.89001 11.8908 9.78108 11.8485 9.67953C11.8062 9.57799 11.7442 9.48582 11.6661 9.40835L7.84113 5.59168C7.76302 5.51421 7.70103 5.42204 7.65872 5.32049C7.61641 5.21894 7.59463 5.11002 7.59463 5.00001C7.59463 4.89 7.61641 4.78108 7.65872 4.67953C7.70103 4.57798 7.76302 4.48581 7.84113 4.40834C7.99727 4.25313 8.20848 4.16602 8.42863 4.16602C8.64879 4.16602 8.86 4.25313 9.01613 4.40834L12.8411 8.23335C13.3093 8.7021 13.5723 9.33751 13.5723 10C13.5723 10.6625 13.3093 11.2979 12.8411 11.7667L9.01613 15.5917C8.86091 15.7456 8.65142 15.8324 8.4328 15.8334C8.32313 15.834 8.21441 15.813 8.11288 15.7715C8.01134 15.73 7.919 15.6689 7.84113 15.5917C7.76302 15.5142 7.70103 15.4221 7.65872 15.3205C7.61641 15.219 7.59463 15.11 7.59463 15C7.59463 14.89 7.61641 14.7811 7.65872 14.6795C7.70103 14.578 7.76302 14.4858 7.84113 14.4084L11.6661 10.5917Z" fill="#050505"/>
</svg>
</button>`;
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
