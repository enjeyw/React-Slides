import React from 'react';
import request from 'superagent';
import { connect } from 'react-redux';
import { imagesFetchData } from './actions.js'

import AdminSlidesContainer from './AdminSlidesContainer.jsx'

var AdminPresView = React.createClass({

  render: function() {
    return (
      <div>
        <AdminSlidesContainer viewerHash={this.props.params.presID.slice(0,4)} adminHash={this.props.params.presID}/>
      </div>
    );
  }

});


export default AdminPresView
