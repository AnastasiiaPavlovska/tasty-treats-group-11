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

for (let i = 0; i <= 120; i += 5) {
    const opt = document.createElement('option');
    opt.value = i ? i : '';
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
    const opt = document.createElement('option');
    opt.value = '';
    opt.innerHTML = 'Region';
    opt.dataset.param = '';
    areaFilter.appendChild(opt);
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
    const opt = document.createElement('option');
    opt.value = '';
    opt.innerHTML = 'Product';
    ingredientsFilter.appendChild(opt);
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

const inactiveHeartSvg = `
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
        d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234
        5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912
        17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629
        19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219
        19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961
        13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434
        2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const activeHeartSvg = `
<svg width="22" height="22" viewBox="0 0 22 22" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path opacity="1" fill-rule="evenodd" clip-rule="evenodd"
        d="M10.9939 4.70783C9.16115 2.5652 6.10493 1.98884 3.80863 3.95085C1.51234
        5.91285 1.18905 9.19323 2.99234 11.5137C4.49166 13.443 9.02912
        17.5121 10.5163 18.8291C10.6826 18.9764 10.7658 19.0501 10.8629
        19.0791C10.9475 19.1043 11.0402 19.1043 11.1249 19.0791C11.2219
        19.0501 11.3051 18.9764 11.4715 18.8291C12.9586 17.5121 17.4961
        13.443 18.9954 11.5137C20.7987 9.19323 20.5149 5.89221 18.1791 3.95085C15.8434
        2.00948 12.8266 2.5652 10.9939 4.70783Z" stroke="#F8F8F8" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// functions
function createRatingStars(rating) {
    const starPath = `
        <path d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
    `;

    const ratingDiv = document.createElement('div');
    const dispRating = (Math.round(rating * 10) / 10).toFixed(1);
    ratingDiv.className = 'rating-recipe';
    ratingDiv.innerHTML = `<span class="rating-number-recipe">${dispRating}</span>`;

    const ul = document.createElement('ul');
    ul.className = 'stars';
    for (let i = 1; i <= 5; i++) {
        const li = document.createElement('li');
        if (i <= rating) {
            li.innerHTML = `
                <svg class="star star-filled" viewBox="0 0 34 32" data-rating="${i}" width="16" height="16">
                    ${starPath}
                </svg>            
            `;
        } else {
            li.innerHTML = `
                <svg class="star" viewBox="0 0 34 32" data-rating="${i}" width="16" height="16">
                    ${starPath}
                </svg>            
            `;
        }
        ul.appendChild(li);
    }

    ratingDiv.appendChild(ul);

    return ratingDiv;
}

function renewRecipes() {
    perPage();
    let favObj = favApi.getLs();
    testyApiService.getRecipes().then(data => {
        content.innerHTML = '';
        data.results.forEach(recipe => {
            let svgHeart = recipe._id in favObj ? activeHeartSvg : inactiveHeartSvg;
            const li = document.createElement('li');
            li.className = 'item-cards';
            li.innerHTML = `    
                <div class="shadow-on-img" data-recipe-id="${recipe._id}">
                    <img class="card-img" src="${recipe.preview}" />
                </div>
                <button class="add-fav-btn" data-recipe-id="${recipe._id}">
                    ${svgHeart}
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
            `;

            li.appendChild(createRatingStars(recipe.rating));

            content.appendChild(li);
        });
        content.querySelectorAll('.add-fav-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                let btn = e.target.closest('button');
                let res = favApi.togleFav(btn.getAttribute('data-recipe-id'));

                console.log('Result: ' + res);

                if (res) {
                    btn.innerHTML = activeHeartSvg;
                } else {
                    btn.innerHTML = inactiveHeartSvg;
                }
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
            container.innerHTML += `
                <button class="main-pag-btn" disabled>
                    <svg width="32" height="32" viewBox="1 -5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5999 12.7101C10.5061 12.6171 10.4317 12.5065 10.381 12.3847C10.3302 12.2628 10.3041 12.1321 10.3041 12.0001C10.3041 11.8681 10.3302 11.7374 10.381 11.6155C10.4317 11.4936 10.5061 11.383 10.5999 11.2901L15.1899 6.71006C15.2836 6.6171 15.358 6.5065 15.4088 6.38464C15.4595 6.26278 15.4857 6.13207 15.4857 6.00006C15.4857 5.86805 15.4595 5.73734 15.4088 5.61548C15.358 5.49362 15.2836 5.38302 15.1899 5.29006C15.0025 5.10381 14.749 4.99927 14.4849 4.99927C14.2207 4.99927 13.9672 5.10381 13.7799 5.29006L9.18986 9.88007C8.62806 10.4426 8.3125 11.2051 8.3125 12.0001C8.3125 12.7951 8.62806 13.5576 9.18986 14.1201L13.7799 18.7101C13.9661 18.8948 14.2175 18.999 14.4799 19.0001C14.6115 19.0008 14.7419 18.9756 14.8638 18.9259C14.9856 18.8761 15.0964 18.8028 15.1899 18.7101C15.2836 18.6171 15.358 18.5065 15.4088 18.3847C15.4595 18.2628 15.4857 18.1321 15.4857 18.0001C15.4857 17.8681 15.4595 17.7374 15.4088 17.6155C15.358 17.4936 15.2836 17.383 15.1899 17.2901L10.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
                        <path d="M17.5999 12.7101C17.5061 12.6171 17.4317 12.5065 17.381 12.3847C17.3302 12.2628 17.3041 12.1321 17.3041 12.0001C17.3041 11.8681 17.3302 11.7374 17.381 11.6155C17.4317 11.4936 17.5061 11.383 17.5999 11.2901L22.1899 6.71006C22.2836 6.6171 22.358 6.5065 22.4088 6.38464C22.4595 6.26278 22.4857 6.13207 22.4857 6.00006C22.4857 5.86805 22.4595 5.73734 22.4088 5.61548C22.358 5.49362 22.2836 5.38302 22.1899 5.29006C22.0025 5.10381 21.749 4.99927 21.4849 4.99927C21.2207 4.99927 20.9672 5.10381 20.7799 5.29006L16.1899 9.88007C15.6281 10.4426 15.3125 11.2051 15.3125 12.0001C15.3125 12.7951 15.6281 13.5576 16.1899 14.1201L20.7799 18.7101C20.9661 18.8948 21.2175 18.999 21.4799 19.0001C21.6115 19.0008 21.7419 18.9756 21.8638 18.9259C21.9856 18.8761 22.0964 18.8028 22.1899 18.7101C22.2836 18.6171 22.358 18.5065 22.4088 18.3847C22.4595 18.2628 22.4857 18.1321 22.4857 18.0001C22.4857 17.8681 22.4595 17.7374 22.4088 17.6155C22.358 17.4936 22.2836 17.383 22.1899 17.2901L17.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
                    </svg>
                </button>
                `;
            container.innerHTML += `
            <button class="main-pag-btn" disabled>
                <svg width="32" height="32" viewBox="-2 -5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5999 12.7101C10.5061 12.6171 10.4317 12.5065 10.381 12.3847C10.3302 12.2628 10.3041 12.1321 10.3041 12.0001C10.3041 11.8681 10.3302 11.7374 10.381 11.6155C10.4317 11.4936 10.5061 11.383 10.5999 11.2901L15.1899 6.71006C15.2836 6.6171 15.358 6.5065 15.4088 6.38464C15.4595 6.26278 15.4857 6.13207 15.4857 6.00006C15.4857 5.86805 15.4595 5.73734 15.4088 5.61548C15.358 5.49362 15.2836 5.38302 15.1899 5.29006C15.0025 5.10381 14.749 4.99927 14.4849 4.99927C14.2207 4.99927 13.9672 5.10381 13.7799 5.29006L9.18986 9.88007C8.62806 10.4426 8.3125 11.2051 8.3125 12.0001C8.3125 12.7951 8.62806 13.5576 9.18986 14.1201L13.7799 18.7101C13.9661 18.8948 14.2175 18.999 14.4799 19.0001C14.6115 19.0008 14.7419 18.9756 14.8638 18.9259C14.9856 18.8761 15.0964 18.8028 15.1899 18.7101C15.2836 18.6171 15.358 18.5065 15.4088 18.3847C15.4595 18.2628 15.4857 18.1321 15.4857 18.0001C15.4857 17.8681 15.4595 17.7374 15.4088 17.6155C15.358 17.4936 15.2836 17.383 15.1899 17.2901L10.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
                </svg>
            </button>`;
        } else {
            // active prev b
            container.innerHTML += `
            <button class="main-pag-btn main-pag-btn-green" data-topage="1">
                <svg width="32" height="32" viewBox="1 -5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5999 12.7101C10.5061 12.6171 10.4317 12.5065 10.381 12.3847C10.3302 12.2628 10.3041 12.1321 10.3041 12.0001C10.3041 11.8681 10.3302 11.7374 10.381 11.6155C10.4317 11.4936 10.5061 11.383 10.5999 11.2901L15.1899 6.71006C15.2836 6.6171 15.358 6.5065 15.4088 6.38464C15.4595 6.26278 15.4857 6.13207 15.4857 6.00006C15.4857 5.86805 15.4595 5.73734 15.4088 5.61548C15.358 5.49362 15.2836 5.38302 15.1899 5.29006C15.0025 5.10381 14.749 4.99927 14.4849 4.99927C14.2207 4.99927 13.9672 5.10381 13.7799 5.29006L9.18986 9.88007C8.62806 10.4426 8.3125 11.2051 8.3125 12.0001C8.3125 12.7951 8.62806 13.5576 9.18986 14.1201L13.7799 18.7101C13.9661 18.8948 14.2175 18.999 14.4799 19.0001C14.6115 19.0008 14.7419 18.9756 14.8638 18.9259C14.9856 18.8761 15.0964 18.8028 15.1899 18.7101C15.2836 18.6171 15.358 18.5065 15.4088 18.3847C15.4595 18.2628 15.4857 18.1321 15.4857 18.0001C15.4857 17.8681 15.4595 17.7374 15.4088 17.6155C15.358 17.4936 15.2836 17.383 15.1899 17.2901L10.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
                    <path d="M17.5999 12.7101C17.5061 12.6171 17.4317 12.5065 17.381 12.3847C17.3302 12.2628 17.3041 12.1321 17.3041 12.0001C17.3041 11.8681 17.3302 11.7374 17.381 11.6155C17.4317 11.4936 17.5061 11.383 17.5999 11.2901L22.1899 6.71006C22.2836 6.6171 22.358 6.5065 22.4088 6.38464C22.4595 6.26278 22.4857 6.13207 22.4857 6.00006C22.4857 5.86805 22.4595 5.73734 22.4088 5.61548C22.358 5.49362 22.2836 5.38302 22.1899 5.29006C22.0025 5.10381 21.749 4.99927 21.4849 4.99927C21.2207 4.99927 20.9672 5.10381 20.7799 5.29006L16.1899 9.88007C15.6281 10.4426 15.3125 11.2051 15.3125 12.0001C15.3125 12.7951 15.6281 13.5576 16.1899 14.1201L20.7799 18.7101C20.9661 18.8948 21.2175 18.999 21.4799 19.0001C21.6115 19.0008 21.7419 18.9756 21.8638 18.9259C21.9856 18.8761 22.0964 18.8028 22.1899 18.7101C22.2836 18.6171 22.358 18.5065 22.4088 18.3847C22.4595 18.2628 22.4857 18.1321 22.4857 18.0001C22.4857 17.8681 22.4595 17.7374 22.4088 17.6155C22.358 17.4936 22.2836 17.383 22.1899 17.2901L17.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
                </svg>
            </button>`;
            container.innerHTML += `
            <button class="main-pag-btn main-pag-btn-green"
                    data-topage="${page - 1}">
                <svg width="32" height="32" viewBox="-2 -5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5999 12.7101C10.5061 12.6171 10.4317 12.5065 10.381 12.3847C10.3302 12.2628 10.3041 12.1321 10.3041 12.0001C10.3041 11.8681 10.3302 11.7374 10.381 11.6155C10.4317 11.4936 10.5061 11.383 10.5999 11.2901L15.1899 6.71006C15.2836 6.6171 15.358 6.5065 15.4088 6.38464C15.4595 6.26278 15.4857 6.13207 15.4857 6.00006C15.4857 5.86805 15.4595 5.73734 15.4088 5.61548C15.358 5.49362 15.2836 5.38302 15.1899 5.29006C15.0025 5.10381 14.749 4.99927 14.4849 4.99927C14.2207 4.99927 13.9672 5.10381 13.7799 5.29006L9.18986 9.88007C8.62806 10.4426 8.3125 11.2051 8.3125 12.0001C8.3125 12.7951 8.62806 13.5576 9.18986 14.1201L13.7799 18.7101C13.9661 18.8948 14.2175 18.999 14.4799 19.0001C14.6115 19.0008 14.7419 18.9756 14.8638 18.9259C14.9856 18.8761 15.0964 18.8028 15.1899 18.7101C15.2836 18.6171 15.358 18.5065 15.4088 18.3847C15.4595 18.2628 15.4857 18.1321 15.4857 18.0001C15.4857 17.8681 15.4595 17.7374 15.4088 17.6155C15.358 17.4936 15.2836 17.383 15.1899 17.2901L10.5999 12.7101Z" fill="#F8F8F8" fill-opacity="0.5"/>
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
            container.innerHTML += `
            <button class="main-pag-btn" disabled>
                <svg width="31" height="24" viewBox="-5 -1 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4001 12.7103C13.4939 12.6173 13.5683 12.5067 13.619 12.3848C13.6698 12.263 13.6959 12.1323 13.6959 12.0003C13.6959 11.8682 13.6698 11.7375 13.619 11.6157C13.5683 11.4938 13.4939 11.3832 13.4001 11.2903L8.81014 6.71025C8.71641 6.61728 8.64202 6.50668 8.59125 6.38482C8.54048 6.26296 8.51434 6.13226 8.51434 6.00024C8.51434 5.86823 8.54048 5.73753 8.59125 5.61567C8.64202 5.49381 8.71641 5.38321 8.81014 5.29024C8.9975 5.10399 9.25095 4.99945 9.51514 4.99945C9.77933 4.99945 10.0328 5.10399 10.2201 5.29024L14.8101 9.88025C15.3719 10.4428 15.6875 11.2053 15.6875 12.0003C15.6875 12.7953 15.3719 13.5578 14.8101 14.1203L10.2201 18.7103C10.0339 18.895 9.78248 18.9992 9.52014 19.0003C9.38853 19.001 9.25807 18.9758 9.13623 18.926C9.0144 18.8763 8.90358 18.8029 8.81014 18.7103C8.71641 18.6173 8.64202 18.5067 8.59125 18.3848C8.54048 18.263 8.51434 18.1323 8.51434 18.0003C8.51434 17.8683 8.54048 17.7375 8.59125 17.6157C8.64202 17.4938 8.71641 17.3832 8.81014 17.2903L13.4001 12.7103Z" fill="#050505"/>
                </svg>
            </button>`;
            container.innerHTML += `
            <button class="main-pag-btn" disabled>
                <svg width="31" height="24" viewBox="-1 -2 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.4001 12.7103C20.4939 12.6173 20.5683 12.5067 20.619 12.3848C20.6698 12.263 20.6959 12.1323 20.6959 12.0003C20.6959 11.8682 20.6698 11.7375 20.619 11.6157C20.5683 11.4938 20.4939 11.3832 20.4001 11.2903L15.8101 6.71025C15.7164 6.61728 15.642 6.50668 15.5912 6.38482C15.5405 6.26296 15.5143 6.13226 15.5143 6.00024C15.5143 5.86823 15.5405 5.73753 15.5912 5.61567C15.642 5.49381 15.7164 5.38321 15.8101 5.29024C15.9975 5.10399 16.251 4.99945 16.5151 4.99945C16.7793 4.99945 17.0328 5.10399 17.2201 5.29024L21.8101 9.88025C22.3719 10.4428 22.6875 11.2053 22.6875 12.0003C22.6875 12.7953 22.3719 13.5578 21.8101 14.1203L17.2201 18.7103C17.0339 18.895 16.7825 18.9992 16.5201 19.0003C16.3885 19.001 16.2581 18.9758 16.1362 18.926C16.0144 18.8763 15.9036 18.8029 15.8101 18.7103C15.7164 18.6173 15.642 18.5067 15.5912 18.3848C15.5405 18.263 15.5143 18.1323 15.5143 18.0003C15.5143 17.8683 15.5405 17.7375 15.5912 17.6157C15.642 17.4938 15.7164 17.3832 15.8101 17.2903L20.4001 12.7103Z" fill="#050505"/>
                    <path d="M13.4001 12.7103C13.4939 12.6173 13.5683 12.5067 13.619 12.3848C13.6698 12.263 13.6959 12.1323 13.6959 12.0003C13.6959 11.8682 13.6698 11.7375 13.619 11.6157C13.5683 11.4938 13.4939 11.3832 13.4001 11.2903L8.81014 6.71025C8.71641 6.61728 8.64202 6.50668 8.59125 6.38482C8.54048 6.26296 8.51434 6.13226 8.51434 6.00024C8.51434 5.86823 8.54048 5.73753 8.59125 5.61567C8.64202 5.49381 8.71641 5.38321 8.81014 5.29024C8.9975 5.10399 9.25095 4.99945 9.51514 4.99945C9.77933 4.99945 10.0328 5.10399 10.2201 5.29024L14.8101 9.88025C15.3719 10.4428 15.6875 11.2053 15.6875 12.0003C15.6875 12.7953 15.3719 13.5578 14.8101 14.1203L10.2201 18.7103C10.0339 18.895 9.78248 18.9992 9.52014 19.0003C9.38853 19.001 9.25807 18.9758 9.13623 18.926C9.0144 18.8763 8.90358 18.8029 8.81014 18.7103C8.71641 18.6173 8.64202 18.5067 8.59125 18.3848C8.54048 18.263 8.51434 18.1323 8.51434 18.0003C8.51434 17.8683 8.54048 17.7375 8.59125 17.6157C8.64202 17.4938 8.71641 17.3832 8.81014 17.2903L13.4001 12.7103Z" fill="#050505"/>
                </svg>
            </button>`;
        } else {
            // active forward b
            container.innerHTML += `
            <button class="main-pag-btn main-pag-btn-green" data-topage="${
                page + 1
            }">
                <svg width="31" height="24" viewBox="-5 -2 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4001 12.7103C13.4939 12.6173 13.5683 12.5067 13.619 12.3848C13.6698 12.263 13.6959 12.1323 13.6959 12.0003C13.6959 11.8682 13.6698 11.7375 13.619 11.6157C13.5683 11.4938 13.4939 11.3832 13.4001 11.2903L8.81014 6.71025C8.71641 6.61728 8.64202 6.50668 8.59125 6.38482C8.54048 6.26296 8.51434 6.13226 8.51434 6.00024C8.51434 5.86823 8.54048 5.73753 8.59125 5.61567C8.64202 5.49381 8.71641 5.38321 8.81014 5.29024C8.9975 5.10399 9.25095 4.99945 9.51514 4.99945C9.77933 4.99945 10.0328 5.10399 10.2201 5.29024L14.8101 9.88025C15.3719 10.4428 15.6875 11.2053 15.6875 12.0003C15.6875 12.7953 15.3719 13.5578 14.8101 14.1203L10.2201 18.7103C10.0339 18.895 9.78248 18.9992 9.52014 19.0003C9.38853 19.001 9.25807 18.9758 9.13623 18.926C9.0144 18.8763 8.90358 18.8029 8.81014 18.7103C8.71641 18.6173 8.64202 18.5067 8.59125 18.3848C8.54048 18.263 8.51434 18.1323 8.51434 18.0003C8.51434 17.8683 8.54048 17.7375 8.59125 17.6157C8.64202 17.4938 8.71641 17.3832 8.81014 17.2903L13.4001 12.7103Z" fill="#050505"/>
                </svg>
            </button>`;
            container.innerHTML += `
            <button class="main-pag-btn main-pag-btn-green" data-topage="${total}">
                <svg width="31" height="24" viewBox="-1 -2 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.4001 12.7103C20.4939 12.6173 20.5683 12.5067 20.619 12.3848C20.6698 12.263 20.6959 12.1323 20.6959 12.0003C20.6959 11.8682 20.6698 11.7375 20.619 11.6157C20.5683 11.4938 20.4939 11.3832 20.4001 11.2903L15.8101 6.71025C15.7164 6.61728 15.642 6.50668 15.5912 6.38482C15.5405 6.26296 15.5143 6.13226 15.5143 6.00024C15.5143 5.86823 15.5405 5.73753 15.5912 5.61567C15.642 5.49381 15.7164 5.38321 15.8101 5.29024C15.9975 5.10399 16.251 4.99945 16.5151 4.99945C16.7793 4.99945 17.0328 5.10399 17.2201 5.29024L21.8101 9.88025C22.3719 10.4428 22.6875 11.2053 22.6875 12.0003C22.6875 12.7953 22.3719 13.5578 21.8101 14.1203L17.2201 18.7103C17.0339 18.895 16.7825 18.9992 16.5201 19.0003C16.3885 19.001 16.2581 18.9758 16.1362 18.926C16.0144 18.8763 15.9036 18.8029 15.8101 18.7103C15.7164 18.6173 15.642 18.5067 15.5912 18.3848C15.5405 18.263 15.5143 18.1323 15.5143 18.0003C15.5143 17.8683 15.5405 17.7375 15.5912 17.6157C15.642 17.4938 15.7164 17.3832 15.8101 17.2903L20.4001 12.7103Z" fill="#050505"/>
                    <path d="M13.4001 12.7103C13.4939 12.6173 13.5683 12.5067 13.619 12.3848C13.6698 12.263 13.6959 12.1323 13.6959 12.0003C13.6959 11.8682 13.6698 11.7375 13.619 11.6157C13.5683 11.4938 13.4939 11.3832 13.4001 11.2903L8.81014 6.71025C8.71641 6.61728 8.64202 6.50668 8.59125 6.38482C8.54048 6.26296 8.51434 6.13226 8.51434 6.00024C8.51434 5.86823 8.54048 5.73753 8.59125 5.61567C8.64202 5.49381 8.71641 5.38321 8.81014 5.29024C8.9975 5.10399 9.25095 4.99945 9.51514 4.99945C9.77933 4.99945 10.0328 5.10399 10.2201 5.29024L14.8101 9.88025C15.3719 10.4428 15.6875 11.2053 15.6875 12.0003C15.6875 12.7953 15.3719 13.5578 14.8101 14.1203L10.2201 18.7103C10.0339 18.895 9.78248 18.9992 9.52014 19.0003C9.38853 19.001 9.25807 18.9758 9.13623 18.926C9.0144 18.8763 8.90358 18.8029 8.81014 18.7103C8.71641 18.6173 8.64202 18.5067 8.59125 18.3848C8.54048 18.263 8.51434 18.1323 8.51434 18.0003C8.51434 17.8683 8.54048 17.7375 8.59125 17.6157C8.64202 17.4938 8.71641 17.3832 8.81014 17.2903L13.4001 12.7103Z" fill="#050505"/>
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
    } else {
        container.innerHTML = '';
    }
}
