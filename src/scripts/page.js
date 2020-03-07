export class Page {


    switchToAuthHeader() {
        document.querySelector('.header__non-authorized').classList.add('page-element_hidden');
        document.querySelector('.header__authorized').classList.remove('page-element_hidden');
    }

    showElementByClassName(className) {
        document.querySelector(`.${className}`).classList.remove('page-element_hidden');
    }

    hideElementByClassName(className) {
        document.querySelector(`.${className}`).classList.add('page-element_hidden');
    }
}