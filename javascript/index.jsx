import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch, browserHistory, Link } from 'react-router'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers'

const initialState = {};

function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

const store = configureStore(initialState);

// Pages/views
import HomeView from './HomeView.jsx'
import AdminPresView from './AdminPresentationView.jsx'


render((
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={HomeView} />
            <Route path="/admin/:presID" component={AdminPresView} />
        </Router>
    </Provider>
    ), document.getElementById('app'));