import React from 'react';
import { connect } from 'react-redux';
import { imagesFetchData, sendswitch } from './actions.js'

import request from 'superagent';
import ReactSwipe from 'react-swipe';

//import AdminSlides from './AdminSlidesView.jsx'

const mapStateToProps = (state) => {
    return {
        images: state.images,
        imagesHasErrored: state.imagesHasErrored,
        imagesIsLoading: state.imagesIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (hash) => dispatch(imagesFetchData(hash)),
        sendSwitch: (channel, slide_index) => dispatch(sendswitch(channel, slide_index))
    };
};

var AdminSlidesContainer = React.createClass({

  componentDidMount: function() {
      this.props.fetchData(this.props.viewerHash);
  },


  swipe_callback: function (index, elem) {
      this.props.sendSwitch(this.props.viewerHash, index)
  },

  swipe_options: function() {
      var swipeOptions = {
          continuous: true,
          disableScroll: false,
          callback: this.swipe_callback
      };

      return swipeOptions
  },

  render: function() {
      if (this.props.imagesHasErrored) {
          return <p>Sorry! There was an error loading the items</p>;
      }
      if (this.props.imagesIsLoading) {
          return <p>Loading…</p>;
      }
      return (<AdminSlides images={this.props.images} swipeOptions = {this.swipe_options()}  />);
  }
});

var AdminSlides = React.createClass({

  _next: function(e) {
    this.refs.reactSwipe.next();
  },

  _prev: function(e) {
    this.refs.reactSwipe.prev();
  },

  render: function() {
      if (this.props.images.length != 0) {
          var image_list = this.props.images.map(function (image) {
              return (
                  <div className="slide" key={"slide_" + image[0] }>
                      <img src={image[1]}/>
                  </div>
              )
          });

          return (
              <div>
              <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={this.props.swipeOptions}>
                {image_list}
              </ReactSwipe>
              <div>
                <button type="button" onClick={this._prev}>Prev</button>
                <button type="button" onClick={this._next}>Next</button>
              </div>
              </div>

          );
      } else{
          return (<div></div>);
      }
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminSlidesContainer)
