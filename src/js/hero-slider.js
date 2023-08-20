import axios from 'axios';

import Notiflix from 'notiflix';

import { Report } from 'notiflix/build/notiflix-report-aio';
const tastyTreats = axios.create({
  baseURL: 'https://tasty-treats-backend.p.goit.global/api',
});
const images = document.querySelector('.images');

async function getAllEvents() {
  const response = await tastyTreats.get('/events');
  return response;
}

getAllEvents()
  .then(({ data }) => {
    console.log(data);
    const markup = createMarkup(data);
    images.insertAdjacentHTML('beforeend', markup);
    const swiper = new Swiper('.swiper', {
      loop: true,
      autoplay: {
        delay: 2400,
        disableOnInteraction: false,
      },
      mousewheel: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  })
  .catch(onError);

function onError() {
  Notiflix.Report.warning('ERROR', 'Oops, something went wrong', 'CLOSE', {
    width: '360px',
    svgSize: '120px',
  });
}

function createMarkup(events) {
  return events
    .map(({ cook, topic: { name, area, imgUrl, previewUrl } }) => {
      const markup = `
<div class="swiper-container swiper-slide">
  <div class="image cook">
   <img  src="${cook.imgUrl}" alt="${cook.name}">
   </div>
  <div class="image dish">
   <img src="${previewUrl}" alt="${name}">
   <div class="dish-descr">
   <h3 class="dish-name">${name}</h3>
   <p class="dish-area">${area}</p> 
   </div>
    </div>
   <div class="image dish-zoom">
   <img  src="${imgUrl}" alt="${name}" >
    </div>
</div>
  `;
      return markup;
    })
    .join('');
}
