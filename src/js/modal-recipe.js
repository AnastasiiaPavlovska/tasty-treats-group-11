(() => {
    const refs = {
        openModalBtn: document.querySelector('[data-modal-recipe-open]'),
        closeModalBtn: document.querySelector('[data-modal-recipe-close]'),
        modal: document.querySelector('[data-modal-recipe]'),
    };

    refs.openModalBtn.addEventListener('click', toggleModal);
    refs.closeModalBtn.addEventListener('click', toggleModal);

    function toggleModal() {
        refs.modal.classList.toggle('is-hidden');
    }
})();
