import { combineReducers } from 'redux';

import { IMAGES_HAS_ERRORED, IMAGES_IS_LOADING, IMAGES_FETCH_DATA_SUCCESS,
    PRESUPLOAD_HAS_ERRORED, PRESUPLOAD_PERCENT_UPLOADED, PRESUPLOAD_IS_LOADING, PRESUPLOAD_SEND_DATA_SUCCESS,
    SENDSWITCH_HAS_ERRORED, RECEIVE_SWITCH} from './actions.js'

// Sending Switches
export function sendswitchHasErrored(state = false, action) {
    switch (action.type) {
        case 'SENDSWITCH_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

// Receive Switches
export function recieveswitch(state = 0, action) {
    switch (action.type) {
        case 'RECEIVE_SWITCH':
            return action.data.slide_index;
        default:
            return state;
    }

}

//Presentation_uploads
export function presuploadHasErrored(state = false, action) {
    switch (action.type) {
        case 'PRESUPLOAD_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function presuploadPercentUploaded(state = 0, action) {

    switch (action.type) {
        case 'PRESUPLOAD_PERCENT_UPLOADED':
            return action.percentUploaded;
        default:
            return state;
    }
}

export function presuploadIsLoading(state = false, action) {
    switch (action.type) {
        case 'PRESUPLOAD_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function presupload(state = '', action) {
    switch (action.type) {
        case 'PRESUPLOAD_SEND_DATA_SUCCESS':
            return action.admin_hash;
        default:
            return state;
    }
}


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
var rootReducer = combineReducers({
    presuploadHasErrored, presuploadIsLoading, presuploadPercentUploaded, presupload,
    imagesHasErrored, imagesIsLoading, images,
    sendswitchHasErrored, recieveswitch
});

export default rootReducer;