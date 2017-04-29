import React from 'react';
import {render} from 'react-dom';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'

import { Router, Route, Switch, browserHistory, Link } from 'react-router'

import { configurePusher } from 'pusher-redux';

const initialState = {};

function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

const store = configureStore(initialState);
//const history = syncHistoryWithStore(browserHistory, store);

const pusheroptions = {
  cluster: 'ap1'
};

configurePusher(store, PUSHER_CHAT_APP_KEY, pusheroptions);


// Pages/views
import HomeView from './HomeView.jsx'
import AdminPresView from './AdminPresentationView.jsx'
import ViewerPresView from './ViewerPresentationView.jsx'
import ShareView from './ShareView.jsx'

render((
    <Provider store={store}>
          <Router history={browserHistory}>
            <Route path="/" component={HomeView} />
            <Route path="/admin/:presID/present" component={AdminPresView} />
            <Route path="/admin/:presID" component={ShareView} />
            <Route path="/:presID" component={ViewerPresView} />
          </Router>
    </Provider>
    ), document.getElementById('app'));