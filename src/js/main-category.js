import TestyApiService from './testyApiService';
const testyApiService = new TestyApiService();
// const recipeList = document.querySelector('.recipe-list');
const categoryList = document.querySelector('.category-list');
const content = document.querySelector('.content');
const inputFilter = document.querySelector('.filter-input');
inputFilter.addEventListener('change', function (e) {
    console.log(e.target.value.trim());
    testyApiService.setSearchText(e.target.value.trim());
    renewRecipes();
});


categoryList.addEventListener("click", function (e) {
    console.log(e.target.dataset.recipeCategory);
    testyApiService.setCategory(e.target.dataset.recipeCategory);
    renewRecipes();
});

//ОТРИМУЄМО СПИСОК КАТЕГОРІЙ ПРИ ЗАВАНТАЖЕНІ СТОРІНКИ
testyApiService.getCategories().then(data => {
    data.forEach(category => {
        categoryList.innerHTML += `<li><button class="category-btn" data-recipe-category="${category.name}">${category.name}</button></li>`;
    });
});

//ОТРИМУЄМО СПИСОК РЕЦЕПТІВ ПРИ ЗАВАНТАЖЕНІ СТОРІНКИ
renewRecipes();

function renewRecipes() {
    content.innerHTML = '';
    testyApiService.getRecipes().then(data => {
        data.results.forEach(recipe => {
            content.innerHTML += `<div><img class="card-img" src="${recipe.preview
                }"/></div>`

        });
        console.log(data)
    });
}

