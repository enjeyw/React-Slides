import React from 'react';
import { connect } from 'react-redux';
import { imagesFetchData } from './actions.js'

import request from 'superagent';

import ViewerSlidesContainer from './ViewerSlidesContainer.jsx'

var ViewerPresView = React.createClass({
  render: function() {
    return (
      <div>
        <ViewerSlidesContainer viewerHash={this.props.params.presID.slice(0,4)}/>
      </div>
    );
  }

});


export default ViewerPresView
