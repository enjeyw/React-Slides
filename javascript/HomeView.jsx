import React from 'react';

import UploadView from './UploadView.jsx'
import ShareView from './ShareView.jsx'


var HomeView = React.createClass({
  render: function() {

    return (
      <div className="site-wrapper-inner">
        <div className="cover-container container">
          <UploadView setIdStrings={this.setIdStrings}/>
        </div>
      </div>
    );
  }

});

export default HomeView;