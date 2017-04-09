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
export function itemsFetchDataSuccess(images) {
    return {
        type: IMAGES_FETCH_DATA_SUCCESS,
        images
    };
}

export function imagesFetchData(viewerHash) {
    return (dispatch) => {
        dispatch(imagesIsLoading(true));

        var req = request.get('/imagess/' + viewerHash) ;
        req.end(function (err, res) {

            if (err) {
              dispatch(imagesHasErrored(true));
              throw Error(err)
            } else {
              dispatch(itemsFetchDataSuccess(JSON.parse(res.text).images))
            }
            dispatch(imagesIsLoading(false));
        });
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
