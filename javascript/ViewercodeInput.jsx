import React from 'react';
import { browserHistory, Link } from 'react-router'

var ViewercodeInput = React.createClass({

  _onClick: function() {
      console.log('made it!');
      var input = document.getElementById('input-viewercode');
      var viewercode = input.value;

      browserHistory.push('/' + viewercode)
  },

  _onCodeKeyPress: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    var viewercode = e.target.value;
    browserHistory.push('/' + viewercode)
  },

  render: function() {
      return (
          <div className="col-12" style={{padding: '0px'}}>
              <input id="input-viewercode" className="text-input dark" style={{maxWidth: '120px', minWidth: '100px'}} onKeyPress={this._onCodeKeyPress} placeholder="eg. lt6x"/>
              <button className="submit-button dark" onClick={this._onClick}>
                  View Slides
              </button>
          </div>
      );
  }

});

export default ViewercodeInput