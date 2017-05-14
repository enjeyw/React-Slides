import React from 'react';
import { browserHistory, Link } from 'react-router'

var StartPresButton = React.createClass({

    render: function () {
        return (
            <div className="Row">
                <Link to={'/admin/' + this.props.admin_hash + '/present'}>
                    <div className="submit-button light col-md-6">
                       <h3 style={{marginBottom: 0}}><img className="logo-image" src="/static/css/wand_white.svg"></img>  Go Present!</h3>
                    </div>
                </Link>
                <div className="Row">
                    Your slides will be kept live for a week.
                </div>
            </div>
        )
    }
});


export default StartPresButton
