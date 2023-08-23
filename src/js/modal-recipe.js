import axios from 'axios';
import TestyApiService from './testyApiService';

const testyApiService = new TestyApiService();
const cardsContainer = document.querySelector('.cards');

cardsContainer.addEventListener('click', processRecipeOpening);

async function processRecipeOpening(event) {
    // Retrieve the recipe ID from the "data-recipe-id" attribute
    const recipeId = event.target.getAttribute('data-recipe-id');
    if (recipeId !== null) {
        try {
            const recipe = await testyApiService.getRecipeById(recipeId);
            // console.log('Recipe Info:', recipe);
            populateModalWithRecipe(recipe);
            // Display the modal
            showModalRecipe();
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    } else {
        console.error("Can't get 'data-recipe-id' from: " + event.target);
    }
}

const modalBackdrop = document.querySelector('[data-modal-recipe]');
const modalRecipe = document.querySelector('.modal-recipe');
let player;

function populateModalWithRecipe(recipe) {
    const recipeImage = modalRecipe.querySelector('.recipe-image');
    const recipeName = modalRecipe.querySelector('.selected-recipe-name');
    const tags = modalRecipe.querySelector('.tags');
    const ratingNumber = modalRecipe.querySelector('.rating-number-recipe');
    const cookingTime = modalRecipe.querySelector('.cooking-time');
    const ingredientsList = modalRecipe.querySelector('.ingredients');
    const recipeInstruction = modalRecipe.querySelector('.recipe-instruction');
    //--------------------
    recipeImage.src = recipe.preview;
    recipeName.textContent = recipe.title;
    //-----------------------------------
    recipeName.textContent = recipe.title;
    // Populate tags (assuming recipe has tags property)
    // Select the appropriate tags element based on screen width
    const tags1 = document.querySelector('.tags-1');
    const tags2 = document.querySelector('.tags-2');
    const screenWidth = window.innerWidth;

    if (recipe.tags && recipe.tags.length > 0 && recipe.tags[0] !== '') {
        tags1.innerHTML = recipe.tags
            .map(
                tag =>
                    `<li class="tag-item"><button class="btn-tag" type="button">#${tag}</button></li>`
            )
            .join('');
        tags2.innerHTML = recipe.tags
            .map(
                tag =>
                    `<li class="tag-item"><button class="btn-tag" type="button">#${tag}</button></li>`
            )
            .join('');

        if (screenWidth < 768) {
            tags2.style.display = 'flex';
            tags1.style.display = 'none';
        } else {
            tags2.style.display = 'none';
            tags1.style.display = 'flex';
        }
    } else {
        tags1.style.display = 'none';
        tags2.style.display = 'none';
    }

    //------------------------------------------------------------

    if (recipe.rating) {
        ratingNumber.textContent = recipe.rating.toFixed(1);
    }
    if (recipe.time) {
        cookingTime.textContent = `${recipe.time} min`;
    }
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList.innerHTML = recipe.ingredients
            .map(
                ingredient => `
<li class="ingredient-item">
${ingredient.name}<span class="ingredient-amount">${ingredient.measure}</span>
</li>
`
            )
            .join('');
    }

    if (recipe.instructions) {
        recipeInstruction.textContent = recipe.instructions;
    }

    if (recipe.rating) {
        ratingNumber.textContent = recipe.rating.toFixed(1);

        const starsContainer = modalRecipe.querySelector('.stars');
        const filledStars = Math.round(recipe.rating);
        for (let i = 1; i <= 5; i++) {
            const starSvg = starsContainer.querySelector(
                `[data-rating="${i}"]`
            );
            if (i <= filledStars) {
                starSvg.classList.add('star-filled');
            } else {
                starSvg.classList.remove('star-filled');
            }
        }
    }
}

function showModalRecipe() {
    modalBackdrop.classList.remove('is-hidden');
    window.addEventListener('keydown', event => {
        if (event.code === 'Escape') {
            hideModalRecipe();
        }
    });
}

function hideModalRecipe() {
    modalBackdrop.classList.add('is-hidden');
    window.removeEventListener('keydown', event => {
        if (event.code === 'Escape') {
            hideModalRecipe();
        }
    });
}

modalRecipe
    .querySelector('[data-modal-recipe-close]')
    .addEventListener('click', hideModalRecipe);

modalBackdrop.addEventListener('click', event => {
    if (event.target === modalBackdrop) {
        hideModalRecipe();
    }
});
