export class Page {


    switchToAuthHeader(name) {

        document.querySelector('.header__non-authorized').classList.add('page-element_hidden');
        document.querySelector('.header__authorized').classList.remove('page-element_hidden');
        document.querySelector('.header__item_auth').textContent = name;
    }

    showElementByClassName(className) {
        document.querySelector(`.${className}`).classList.remove('page-element_hidden');
    }

    hideElementByClassName(className) {
        document.querySelector(`.${className}`).classList.add('page-element_hidden');
    }

    showAuthError() {
        this.querySelector('.card__favorite_message').classList.remove('page-element_hidden');
    }

    hideAuthError() {
        this.querySelector('.card__favorite_message').classList.add('page-element_hidden');
    }

    exitMainPage() {
        localStorage.removeItem('token');
        const mainPageLink = window.location.href.replace('savedArticles.html','');
        window.location.href = mainPageLink ;
    }
}