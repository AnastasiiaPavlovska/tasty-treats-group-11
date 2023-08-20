(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-rating-open]'),
    closeModalBtn: document.querySelector('[data-modal-rating-close]'),
    modal: document.querySelector('[data-modal-rating]'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);

  function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
  }
})();
