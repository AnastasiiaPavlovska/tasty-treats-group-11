import axios from "axios";

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

const popularRecepies = document.querySelector('.js-popular-recepies');

async function getPopularRecipes() {
  try{
      const response = await axios.get(`${BASE_URL}/recipes/popular`);
      return response.data;
  } catch (error) {
      console.log(error);
            throw error;
  }
} 

getPopularRecipes().then(data => {
    popularRecepies.innerHTML = createMarkupPopularRecepies(data);
    console.log(data);
}).catch(err => {
    console.log(err)
})
function createMarkupPopularRecepies(arr) {
  return arr.map(({ preview, title, description, popularity, _id }) => `
      <li class="popular-recepies-item">
        <a href="" class="popular-recepies-link link">
          <div class="thomb-popular-wrap">
            <div class="thomb-popular-img">
              <img src="${preview}" alt="${title}">
            </div>
            <div class="thomb-popular-info">
              <h3 class="thomb-popular-title">${title}</h3>
              <p class="popular-recepie-descr">${description}</p>
            </div>
          </div>
          
        </a> 
      </li>
       
  `).join('');
}