export const elements = {
    searchForm: document.querySelector('.search'),
    searchField: document.querySelector('.search__field'),
    recipeListContainer: document.querySelector('.results'),
    recipeList: document.querySelector('.results__list'),
    pageBtnsContainer: document.querySelector('.results__pages'),
    recipeContainer: document.querySelector('.recipe')
}

export const elementString = {
    loader: 'loader'
}

export const showLoaderIcon = parent => {
    const markup = `
        <div class=${elementString.loader}>
            <svg>
                <use href="img/icons.svg#icon-cw" />
            </svg>
        </div>
    `

    parent.insertAdjacentHTML('afterBegin', markup);
}

export const clearLoaderIcon = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if (loader) loader.parentElement.removeChild(loader);     
}