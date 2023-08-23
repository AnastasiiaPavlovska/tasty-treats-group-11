const save = value => {
    try {
        const serializedState = JSON.stringify(value);
        localStorage.setItem('favorites', serializedState);
    } catch (error) {
        console.error('Set state error: ', error.message);
    }
};

const load = () => {
    try {
        const serializedState = localStorage.getItem('favorites');
        return serializedState === null
            ? undefined
            : JSON.parse(serializedState);
    } catch (error) {
        console.error('Get state error: ', error.message);
    }
};

const remove = () => {
    try {
        localStorage.removeItem('favorites');
    } catch (error) {
        console.error('Remove item error: ', error.message);
    }
};

export default { save, load, remove };
