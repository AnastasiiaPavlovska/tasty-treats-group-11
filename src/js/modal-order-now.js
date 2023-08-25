const refs = {
    openModalBtn: document.querySelector('[data-action="open-order-modal"]'),
    modal: document.querySelector('[data-modal-order]'),
    backdrop: document.querySelector('.order-backdrop'),
    modalForm: document.getElementById('order-form'),
};
refs.openModalBtn.addEventListener('click', onOpenModal);
refs.backdrop.addEventListener('click', onBackdropClick);
refs.modalForm.addEventListener('submit', onSubmitForm);

function onOpenModal() {
    refs.modal.classList.toggle('is-hidden');
    const closeModalBtn = document.querySelector(
        '[data-action="close-order-modal"]'
    );
    closeModalBtn.addEventListener('click', onCloseModal);
    window.addEventListener('keydown', onEscKeyPress);
}

function onCloseModal() {
    refs.modal.classList.toggle('is-hidden');
    window.removeEventListener('keydown', onEscKeyPress);
}
function onBackdropClick(event) {
    if (event.currentTarget === event.target) {
        onCloseModal();
    }
}
function onEscKeyPress(event) {
    if (event.code === 'Escape') {
        onCloseModal();
    }
}
function onSubmitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    localStorage.setItem('orderFormData', JSON.stringify(formDataObject));
    onCloseModal();
}
