import React from 'react';
import request from 'superagent';
import { connect } from 'react-redux';
import { imagesFetchData } from './actions.js'

import Slides from './Slides.jsx'



const mapStateToProps = (state) => {
    return {
        images: state.images,
        hasErrored: state.itemsHasErrored,
        isLoading: state.itemsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (hash) => dispatch(imagesFetchData(hash))
    };
};

var SlidesContainer = React.createClass({

  componentDidMount: function() {
      this.props.fetchData('5GDy');
  },

  render: function() {
      if (this.props.hasErrored) {
          return <p>Sorry! There was an error loading the items</p>;
      }
      if (this.props.isLoading) {
          debugger;
          return <p>Loading…</p>;
      }
      return (<Slides images={this.props.images} />);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlidesContainer)
