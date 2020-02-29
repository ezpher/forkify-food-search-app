import axios from 'axios';
import { forkify } from '../config.js'

export default class Recipe {
    constructor(id) {
        this.id = id
    }

    async getRecipe() {
        try {
           const res = await axios.get(`${forkify.forkifyBaseUrl}get?rId=${this.id}`);

           // console.log(res.data.recipe.ingredients);

           this.title = res.data.recipe.title;
           this.author = res.data.recipe.publisher;
           this.img = res.data.recipe.image_url;
           this.url = res.data.recipe.source_url;
           this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
        }
        
    } 

    calcServings() {
        // assuming 4 services per recipe
        this.servings = 4;
    }
    
    calcTime() {
        // assuming need 15 mins for 3 ingredients
        const periods = Math.ceil(this.ingredients.length/3);
        this.time = periods * 15;
    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsps', 'tbsp', 'ozs', 'oz', 'tsps', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; // in event that units are already shortened e.g. kg

        const newIngredients = this.ingredients.map(ing => {

            // standardize case
            let ingredient = ing.toLowerCase();

            // Convert long-form to short-form unit of measures
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            // get rid of parenthesis // note that usually special chars need not be escaped inside character classes
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // distinguish between the different forms of quantities e.g. 1 1/2 vs 1 vs no quantity at all
            // there's two broad categories of ingredients, "no unit" vs "unit"
            // within "unit" group, there's single number or fractions; fractions can be connected by hyphen or space e.g. 1-1/2 or 1 1/2
            // within "no unit" group, there's number with no unit or no unit and no number
            
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(ingr => units.includes(ingr)); // changed from unitsShort to units

            let ingObj, count;            
            // contains unit
            if (unitIndex > -1) {

                // unit with fractions connected by space
                if (arrIng.slice(0, unitIndex).length > 1) {

                    const rawCount = eval(arrIng.slice(0, unitIndex).join('+'));

                    // to round recurring decimal to 2 dp at most
                    // the + is to drop any additional zeros
                    // link: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary

                    count = +rawCount.toFixed(2); 

                // unit with fractions connected by hyphen or unit with non-fractional number
                } else {
                    // if '-' not found, will not do replacement
                    const rawCount = eval(arrIng[0].replace('-','+'));
                    count = +rawCount.toFixed(2); 
                }

                ingObj = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            
            // no unit
            } else {
                // with number
                if (parseInt(arrIng[0], 10)) {

                    ingObj = {
                        count: parseInt(arrIng[0], 10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                    }

                // with no number
                // use else if not sure if it's the only other condition    
                } else if (unitIndex === -1) {

                    ingObj = {
                        count: 1,
                        unit: '',
                        ingredient // ingredient stays the same
                    }
                }
            } 

            return ingObj;
        })

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Check if decrease or increase button selected, and update the servings
        const newServings = type === 'decrease' ? this.servings - 1 : this.servings + 1;

        // For each ingredient update the new count 
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })

        // assign the new servings to the servings property
        this.servings = newServings;
    }
}
