const e={openModalBtn:document.querySelector('[data-action="open-modal"]'),modal:document.querySelector("[data-modal-recipe]"),backdrop:document.querySelector(".recipe-backdrop")};function t(){e.modal.classList.toggle("is-hidden"),window.removeEventListener("keydown",o)}function o(e){"Escape"===e.code&&t()}e.openModalBtn.addEventListener("click",function(){e.modal.classList.toggle("is-hidden");let n=document.querySelector('[data-action="close-modal"]');n.addEventListener("click",t),window.addEventListener("keydown",o)}),e.backdrop.addEventListener("click",function(e){e.currentTarget===e.target&&t()});
//# sourceMappingURL=index.b725ecf8.js.map