import React from 'react';
import { browserHistory, Link } from 'react-router'

var Header = React.createClass({
  render: function() {

    return (
      <div className="masthead clearfix">
            <Link to={'/'} className="inner site-logo">
              <img className="logo-image" src="/static/css/wand_white.svg"></img>
                <div className="masthead-brand" style={{marginBottom: 0}}>
                    <h3>Slidecast</h3>
                </div>
            </Link>
      </div>
    );
  }

});

export default Header;