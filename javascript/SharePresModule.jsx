import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router'

import ClipboardButton from 'react-clipboard.js'

var SharePresModule = React.createClass({

    getInitialState: function() {
        return {
          Message: " ",
          qr_image: <div></div>
        };
    },

    componentDidMount: function() {
        this.setState({
          qr_image: <img height="200" src={"https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://"
                             + window.location.hostname + '/' + this.props.admin_hash.slice(7,).slice(0,4)} width="200"></img>
        })
    },

    _onCPsuccess: function(e) {
        this.setState({
          Message: "Viewer link copied to clipboard"
        })
    },

    _OnQRclick: function() {
        this.setState({
          Message: this.state.qr_image
        })
    },

    render: function () {
        if (typeof window.orientation !== 'undefined') {
            var whatsapp = (
                <a href={"whatsapp://send?text=Here's the link to my slides: https://"
                         + window.location.hostname + '/' + this.props.admin_hash.slice(0,4)}
                   data-action="share/whatsapp/share">
                    <div className="submit-button light">
                                            <span className="fa fa-whatsapp"></span>
                    </div>
                </a>
            )
        } else {
            var whatsapp = ""
        }

        return (
            <div className="Row">
                <div className="ShareBox col-md-6">
                    <h4> Viewer Code: </h4>
                    <h2><b> {this.props.admin_hash.slice(0,4)} </b></h2>

                    <p> People can view your slides live by going to slidecast.io and entering the code above.</p>
                    <p> Alternatively, share this link:</p>
                    <p>
                        <Link to={'/' + this.props.admin_hash.slice(0,4)}>
                            {window.location.hostname + '/' + this.props.admin_hash.slice(0, 4)}
                        </Link>
                    </p>
                    <div className="row">
                        <div className="col-12">
                            <a href={"mailto:?subject=I'm presenting my slides live on Slidecast&body=Click on this link to view them: https://"
                                        + window.location.hostname + '/' + this.props.admin_hash.slice(0,4)
                                    }>
                                <div className="submit-button light">
                                    <span className="fa fa-envelope-o"></span>
                                </div>
                            </a>

                            <ClipboardButton component="a" button-href="#" data-clipboard-text={"https://" +
                                                                  window.location.hostname +
                                                                  '/' + this.props.admin_hash.slice(0,4)} onSuccess={this._onCPsuccess}>

                                <div className="submit-button light">
                                    <span className="fa fa-clipboard"></span>
                                </div>
                            </ClipboardButton>

                            <div className="submit-button light" onClick={this._OnQRclick}>
                                    <span className="fa fa-qrcode"></span>
                            </div>
                            {whatsapp}
                        </div>
                    </div>
                    <div className="MessageBox">
                        {this.state.Message}
                    </div>
                </div>
            </div>
        );
    }

});

export default SharePresModule
