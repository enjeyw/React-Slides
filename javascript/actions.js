import request from 'superagent';
import { browserHistory, Link } from 'react-router'

// post email
export const POST_EMAIL_HAS_ERRORED = 'POST_EMAIL_HAS_ERRORED';
export const POST_EMAIL_LOADING = 'POST_EMAIL_LOADING';
export const POST_EMAIL_SUCCESS = 'POST_EMAIL_SUCCESS';
export const POST_EMAIL_SKIPPED = 'POST_EMAIL_SKIPPED';

export function postEmailHasErrored(bool) {
    return {
        type: POST_EMAIL_HAS_ERRORED,
        hasErrored: bool
    };
}

export function postEmailLoading(bool) {
    return {
        type: POST_EMAIL_LOADING,
        loading: bool
    };
}

export function postEmailSuccess(bool) {
    return {
        type: POST_EMAIL_SUCCESS,
        success: bool
    };
}

export function postEmailSkipped(bool) {
    return {
        type: POST_EMAIL_SKIPPED,
        skipped: bool
    };
}

export function postEmail(email) {
    return (dispatch) => {
        dispatch(postEmailLoading(true));
        return (
            request.post('/email')
                .auth(SESSION_TOKEN)
                .send({ email: email})
                .end(function (err, res) {
                    if (err) {
                      dispatch(postEmailHasErrored(true));
                      throw Error(err)
                    } else {
                      dispatch(postEmailSuccess(true));
                    }
                dispatch(postEmailLoading(false));
                })
        );
    };
}

// send Switching
export const SENDSWITCH_HAS_ERRORED = 'SENDSWITCH_HAS_ERRORED';

export function sendswitchHasErrored(bool) {
    return {
        type: SENDSWITCH_HAS_ERRORED,
        hasErrored: bool
    };
}

export function sendswitch(channel, slide_index) {
    return (dispatch) => {
        return (
            request.post('/switch_slide')
                .send({ channel: channel, slide_index: slide_index })
                .end(function (err, res) {
            if (err) {
              dispatch(sendswitchHasErrored(true));
              throw Error(err)
            }
        }));
    };
}

// receive switching
export const RECEIVE_SWITCH = 'RECEIVE_SWITCH';

export function receiveswitch(slide_index) {
    return {
        type: RECEIVE_SWITCH,
        slide_index
    };
}

// Presentation Upload
export const PRESUPLOAD_HAS_ERRORED = 'PRESUPLOAD_HAS_ERRORED';
export const PRESUPLOAD_IS_LOADING = 'PRESUPLOAD_IS_LOADING';
export const PRESUPLOAD_SEND_DATA_SUCCESS = 'PRESUPLOAD_SEND_DATA_SUCCESS';
export const PRESUPLOAD_PERCENT_UPLOADED = 'PRESUPLOAD_PERCENT_UPLOADED';

export function presuploadHasErrored(bool) {
    return {
        type: PRESUPLOAD_HAS_ERRORED,
        hasErrored: bool
    };
}
export function presuploadPercentUploaded(percent) {
    return {
        type: PRESUPLOAD_PERCENT_UPLOADED,
        percentUploaded: percent
    };
}

export function presuploadIsLoading(bool) {
    return {
        type: PRESUPLOAD_IS_LOADING,
        isLoading: bool
    };
}
export function presuploadSendDataSuccess(admin_hash) {
    return {
        type: PRESUPLOAD_SEND_DATA_SUCCESS,
        admin_hash: admin_hash
    };
}

export function uploadpresentation(file) {
    return (dispatch) => {
        dispatch(presuploadIsLoading(true));
        return (
            request.post('/upload')
                .attach('file', file)
                .auth(SESSION_TOKEN)
                .on('progress', function(e) {
                    dispatch(presuploadPercentUploaded(e.percent));})
                .end(function (err, res) {
                    if (err) {
                      dispatch(presuploadHasErrored(true));
                      throw Error(err)
                    } else {
                      dispatch(presuploadSendDataSuccess(JSON.parse(res.text)['admin_hash']));
                    }
                    dispatch(presuploadIsLoading(false));
                    })
        );
    };
}


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
        return (
            request.get('/images/' + viewerHash).end(function (err, res) {
            if (err) {
              dispatch(imagesHasErrored(true));
              throw Error(err)
            } else {
              dispatch(imagesFetchDataSuccess(JSON.parse(res.text).images))
            }
            dispatch(imagesIsLoading(false));
        }));
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
