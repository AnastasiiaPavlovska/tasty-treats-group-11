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
        .map(({ cook, topic: { name, area, previewWebpUrl } }) => {
            const markup = `
<div class="swiper-container swiper-slide">
  <div class="image cook">
   <img  src="${cook.imgWebpUrl}">
   </div>
  <div class="image dish">
   <img src="${previewWebpUrl}">
   <div class="dish-descr">
   <h3 class="dish-name">${name}</h3>
   <p class="dish-area">${area}</p> 
   </div>
    </div>
   <div class="image dish-zoom">
   <img  src="${previewWebpUrl}">
    </div>
</div>
  `;
            return markup;
        })
        .join('');
}

// import axios from 'axios';

// import Notiflix from 'notiflix';

// import { Report } from 'notiflix/build/notiflix-report-aio';
// const tastyTreats = axios.create({
//     baseURL: 'https://tasty-treats-backend.p.goit.global/api',
// });
// const images = document.querySelector('.images');

// async function getAllEvents() {
//     const response = await tastyTreats.get('/events');
//     return response;
// }

// getAllEvents()
//     .then(({ data }) => {
//         console.log(data);
//         const markup = createMarkup(data);
//         images.insertAdjacentHTML('beforeend', markup);
//         const swiper = new Swiper('.swiper', {
//             loop: true,
//             autoplay: {
//                 delay: 2400,
//                 disableOnInteraction: false,
//             },
//             mousewheel: true,
//             pagination: {
//                 el: '.swiper-pagination',
//                 clickable: true,
//             },
//         });
//     })
//     .catch(onError);

// function onError() {
//     Notiflix.Report.warning('ERROR', 'Oops, something went wrong', 'CLOSE', {
//         width: '360px',
//         svgSize: '120px',
//     });
// }

// function createMarkup(events) {
//     return events
//         .map(
//             ({
//                 cook,
//                 topic: {
//                     name,
//                     area,
//                     imgUrl,
//                     imgWebPUrl,
//                     previewWebpUrl,
//                     previewUrl,
//                 },
//             }) => {
//                 const markup = `
// <div class="swiper-container swiper-slide">
//     <div class="image cook">
//         <picture>
//             <source srcset="${cook.imgWebpUrl}" type="image/webp">
//             <img  src="${cook.imgUrl}" alt="${cook.name}">
//         </picture>
//     </div>
//     <div class="image dish">
//         <picture>
//             <source srcset="${previewWebpUrl}" type="image/webp">
//             <img src="${previewUrl}" alt="${name}">
//         </picture>
//     </div>
//     <div class="dish-descr">
//         <h3 class="dish-name">${name}</h3>
//         <p class="dish-area">${area}</p>
//     </div>
//     <div class="image dish-zoom">
//         <picture>
//             <source srcset="${imgWebpUrl}" type="image/webp">
//             <img src="${imgUrl}" alt="${name}">
//         </picture>
//     </div>
// </div>
//   `;
//                 return markup;
//             }
//         )
//         .join('');
// }
