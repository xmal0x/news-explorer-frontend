import { Popup } from './popup.js';
import { Api } from './api.js';
import { Validator } from './validator.js';
import { Page } from './page.js';
import { CardList } from './cardList.js';
import { Card } from './card.js';

const serverUrl = "http://api.api-news.ga";

const api = new Api(serverUrl);
const keywords = [];
let articlesNum = 0;
let userName = '';

const exitBtn = document.querySelector('.header__auth-control');

function loadPage() {
    api.getUserInfo().then(data => {
        userName = data.name;
        getUserCardsAndSetTitle();
    }).catch(err => {
        console.log(err);
    });

}

function setArticlesNum() {
    const artNum = document.querySelector('.main-content__saved__articles-count');
    artNum.textContent = `${userName}, у вас ${articlesNum} сохранённых статей`;
}

function setKeywords() {
    const keywordsElem = document.querySelector('.main-content__saved__description_keywords');
    const popularKeys = {};
    keywords.forEach(keyword => {
        if(!popularKeys.hasOwnProperty(keyword)) {
            popularKeys[keyword] = 1;
        } else {
            popularKeys[keyword] += 1;
        }
    });
    
    const keysSorted = Object.keys(popularKeys).sort(function(a,b){return popularKeys[a]-popularKeys[b]})

    const keysNum = Object.keys(popularKeys).length;

    if(keysNum == 1) { 
        keywordsElem.textContent = `${keysSorted[0]}`;
    } else if(keysNum == 2) {
        keywordsElem.textContent = `${keysSorted[1]} и ${keysSorted[0]}`;
    } else if(keysNum == 3) {
        keywordsElem.textContent = `${keysSorted[2]}, ${keysSorted[1]} и ${keysSorted[0]}`;
    } else {
        keywordsElem.textContent = `${keysSorted[keysSorted.length - 1]}, ${keysSorted[keysSorted.length - 2]} и ${keysSorted.length - 2} другим`;
    }
}

function getUserCardsAndSetTitle() {
    const cardList = new CardList(document.querySelector('.cards'));
    cardList.clearAll();
    api.getUserCards().then(res => {
        articlesNum = res.data.length;
        res.data.forEach(card => {
            const cardElem = new Card(card.source, card.title, card.date, card.text, card.image, card.keyword, card.link).createCardElement();
            keywords.push(card.keyword);
            cardList.addCard(cardElem);
            cardElem.querySelector('.card__saved_theme').style.display = "block";
            cardElem.querySelector('.card__saved_theme').textContent = card.keyword;

            cardElem.querySelector('.card__favorite_message').style.display = "none";
            cardElem["_id"] = card._id;
            cardElem.querySelector('.card__saved_normal').addEventListener('click', api.deleteCard.bind(cardElem));
        })
        document.querySelector('.header__item_auth').textContent = userName;
        setArticlesNum();
        setKeywords();

    }).catch(err => {
        console.log(err);
    })
}

function exit() {
    new Page().exitMainPage();
}

exitBtn.addEventListener('click', exit);


loadPage();