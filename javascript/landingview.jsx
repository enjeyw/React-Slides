import React from 'react';

var LandingView = React.createClass({
  render: function() {

    return (
      <div className="site-wrapper-inner">
        <div className="cover-container container">
            <div className="cover-heading">
                <h1>
                    Present using anyone's screen!
                </h1>
                <p> No Projector? No problem! Slidecast allows you to present on multiple devices - when you change slide on your device, everyone else's will too.</p>
            </div>
        </div>
      </div>
    );
  }

});

export default LandingView;

