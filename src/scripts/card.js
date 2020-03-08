export class Card {
    constructor(sourceName, title, publishDate, description, image, keyword, link) {
        this.sourceName = sourceName;
        this.title = title;
        this.publishDate = publishDate;
        this.description = description;
        this.image = image;

        this.keyword = keyword;
        this.link = link;
    }
    
    createCardElement() {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('card__img-container');

        const image = document.createElement('img');
        image.classList.add('card__image');
        image.alt = "news_image";
        image.src = this.image;
        
        imgContainer.appendChild(image);

        card.appendChild(imgContainer);

        const content = document.createElement('div');
        content.classList.add('card__content');

        const date = document.createElement('div');
        date.classList.add('card__date');
        date.textContent = this.formatPublishDate(this.publishDate);
        content.appendChild(date);

        const title = document.createElement('h4');
        title.classList.add('card__title');
        title.textContent = this.title;
        content.appendChild(title);

        const description = document.createElement('span');
        description.classList.add('card__text');
        description.textContent = this.description;
        content.appendChild(description);

        const source = document.createElement('div');
        source.classList.add('card__source');
        source.textContent = this.sourceName;
        content.appendChild(source);

        const favorite = document.createElement('div');
        favorite.classList.add('card__favorite');
        favorite.classList.add('card__favorite_normal');
        favorite.classList.add('page-element_hidden');
        content.appendChild(favorite);

        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('card__saved_normal');
        deleteIcon.classList.add('card__saved');
        deleteIcon.classList.add('page-element_hidden');
        content.appendChild(deleteIcon);

        const favoriteMessage = document.createElement('div');
        favoriteMessage.classList.add('card__favorite_message');
        favoriteMessage.classList.add('page-element_hidden');
        favoriteMessage.textContent = "Войдите, чтобы сохранять статьи";
        content.appendChild(favoriteMessage);

        const cardTheme = document.createElement('div');
        cardTheme.classList.add('card__saved_theme');
        cardTheme.classList.add('page-element_hidden');
        cardTheme.style.display = "none";
        content.appendChild(cardTheme);


        card.appendChild(content);

        return card;
    }

    formatPublishDate(publishDate) {
        const date = new Date(publishDate);
        const day = date.getDate();
        const year = date.getFullYear();
        const month = this.getMonthName(date.getMonth());
        return `${day} ${month}, ${year}`;
    }

    getMonthName(monthNum) {
        const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
        return months[monthNum];
    }

}