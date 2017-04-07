import React from 'react';
import request from 'superagent';
import $ from 'jquery';

var UploadView = React.createClass({
  parse_string_variables: function(string_setter) {
      return function(err, res) {
          var id_strings = $.parseJSON(res.text)['id_strings'];
          string_setter(id_strings)
      }
  },

  uploadfile: function(file){
      var req = request.post('/upload');
      req.attach('file', file);
      req.end(this.parse_string_variables(this.props.setIdStrings));
  },

  _onClick: function(e){
    var input = document.getElementById('file-input');
    var file = input.files[0];
    this.uploadfile(file);
  },

  render: function() {

    return (
        <div className="action-bar">
          <input type="file" id="file-input" className="input-message col-xs-10"></input>
          <div className="option col-xs-1 green-background send-message" onClick={this._onClick}>
              <span className="white light fa fa-paper-plane-o"></span>
          </div>
        </div>
    );
  }

});

export default UploadView;