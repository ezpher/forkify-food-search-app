import { elements } from '../Models/Base.js';

export const getSearchInput = () => elements.searchField.value;

export const clearSearchField = () => {
    elements.searchField.value = '';
}

export const clearRecipes = () => {
    elements.recipeList.innerHTML = '';
}

export const renderRecipe = (recipe) => {
    const markdown = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${shortenTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `

    elements.recipeList.insertAdjacentHTML('beforeEnd', markdown);
}

export const renderRecipes = (recipes, page = 1, pageSize = 10) => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    recipes.slice(start, end).forEach(renderRecipe);

    renderPageBtns(page, recipes.length, pageSize);
}

const shortenTitle = (title, wordSize = 17) => {
    const newTitleWords = [];
    
    title.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= wordSize) {
            newTitleWords.push(cur);
            return acc + cur.length;
        }
    }, 0);

    const newTitle = `${newTitleWords.join(' ')} ...`
    return newTitle;
}

const renderPageBtns = (page, resultsSize, pageSize) => {

    const pages = Math.ceil(resultsSize/pageSize);

    let pageBtn;
    if (page > 1 && page < pages) {
        // show prev and next btns
        pageBtn = `
            ${createPageBtn(page, 'prev')} 
            ${createPageBtn(page, 'next')}
        `;
    } else if (page === 1 && pages > 1) {
        // show next btn only
        pageBtn = `${createPageBtn(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        // show prev btn only
        pageBtn = `${createPageBtn(page, 'prev')}`;
    }

    // else no btns shown
    
    // render page btns
    elements.pageBtnsContainer.innerHTML = pageBtn;
}

const createPageBtn = (page, btnType) =>
    `                
    <button class="btn-inline results__btn--${btnType}" data-goto=${btnType === 'prev' ? page - 1 : page + 1}>
        <span>Page ${btnType === 'prev' ? page - 1 : page + 1}</span> 
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${btnType === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `
