import request from 'superagent';

// Images
export const IMAGES_HAS_ERRORED = 'IMAGES_HAS_ERRORED';
export const IMAGES_IS_LOADING = 'IMAGES_IS_LOADING';
export const IMAGES_FETCH_DATA_SUCCESS = 'IMAGES_FETCH_DATA_SUCCESS';

export function imagesHasErrored(bool) {
    return {
        type: IMAGES_HAS_ERRORED,
        hasErrored: bool
    };
}
export function imagesIsLoading(bool) {
    return {
        type: IMAGES_IS_LOADING,
        isLoading: bool
    };
}
export function imagesFetchDataSuccess(images) {
    return {
        type: IMAGES_FETCH_DATA_SUCCESS,
        images
    };
}

export function imagesFetchData(viewerHash) {
    return (dispatch) => {
        dispatch(imagesIsLoading(true));

        return (fetch('/images/' + viewerHash)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(imagesIsLoading(false));
                return response;
            })
            .then((response) => response.json())
            .then((response) => {
                var images = response.images;
                return dispatch(imagesFetchDataSuccess(images))
            })
            .catch(() => dispatch(imagesHasErrored(true))));
    };
}



export function errorAfterFiveSeconds() {
    // We return a function instead of an action object
    return (dispatch) => {
        setTimeout(() => {
            // This function is able to dispatch other action creators
            dispatch(imagesHasErrored(true));
        }, 5000);
    };
}
