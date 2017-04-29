import React from 'react';
import { connect } from 'react-redux';
import { uploadpresentation } from './actions.js'
import { browserHistory, Link } from 'react-router'

import request from 'superagent';

const mapStateToProps = (state) => {
    return {
        admin_hash: state.presupload,
        hasErrored: state.presuploadHasErrored,
        isLoading: state.presuploadIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadpres: (file) => dispatch(uploadpresentation(file))
    };
};

var UploadView = React.createClass({

  _onClick: function(e){
    var input = document.getElementById('file-input');
    var file = input.files[0];
    this.props.uploadpres(file);
    //this.uploadfile(file);
  },

  render: function(){
    let button = null;
    if (this.props.isLoading == false) {
      button = <UploadButton onClick = {this._onClick}/>
    } else {
      button = <div></div>
    }

    if (this.props.admin_hash == '' && this.props.isLoading == false) {

        return (
            <div>
                <div className="cover-heading">
                    <h1>
                        Present using anyone's screen!
                    </h1>
                    <p> No Projector? No problem! Slidecast allows you present on multiple devices - when you change slide on your device, everyone else's will too.</p>
                </div>
                {button}
            </div>
        );
    } else{
        return (<div className="cover-heading">
            <div className="loading"></div>
            <p>Loading...</p>
        </div>)
    }
  }

});

var UploadButton = React.createClass({
    render: function() {
        return (
            <div>
                    <input type="file" name='file' id="file-input" className="inputfile"
                           onChange={this.props.onClick}></input>
                    <label htmlFor="file-input">
                        <span className="fa fa-paper-plane-o uploadIcon"></span> Try with your slides
                    </label>
                    <p className="filetypes-text">
                        (ppt, pdf etc)
                    </p>
            </div>
        )
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadView)