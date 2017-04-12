import React from 'react';

import UploadView from './UploadView.jsx'
import ShareView from './ShareView.jsx'


var HomeView = React.createClass({

  getInitialState: function() {
    return {
      id_string: null
    };
  },

  setIdStrings: function (id_strings) {
    this.setState({
      string_dict: id_strings
    })
  },

  render: function() {
    return (
      <div>
        <UploadView setIdStrings={this.setIdStrings}/>
        <ShareView/>
      </div>
    );
  }

});

export default HomeView;