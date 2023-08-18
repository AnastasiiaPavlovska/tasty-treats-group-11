import axios from 'axios';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

export default class TestyApiService {
    constructor() {
        this.params = {};
        this.params.category = '';
        this.params.limit = 9;
        this.params.title = '';
        this.params.ingredient = '';
        this.params.area = '';
    }

    async getCategories() {
        const response = await axios.get(
            `${BASE_URL}/categories`
        );
        return response.data;
    }

    setCategory(name) {
        this.params.category = name;
    }

    setPerPage(num) {
        this.params.limit = num;
    }

    setSearchText(text) {
        this.params.title = text;
    }
    // 18/08/23*********************
    setSearchIngredient(ingredient) {
        this.params.ingredient = ingredient;
    }
    setSearchArea(area) {
        this.params.area = area;
    }

    async getRecipes() {
        const response = await axios.get(
            `${BASE_URL}/recipes`
            , {
                params: this.params
            }
        );
        return response.data;
    }
    // 18/08/23****************************8
    async getAreas() {
        const response = await axios.get(
            `${BASE_URL}/areas`
        );
        console.log(response.data)
        return response.data;
    }

    async getIngredients() {
        const response = await axios.get(
            `${BASE_URL}/ingredients`
        );
        console.log(response.data)
        return response.data;
    }



}



