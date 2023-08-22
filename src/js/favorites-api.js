import ls from './local-storage';
import TestyApiService from './testyApiService';

let favoritesObj;

function getLs() {
    return ls.load() || {};
}

function togleFav(id) {
    console.log(id);
    let favoritesObj = getLs();
    console.log(favoritesObj);
}

export default { getLs, togleFav };