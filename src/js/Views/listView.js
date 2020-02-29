import * as base from '../Models/Base.js';

// step attribute defines the increment/decrement amount on the number input
export const renderItem = item => {
    const markdown = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `

    base.elements.shoppingList.insertAdjacentHTML('beforeEnd', markdown);
}

// can select by specific data attribute value
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid='${id}']`);
    item.parentElement.removeChild(item);
}