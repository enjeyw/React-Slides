import React from 'react';
import request from 'superagent';

import { browserHistory, Link } from 'react-router'


var DemoButton = React.createClass({
  _onClick: function(e){
    request.post('/demorequest')
        .auth(SESSION_TOKEN)
        .end(function (err, res) {
                    if (err) {
                      dispatch(presuploadHasErrored(true));
                      throw Error(err)
                    } else {
                      browserHistory.push('/tryit/' + JSON.parse(res.text)['admin_hash']);
                    }
                    })
  },

  render: function() {

    return (
      <div>
          <button className="submit-button dark" onClick={this._onClick} style={{width: 230}}>
              See a demo
          </button>
      </div>
    );
  }

});



export default DemoButton;