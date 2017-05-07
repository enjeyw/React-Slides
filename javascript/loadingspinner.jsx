import React from 'react';

var LoadingSpinner = React.createClass({
    render: function() {
        return (
            <div className="Loading_Spinner">
                <div className="spinner-inner">
                    <div className="spinner_rings"></div>
                    <div className="spinner_text">
                        {this.props.loadingText}
                    </div>
                </div>
            </div>
        )
    }
});

export default LoadingSpinner
