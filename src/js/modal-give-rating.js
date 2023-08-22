// const refs = {
//     openModalBtn: document.querySelector('[data-action="open-rating-modal"]'),
//     modal: document.querySelector('[data-modal-rating]'),
//     backdrop: document.querySelector('.rating-backdrop'),
// };
// refs.openModalBtn.addEventListener('click', onOpenModal);
// refs.backdrop.addEventListener('click', onBackdropClick);

// function onOpenModal() {
//     refs.modal.classList.toggle('is-hidden');
//     const closeModalBtn = document.querySelector(
//         '[data-action="close-rating-modal"]'
//     );
//     closeModalBtn.addEventListener('click', onCloseModal);
//     window.addEventListener('keydown', onEscKeyPress);
// }

// function onCloseModal() {
//     refs.modal.classList.toggle('is-hidden');
//     window.removeEventListener('keydown', onEscKeyPress);
// }
// function onBackdropClick(event) {
//     if (event.currentTarget === event.target) {
//         onCloseModal();
//     }
// }
// function onEscKeyPress(event) {
//     if (event.code === 'Escape') {
//         onCloseModal();
//     }
// }
