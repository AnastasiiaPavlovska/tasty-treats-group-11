import ls from './local-storage';
import TestyApiService from './testyApiService.js';

let ts = new TestyApiService();
const key = 'favorites';

function getLs() {
    return ls.load(key) || {};
}

function checkFav(id) {
    console.log(id);
    let favoritesObj = getLs();

    if (id in favoritesObj) {
        console.log(`Id ${id} in Favorites`);
        return true;
    } else {
        console.log(`Id ${id} not in Favorites`);
        return false;
    }
}

function togleFav(id) {
    console.log(id);
    let favoritesObj = getLs();

    if (id in favoritesObj) {
        delete favoritesObj[id];
        ls.save(key, favoritesObj);
        console.log('Remove from favorites');
        return 0;
        // unFav on page
    } else {
        ts.getRecipeById(id).then(data => {
            console.log(data);
            favoritesObj[id] = data;
            ls.save(key, favoritesObj);
            console.log('Add to favorites');
        });
    }
    console.log(favoritesObj);
    return 1;
}

export default { getLs, checkFav, togleFav };
