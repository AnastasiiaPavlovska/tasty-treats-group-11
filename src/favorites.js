import TestyApiService from './js/testyApiService';
const testyApiService = new TestyApiService();

const categoryListFavourite = document.querySelector(
    '.category-list-favourites'
);

categoryListFavourite.addEventListener('click', function (e) {
    console.log(e.target.dataset.recipeCategory);
    testyApiService.setCategory(e.target.dataset.recipeCategory);
    renewRecipes();
});
testyApiService.getCategories().then(data => {
    data.forEach(category => {
        categoryListFavourite.innerHTML += `<li class="favourites-list-btn"><button class="category-btn" data-recipe-category="${category.name}">${category.name}</button></li>`;
    });
});
