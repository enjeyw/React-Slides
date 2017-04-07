import React from 'react';
import { Link } from 'react-router'

var ShareView = React.createClass({

  render: function() {
    if (!this.props.stringDict) {
        return (
            <div>

            </div>
        )
    } else {
        return (
          <div>
              <Link to={'admin/' + this.props.stringDict.viewer_hash}>View link</Link>
          </div>
        );
    }
  }

});

export default ShareView;