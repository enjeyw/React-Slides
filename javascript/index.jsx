import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch, browserHistory, Link } from 'react-router'


// Pages/views
import HomeView from './HomeView.jsx'
import UploadView from './UploadView.jsx'
import ShareView from './ShareView.jsx'
import {AdminPresView, Slides} from './Presentation.jsx'


render((
    <Router history={browserHistory}>
        <Route path="/" component={HomeView} />
        <Route path="/admin/:presID" component={AdminPresView} />
    </Router>
    ),
    document.getElementById('app'));