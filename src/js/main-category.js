import TestyApiService from './testyApiService';
var debounce = require('lodash.debounce');
var throttle = require('lodash.throttle');

const testyApiService = new TestyApiService();
const categoryList = document.querySelector('.category-list');
const content = document.querySelector('.cards');
const inputFilter = document.querySelector('.filter-input');
const areaFilter = document.querySelector('.area');
const ingredientsFilter = document.querySelector('.ingrediends');
const timeFilter = document.querySelector('.time');
const allCategoryBtn = document.querySelector('.all-category-btn');

for (let i = 5; i <= 120; i += 5) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
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
        categoryList.innerHTML += `<li><button class="category-btn" data-recipe-category="${category.name}">${category.name}</button></li>`;
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
    perPage();
    renewRecipes();
}, 500);

function perPage() {
    if (window.innerWidth < 768) testyApiService.setPerPage(6);
    else if (window.innerWidth >= 1280) testyApiService.setPerPage(9);
    else testyApiService.setPerPage(8);
}
perPage();

//ОТРИМУЄМО СПИСОК РЕЦЕПТІВ ПРИ ЗАВАНТАЖЕНІ СТОРІНКИ
renewRecipes();

// functions
function renewRecipes() {
    testyApiService.getRecipes().then(data => {
        let tmpContent = '';
        data.results.forEach(recipe => {
            tmpContent += `<li class="item-cards"><img class="card-img" src="${recipe.preview}"/></li>`;
        });
        content.innerHTML = tmpContent;
        console.log(data);
    });
}
