/* testing babel and webpack */
// import num from './test'; // ES6 import syntax
// console.log(`I imported ${num} from another module!`);

/* GLOBAL APP CONTROLLER */
import * as base from './Models/Base.js'; 
import Search from './Models/Search.js';
import Recipe from './Models/Recipe.js';
import * as searchView from './Views/searchView.js';
import * as recipeView from './Views/recipeView.js';

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
        base.showLoaderIcon(base.elements.recipeListContainer);

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

/** RECIPE CONTROLLER */
const recipeController = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI
        base.showLoaderIcon(base.elements.recipeContainer);        
        if (state.Search) searchView.highlightSelected(id); // highlight only if there are search results, e.g. on window load recipe, shouldn't highlight

        // Create Recipe and get recipe from api
        state.Recipe = new Recipe(id);

        try {
            await state.Recipe.getRecipe();  
            // parse Ingredients
            state.Recipe.parseIngredients();
            // console.log(state.Recipe.ingredients);
            
        } catch (error) {
            console.log(error);
        }
        
        // Calculate Time and Servings
        state.Recipe.calcTime();
        state.Recipe.calcServings();

        // Render recipe
        base.clearLoaderIcon();
        recipeView.renderRecipe(state.Recipe);
        // console.log(state.Recipe);
    }
}

// event listener for search form submission
base.elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchController();
})

// event listener for prev and next page buttons
base.elements.pageBtnsContainer.addEventListener('click', e => {
    // use closest if you are confident that the click will trigger from the within or at the btn-inline element
    const pageBtn = e.target.closest('.btn-inline');

    // parse the data-goto attribute from string to integer
    const goToPage = parseInt(pageBtn.dataset.goto, 10);

    searchView.clearRecipes();    
    searchView.renderRecipes(state.Search.result, goToPage);
})

// event listeners for clicking on a recipe or on reloading on a recipe
const eventsForRecipe = ['hashchange', 'load']; // for some reason, forEach doesn't work if used on array directly
eventsForRecipe.forEach(event => {window.addEventListener(event, recipeController)});

// event listeners for increase/decrease servings buttons on recipe
base.elements.recipeContainer.addEventListener('click', e => {

    // use match because you want to precisely match what button is clicked
    // if match is found for the .btn-decrease class or its child elements

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.Recipe.servings > 1) {
            state.Recipe.updateServings('decrease');
            recipeView.updateServingsIngredients(state.Recipe);
        }        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.Recipe.updateServings('increase');
        recipeView.updateServingsIngredients(state.Recipe);
    }
})

