import React from 'react';
import { connect } from 'react-redux';
import { uploadpresentation, postEmailSkipped, presuploadSendDataSuccess, postEmailLoading } from './actions.js'
import { browserHistory, Link } from 'react-router'
import store from './index.jsx'
import EmailView from './EmailView.jsx'
import ViewercodeInput from './ViewercodeInput.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'
import DemoButton from './DemoButton.jsx'

import request from 'superagent';

const mapStateToProps = (state) => {
    return {
        admin_hash: state.presupload,
        uploadHasErrored: state.presuploadHasErrored,
        isLoading: state.presuploadIsLoading,
        percent_uploaded: state.presuploadPercentUploaded,
        emailSuccess: state.postEmailSuccess,
        emailSkipped: state.postEmailSkipped,
        emailLoading: state.postEmailLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadpres: (file) => dispatch(uploadpresentation(file)),
        set_skipped: (skipped) => dispatch(postEmailSkipped(skipped)),
        reset: () => {
            dispatch(presuploadSendDataSuccess(''));
            dispatch(postEmailLoading(false))
        }
    };
};

var UploadView = React.createClass({

  _onClick: function(e){
    var input = document.getElementById('file-input');
    var file = input.files[0];
    this.props.uploadpres(file);
    //this.uploadfile(file);
  },

  _skipEmail: function(e){
    this.props.set_skipped(true);
  },

  componentWillMount: function() {
      this.props.reset()
  },

  componentDidUpdate: function() {
      if (this.props.admin_hash != '' && (this.props.emailSkipped || this.props.emailSuccess)) {
          browserHistory.push('/admin/' + this.props.admin_hash)
      }
  },

  render: function(){
    let button = null;
    if (this.props.isLoading == false) {
      button = <div className="row">
                    <div className="col-12">
                      <UploadButton onClick = {this._onClick}/>
                      <DemoButton/>
                    </div>
               </div>
    } else {
      button = <div></div>
    }

      if (this.props.percent_uploaded < 99) {
          var loading_text = (<div>
            <p>Upoading</p>
            <p>{Math.round(this.props.percent_uploaded)}%</p>
          </div>);
      } else {
          var loading_text = (<div>
            <p>Processing</p>
          </div>);
      }

    if (this.props.uploadHasErrored) {
        return (
            <div>
                <div className="cover-heading">
                    <p className="error"> Oh no, an error :( </p>
                    <p className="error"> Please get in contact at <a href="mailto:nick@slidecast.io"> nick@slidecast.io</a>  </p>
                </div>
            </div>
        );
    } else if (this.props.admin_hash == '' && this.props.isLoading == false) {

        return (
            <div>
                <div className="cover-heading">
                    <h1>
                        Present using anyone's screen!
                    </h1>
                    <p> No Projector? No problem! Slidecast allows you to present on multiple devices - when you change slide on your device, everyone else's will too.</p>
                </div>
                {button}

                <div className="mastfoot">
                    <h4>
                        Have a viewer code?
                    </h4>
                    <ViewercodeInput/>
                </div>
            </div>
        );
    } else if (this.props.emailSkipped || this.props.emailSuccess || this.props.emailLoading) {
        return (
            <div>
                <div className="cover-heading">
                </div>
                <LoadingSpinner loadingText={loading_text}/>
            </div>
        );
    } else {
        return (
            <div>
                <div className="cover-heading">
                </div>
                <EmailView/>
            </div>
        );
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
                        Try with your slides
                    </label>
                    <p className="filetypes-text">
                        (ppt, pdf etc)
                    </p>
            </div>
        )
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadView)

                        //<span className="fa fa-paper-plane-o uploadIcon"></span>

                    //<p style={{margin: '0px'}}><i> Enter it here: </i></p>
