/* testing babel and webpack */
// import num from './test'; // ES6 import syntax
// console.log(`I imported ${num} from another module!`);

/* GLOBAL APP CONTROLLER */
import * as base from './Models/Base.js'; 
import Search from './Models/Search.js';
import Recipe from './Models/Recipe.js';
import List from './Models/List.js';
import * as searchView from './Views/searchView.js';
import * as recipeView from './Views/recipeView.js';
import * as listView from './Views/listView.js';

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

/** SHOPPING LIST CONTROLLER */

const listController = () => {
    // create new list if it does not already exists
    if (!state.List) state.List = new List();

    // add each ingredient to shopping list and UI
    state.Recipe.ingredients.forEach(ing => {
        const item = state.List.addItem(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item);   
    });
}



/** EVENT LISTENERS */

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

// event listeners for recipe container buttons e.g. increase/decrease servings buttons
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

    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        listController();
    }
})

// handle delete and update shopping list item events
base.elements.shoppingList.addEventListener('click', e => {
    
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.List.deleteItem(id);

        // delete item from UI
        listView.deleteItem(id); 
    } else if (e.target.matches('.shopping__count-value')) {

        // update list item count
        const val = parseFloat(e.target.value, 10);
        state.List.updateCount(id, val);
    }
})

const l = new List();
window.l = l;

