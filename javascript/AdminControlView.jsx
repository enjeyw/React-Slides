import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router'

import ClipboardButton from 'react-clipboard.js'

import Header from './Header.jsx'
import StartPresButton from './StartPresButton.jsx'
import SharePresModule from './SharePresModule.jsx'


var AdminControlView = React.createClass({
    render: function () {
        var admin_hash = this.props.location.pathname.slice(7,)
        return (
            <div className="site-wrapper-inner">
                <div className="cover-container container">
                    <Header />
                    <div className="cover-heading">
                        <h2>
                            We're ready!
                        </h2>
                    </div>
                    <SharePresModule admin_hash={admin_hash}/>
                    <StartPresButton admin_hash={admin_hash}/>
                </div>
            </div>
        )
    }
});

export default AdminControlView;
