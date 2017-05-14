import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router'

import ClipboardButton from 'react-clipboard.js'

import Header from './Header.jsx'
import StartPresButton from './StartPresButton.jsx'
import SharePresModule from './SharePresModule.jsx'


var DemoAdminControlView = React.createClass({
    render: function () {
        var admin_hash = this.props.location.pathname.slice(7,);
        return (
            <div className="site-wrapper-inner">
                <div className="cover-container container">
                    <Header />
                    <div className="cover-heading">
                        <h2>
                            Here's a demo, just for you.
                        </h2>
                        <p> Go to Slidecast.io on another device (or just another tab), and enter the Viewer Code below.
                            Then when you're ready, press "Go Present".</p>
                    </div>
                    <SharePresModule admin_hash={admin_hash}/>
                    <StartPresButton admin_hash={admin_hash}/>
                </div>
            </div>
        )
    }
});

export default DemoAdminControlView;
