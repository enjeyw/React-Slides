import React from 'react';
import { connect } from 'react-redux';
import { imagesFetchData, RECEIVE_SWITCH } from './actions.js'

import request from 'superagent';
import ReactSwipe from 'react-swipe';

import { subscribe, unsubscribe } from 'pusher-redux';


const mapStateToProps = (state) => {
    return {
        images: state.images,
        imagesHasErrored: state.imagesHasErrored,
        imagesIsLoading: state.imagesIsLoading,
        slideIndex: state.recieveswitch
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (hash) => dispatch(imagesFetchData(hash))
    };
};

var ViewerSlidesContainer = React.createClass({
  swipe_options: function() {
      var swipeOptions = {
          continuous: true,
          disableScroll: true
      };

      return swipeOptions
  },

  subscribe: function() {
    subscribe(this.props.viewerHash, 'slide_index', RECEIVE_SWITCH);
  },

  unsubscribe: function() {
    unsubscribe(this.props.viewerHash, 'slide_index', RECEIVE_SWITCH);
  },

  componentWillMount: function() {
    this.subscribe();
  },

  componentDidMount: function() {
      this.props.fetchData(this.props.viewerHash);
  },

  componentWillUnmount() {
    this.unsubscribe();
  },

  render: function() {
      if (this.props.imagesHasErrored) {
          return <p>Sorry! There was an error loading the items</p>;
      }
      if (this.props.imagesIsLoading) {
          return <p>Loading…</p>;
      }
      return (
          <div>
              <div>{this.props.slideIndex}</div>
          <ViewerSlides images={this.props.images} swipeOptions = {this.swipe_options()} slideIndex = {this.props.slideIndex} />
          </div>
      );
  }
});

var ViewerSlides = React.createClass({

  getInitialState: function() {
    return {
      Fullscreen: false
    };
  },

  componentDidUpdate: function() {
      this.refs.reactSwipe.slide(this.props.slideIndex,400);
  },

  _toggle_screen: function(e) {
      this.setState({
          Fullscreen: this.state.Fullscreen = !this.state.Fullscreen
      })
  },

  render: function() {
      if (this.props.images.length != 0) {

          var slideClassName = "slideimage-contain";
          var togglebuttonClassName = "fa fa-expand fa-lg";
          if (this.state.Fullscreen) {
              slideClassName = "slideimage-cover";
              togglebuttonClassName = "fa fa-compress fa-lg";
          }

          var image_list = this.props.images.map(function (image) {
              return (
                  <div className="slides" key={"slide_" + image[0] }>
                      <img className={slideClassName}  src={image[1]}/>
                  </div>
              )
          });

          return (
              <div className="SlideContainer">
                  <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={this.props.swipeOptions}>
                    {image_list}
                  </ReactSwipe>
                  <a className="fullscreen_toggle" onClick={this._toggle_screen}><i className={togglebuttonClassName}></i></a>

              </div>

          );
      } else{
          return (<div></div>);
      }
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(ViewerSlidesContainer)
