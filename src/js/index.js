/* testing babel and webpack */
// import num from './test'; // ES6 import syntax
// console.log(`I imported ${num} from another module!`);

/* GLOBAL APP CONTROLLER */
import * as base from './Models/Base.js'; 
import Search from './Models/Search.js';
import * as searchView from './Views/searchView.js';

/* Global state object to hold state for objects across app at a certain point in time */
/* e.g. search object, current recipe, shopping list etc. */
const state = {};

/** SEARCH CONTROLLER */
const searchController = async () => {
    const query = searchView.getSearchInput();

    if (query) {

        // get search input from UI and save searchObject to state object
        state.Search = new Search(query);
        
        // clear search field, previous search results and ajax loader
        searchView.clearSearchField();
        searchView.clearRecipes();
        base.showLoaderIcon(base.elements.recipeContainer);

        try {
            // get search result from API
            await state.Search.getResults(query);
            // console.log(state.Search.result)
        base.clearLoaderIcon();
        } catch (error) {
            alert(error);
        }

        // render result on the UI
        searchView.renderRecipes(state.Search.result);
    }    
}

base.elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchController();
})

base.elements.pageBtnsContainer.addEventListener('click', e => {
    const pageBtn = e.target.closest('.btn-inline');

    // parse the data-goto attribute from string to integer
    const goToPage = parseInt(pageBtn.dataset.goto, 10);

    searchView.clearRecipes();    
    searchView.renderRecipes(state.Search.result, goToPage);
})



