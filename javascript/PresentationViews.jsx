import React from 'react';
import request from 'superagent';
import { connect } from 'react-redux';
import { imagesFetchData } from './actions.js'

import SlidesContainer from './SlidesContainer.jsx'

var AdminPresView = React.createClass({

  render: function() {
    return (
      <div>
        <SlidesContainer viewerHash={this.props.presID.slice(0,4)} adminHash={this.props.presID}/>
      </div>
    );
  }

});

export default AdminPresView
