import * as base from '../Models/Base.js';
import { shortenTitle } from '../Views/searchView.js';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);

};

export const toggleLikeMenu =  numLikes => {
    base.elements.likesMenu.style.visibility = numLikes > 0 ? 'visible': 'hidden';
}

// render like in the likes menu
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${shortenTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `
    base.elements.likesList.insertAdjacentHTML('beforeEnd', markup);
}

// delete like from the likes menu
export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*='${id}']`).parentElement;

    if (el) el.parentElement.removeChild(el);
}