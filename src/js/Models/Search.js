import axios from 'axios';
import { forkify } from '../config.js'

export default class Search {

    constructor(query) {
        this.query = query;
    };

    async getResults() {

        try {
            const res = await axios(`${forkify.forkifyBaseUrl}search?q=${this.query}`);            
            this.result = res.data.recipes;

            // console.log(this.result);

        } catch (error) {
            alert(error);
        }
        
    }; 
}