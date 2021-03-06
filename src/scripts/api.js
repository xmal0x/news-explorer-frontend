import { Popup } from './popup.js'; 
import { Page } from './page.js';
import { Card } from './card.js';
import { CardList } from './cardList.js';

export class Api {
    constructor(serverUrl) {
        this.baseUrl = serverUrl;
        this.articlesData = [];
        this.keyword = "";
        this.currentCard;
        this.userName = '';
        this.isAuth = false;
    }

    signUp(email, password, name) {

        fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }).then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(res.json());
        }).then(( json ) => {
            new Popup(document.querySelector('.reg-popup')).close();
            new Popup(document.querySelector('.success-popup')).open();
            console.log(json);
        }).catch(( err ) => {
            err.then((resErr) => {
                new Popup(document.querySelector('.reg-popup')).showResultError(resErr.message);
                console.log(err);
            });            
        });
    }

    signIn(email, password) {

        fetch(`${this.baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => {
            if(res.ok)
                return res.json();
            return Promise.reject(res.json());
        }).then((data) => {
            localStorage.setItem('token', data.token);

            this.getUserInfo().then(data => {
                this.userName = data.name;
                new Page().switchToAuthHeader(this.userName);
                new Popup(document.querySelector('.login-popup')).close();
            })
            window.location.href = window.location.href;
        }).catch(err => {
            err.then(err => {
                new Popup(document.querySelector('.login-popup')).showResultError(err.message);
                console.log(err.message);
            });
        });

        
    }

    searchNews(key, keyword) {
        new Page().hideElementByClassName('result__not-found');
        new Page().hideElementByClassName('result__founded');

        new Page().showElementByClassName('result__load');
        const apiKey = key;
        this.keyword = keyword;

        const daysBefore = -7;
        const from = this._addDays(daysBefore);
        const to = this._getFormatDate(new Date());

        const pageSize = '100'; 
        const url = `http://newsapi.org/v2/everything?q=${keyword}&from=${from}&to=${to}&sortBy=popularity&pageSize=${pageSize}&apiKey=${apiKey}`;
        fetch(url, {
            method: 'GET'
        }).then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        }).then(data => {
            new Page().hideElementByClassName('result__load');
            if(data.status === 'ok' && data.totalResults === 0) {
                new Page().showElementByClassName('result__not-found');
                document.querySelector('.result__not-found__text').textContent = "К сожалению по вашему запросу ничего не найдено.";


                new Page().hideElementByClassName('result__founded');
                new Page().hideElementByClassName('result__load');

            } else {
                new Page().hideElementByClassName('result__not-found');
                new Page().showElementByClassName('result__founded');

                this.articlesData = data.articles;

                const currentNews = this.getNextCards();

                const cardList = new CardList(document.querySelector('.cards'));
                cardList.clearAll();
                currentNews.forEach(card => {
                    card["keyword"] = this.keyword;
                    const cardElement = new Card(card.source.name, card.title, card.publishedAt, card.description, 
                        card.urlToImage, keyword, card.url).createCardElement();
                    const fav = cardElement.querySelector('.card__favorite');
                    fav.classList.remove('page-element_hidden');

                    if(!this.isAuth) {
                        fav.addEventListener('mouseover', new Page().showAuthError.bind(cardElement));
                        fav.addEventListener('mouseout', new Page().hideAuthError.bind(cardElement));
                    }

                    card["cardElement"] = cardElement;
                    fav.addEventListener('click', this.saveCard.bind(card));

                    cardList.addCard(cardElement);
                });

                
            }
        }).catch(err => {
            document.querySelector('.result__not-found__text').textContent = "Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз";
        });
    }

    getNextCards() {
        const numNewsToShow = 3;
        const currentNews = this.articlesData.slice(0, numNewsToShow);
        this.articlesData = this.articlesData.slice(numNewsToShow);

        if(this.articlesData.length == 0) {
            new Page().hideElementByClassName('button__show-more');
        } else {
            new Page().showElementByClassName('button__show-more');

        }

        return currentNews;
    }

    _getFormatDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        if(month < 10) {
            month = '0' + month;
        }

        let day = date.getDate() + 1;
        if(day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }

    _addDays(daysNum) {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate()+daysNum);
        return this._getFormatDate(tomorrow);
    }

    userIsAuth() {
    const token = localStorage.getItem('token');

        return fetch(`${this.baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        }).then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(res.json());
        })
    }

    getUserCards() {
        const token = localStorage.getItem('token');
        return fetch(`${this.baseUrl}/articles`, {
            method: 'GET',
            headers: {
                Authorization: `${token}`
            }
        }).then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(res.json());
        })
    }

    getUserInfo() {
        const token = localStorage.getItem('token');
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                Authorization: token
            }
        }).then(res => {
            if(res.ok) {
                return res.json();
            }
            return Promise.reject(res.json());
        })
    }

    saveCard() {
        const token = localStorage.getItem('token');
        fetch(`http://api.api-news.ga/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({
                keyword: this.keyword,
                title: this.title,
                text: this.description,
                date: this.publishedAt,
                source: this.source.name,
                link: this.url,
                image: this.urlToImage,
            })
        }).then(res => {
            if(res.ok) {
                this.cardElement.querySelector('.card__favorite').classList.add('card__favorite_marked');
                this.cardElement.querySelector('.card__favorite').classList.remove('card__favorite_normal');
                return res.json();
            }
            return Promise.reject(res.json());
        }).catch(err => {
            err.then(resp => {
                console.log(resp)
            })
        });
    }

    deleteCard() {

        const token = localStorage.getItem('token');
        fetch(`http://api.api-news.ga/articles/${this._id}`, {
            method: 'DELETE',
            headers: {
                Authorization: token
            },
        }).then(res => {
            if(res.ok) {
                const cardList = new CardList(document.querySelector('.cards'));
                cardList.cardListContainer.removeChild(this);
                return res.json();
            }
            return Promise.reject(res.json());
        }).catch(err => {
            err.then(resp => {
                console.log(resp)
            })
        });
        
    }
}