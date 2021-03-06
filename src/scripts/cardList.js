export class CardList {
    constructor(cardListContainer) {
        this.cardListContainer = cardListContainer;
    }

    addCard(card) {
        this.cardListContainer.appendChild(card);
    }

    clearAll() {        
        let child = this.cardListContainer.lastElementChild;  
        while (child) { 
            this.cardListContainer.removeChild(child); 
            child = this.cardListContainer.lastElementChild; 
        } 
    }
}