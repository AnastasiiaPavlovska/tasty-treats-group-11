import ls from './local-storage';
import TestyApiService from './testyApiService.js';

let ts = new TestyApiService();

function getLs() {
    return ls.load() || {};
}

function togleFav(id) {
    console.log(id);
    let favoritesObj = getLs();

    if (id in favoritesObj) {
        delete favoritesObj[id];
        ls.save(favoritesObj);
        console.log('Remove from favorites');
        return 0;
        // unFav on page
    } else {
        ts.getRecipeById(id).then(data => {
            console.log(data);
            favoritesObj[id] = data;
            ls.save(favoritesObj);
            console.log('Add to favorites');

        });
    }
    console.log(favoritesObj);
    return 1;
}

export default { getLs, togleFav };