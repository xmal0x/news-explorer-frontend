export class Popup {
    constructor(popupContainer){
        this.popupContainer = popupContainer;
    }

    open() {
        this.closeAllPopups();
        this.clearPopup();
        this.popupContainer.classList.remove('page-element_hidden');
    }

    close() {
        this.popupContainer.classList.add('page-element_hidden');
    }

    showResultError(message) {
        const resErrorClass = this.popupContainer.classList.contains('reg-popup') ? 
            '.popup__error-reg' : '.popup__error-login';
        const resultErrorEl = document.querySelector(resErrorClass);
        resultErrorEl.textContent = message;
    }

    clearPopup() {
        const inputClass = this.popupContainer.classList.contains('reg-popup') ? 
            '.reg-input' : '.login-input';
        document.querySelectorAll(inputClass).forEach(input => {
            input.value = '';
        });
    }

    closeAllPopups() {
        document.querySelectorAll('.popup').forEach(popup => {
            new Popup(popup).close();
        });
    }
}