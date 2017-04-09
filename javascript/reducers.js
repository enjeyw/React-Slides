import { combineReducers } from 'redux';

import { IMAGES_HAS_ERRORED, IMAGES_IS_LOADING, IMAGES_FETCH_DATA_SUCCESS} from './actions.js'


//Images
export function imagesHasErrored(state = false, action) {
    switch (action.type) {
        case 'IMAGES_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function imagesIsLoading(state = false, action) {
    switch (action.type) {
        case 'IMAGES_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function images(state = [], action) {
    switch (action.type) {
        case 'IMAGES_FETCH_DATA_SUCCESS':
            return action.images;
        default:
            return state;
    }
}


// Combine Reducers
var reducers = combineReducers({
    imagesHasErrored, imagesIsLoading, images
});

export default reducers;