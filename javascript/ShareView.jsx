import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router'


//const mapStateToProps = (state) => {
//    return {
//        admin_hash: state.presupload,
//        hasErrored: state.presuploadHasErrored,
//        isLoading: state.presuploadIsLoading
//    };
//};
//
//const mapDispatchToProps = (dispatch) => {
//    return {
//        uploadpres: (file) => dispatch(uploadpresentation(file))
//    };
//};


var ShareView = React.createClass({

    render: function () {
            var admin_hash = this.props.location.pathname.slice(7,);
            return (
                 <div className="site-wrapper-inner">
                    <div className="cover-container container">
                        <div className="cover-heading">
                            <h1>
                                We're good to go
                            </h1>
                        </div>
                        <div className="Row">
                            <div className="Sharelink col-md-6">
                                <h3> Viewer Link </h3>
                                <p> Share this link to allow people to view the slides on their device:</p>
                                <p>
                                    <Link to={'/' + admin_hash.slice(0,4)}>
                                        {window.location.hostname + '/' + admin_hash.slice(0, 4)}
                                    </Link>
                                </p>
                                <div className="sharelinks">
                                    <p>
                                        <a href={"mailto:?subject=Check out my presentation&body=Just follow this link: https://"
                                                    + window.location.hostname + '/' + admin_hash.slice(0,4)
                                                }>
                                            <span className="fa fa-envelope-o fa-3x"></span>
                                        </a>

                                    </p>

                                </div>
                            </div>
                        </div>
                        <div className="Row">
                            <div className="Sharelink col-md-6">
                                <Link to={'/admin/' + admin_hash + '/present'}>
                                    <h3>  <span className="pe-7s-magic-wand"></span> Go Present!</h3>
                                    {window.location.hostname + '/admin/' + admin_hash + '/present'}
                                </Link>

                            </div>
                            <div className="Row">
                                Your slides will be kept for 4 weeks.
                            </div>
                        </div>
                    </div>
                 </div>
            );
    }

});

//export default connect(mapStateToProps, mapDispatchToProps)(ShareView);
export default ShareView;