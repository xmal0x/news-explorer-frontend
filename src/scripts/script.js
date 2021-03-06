import { Popup } from './popup.js';
import { Api } from './api.js';
import { Validator } from './validator.js';
import { Page } from './page.js';
import { CardList } from './cardList.js';
import { Card } from './card.js';

//Constants
const serverUrl = "http://api.api-news.ga";
const apiKey = 'fb2a15a5b1c14a2ba63cd6a13e0e0e78';

//forms
const loginForm = document.forms.loginForm;
const regForm = document.forms.regForm;

//buttons
const loginButtons = document.querySelectorAll('.login-button');
const regButton = document.querySelector('.reg-button');

const closeLoginPopupBtn = document.querySelector('.login-popup__close');
const closeRegPopupBtn = document.querySelector('.reg-popup__close');
const closeSuccessPopupBtn = document.querySelector('.success-popup__close');

const searchBtn = document.querySelector('.button__search');

const showMoreBtn = document.querySelector('.button__show-more');

const exitBtn = document.querySelector('.header__auth-control');

//Fields
const regEmailField = regForm.email;
const regPassField = regForm.password;
const regNameField = regForm.name;

const loginEmailField = loginForm.email_login;
const loginPassField = loginForm.password_login;

const searchField = document.querySelector('.main-content__search__form');

//popups
const regPopup = new Popup(document.querySelector('.reg-popup'));
const loginPopup = new Popup(document.querySelector('.login-popup'));
const successPopup = new Popup(document.querySelector('.success-popup'));

//objects
const api = new Api(serverUrl);
const validator = new Validator();

//FUNCTIONS
function regNewUser(event) {
    event.preventDefault();
    if(!regForm.email.value || !regForm.password.value || !regForm.name.value)
        return;
    api.signUp(regForm.email.value, regForm.password.value, regForm.name.value);

}

function login(event) {
    event.preventDefault();
    if(!loginForm.email_login.value || !loginForm.password_login.value)
        return;
    api.signIn(loginForm.email_login.value, loginForm.password_login.value);
}

function search() {

    const userRequest = searchField.value;
    if(userRequest === "") {
        alert('Нужно ввести ключевое слово');
        return;
    }
    api.searchNews(apiKey, userRequest);
}

function showMore() {
    if(api.articlesData.length > 0) {
        const currentNews = api.getNextCards();

        const cardList = new CardList(document.querySelector('.cards'));

        currentNews.forEach(card => {
            const cardElement = new Card(card.source.name, card.title, card.publishedAt, card.description, 
                card.urlToImage, api.keyword, card.url).createCardElement();
            const fav = cardElement.querySelector('.card__favorite');
            fav.classList.remove('page-element_hidden');
            if(!api.isAuth) {
                fav.addEventListener('mouseover', new Page().showAuthError.bind(cardElement));
                fav.addEventListener('mouseout', new Page().hideAuthError.bind(cardElement));
            }
            card["cardElement"] = cardElement;
            card["keyword"] = api.keyword;
            fav.addEventListener('click', api.saveCard.bind(card));
            cardList.addCard(cardElement);
        });
    } 
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if(!token) {
        api.isAuth = false;
    } else {
        api.userIsAuth().then(res => {
            api.userName = res.name;
            api.isAuth = true;
            new Page().switchToAuthHeader(api.userName);
        }).catch(err => {
            console.log(err);
        });
    }

}

function exit() {
    new Page().exitMainPage();
}

//HANDLERS
//form open buttons
loginButtons.forEach(( loginButton ) => {
    loginButton.addEventListener('click', loginPopup.open.bind(loginPopup));    
});
regButton.addEventListener('click', regPopup.open.bind(regPopup));

//close forms buttons
closeLoginPopupBtn.addEventListener('click', loginPopup.close.bind(loginPopup));
closeRegPopupBtn.addEventListener('click', regPopup.close.bind(regPopup));
closeSuccessPopupBtn.addEventListener('click', successPopup.close.bind(successPopup));

//Submit forms
regForm.addEventListener('submit', regNewUser);
loginForm.addEventListener('submit', login);

//validators
regEmailField.addEventListener('input', validator.validateField.bind(validator));
regPassField.addEventListener('input', validator.validateField.bind(validator));
regNameField.addEventListener('input', validator.validateField.bind(validator));

loginEmailField.addEventListener('input', validator.validateField.bind(validator));
loginPassField.addEventListener('input', validator.validateField.bind(validator));

//search
searchBtn.addEventListener('click', search);

//showmore
showMoreBtn.addEventListener('click', showMore);

exitBtn.addEventListener('click', exit);

checkAuth();



