import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch, browserHistory, Link } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers'

function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

const store = configureStore();

// Pages/views
import HomeView from './HomeView.jsx'
import UploadView from './UploadView.jsx'
import ShareView from './ShareView.jsx'
import AdminPresView from './PresentationViews.jsx'


render((
    <Provider store={store}>
        <AdminPresView presID="5GDy"/>
    </Provider>
    ), document.getElementById('app'));