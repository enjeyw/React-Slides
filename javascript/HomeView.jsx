import React from 'react';

import UploadView from './UploadView.jsx'
import EmailView from './EmailView.jsx'
import Header from './Header.jsx'

var HomeView = React.createClass({
  render: function() {

    return (
      <div className="site-wrapper-inner">
        <div className="cover-container container">
            <Header />

          <UploadView setIdStrings={this.setIdStrings}/>
        </div>
      </div>
    );
  }

});

export default HomeView;