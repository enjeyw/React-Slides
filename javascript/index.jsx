import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch, browserHistory, Link } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

const store = function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
};

// Pages/views
import HomeView from './HomeView.jsx'
import UploadView from './UploadView.jsx'
import ShareView from './ShareView.jsx'
import {AdminPresView, Slides} from './Presentation.jsx'


render((
    <Provider store={store}>
        <AdminPresView presID="5GDy"/>
    </Provider>
    ), document.getElementById('app'));