import React from 'react';

var HomeView = React.createClass({

  getInitialState: function() {
    return {
      id_string: null
    };
  },

  setIdStrings: function (id_strings) {
    this.setState({
      string_dict: id_strings
    })
  },

  render: function() {
    return (
      <div>
        <UploadView setIdStrings={this.setIdStrings}/>
        <ShareView stringDict={this.state.string_dict}/>
      </div>
    );
  }

});

export default HomeView;