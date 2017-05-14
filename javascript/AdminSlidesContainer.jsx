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
      this.props.sendSwitch(this.props.adminHash, index)
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

  getInitialState: function() {
    return {
      Fullscreen: false
    };
  },

  componentWillMount:function(){
     document.addEventListener("Keydown", this._handleKeyDown, false);
  },

  componentWillUnmount: function() {
     document.removeEventListener("Keydown", this._handleKeyDown, false);
  },

  _handleKeyDown:function(event){
        if (event.keyCode == 39){
          this._next()
        } else if (event.keyCode == 37) {
          this._prev()
        }
  },

  _next: function(e) {
    this.refs.reactSwipe.next();
  },

  _prev: function(e) {
    this.refs.reactSwipe.prev();
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
                  <div>
                      <a className="prev change_slide_button" onClick={this._prev}><i className="fa fa-angle-left fa-2x"></i></a>
                      <a className="next change_slide_button" onClick={this._next}><i className="fa fa-angle-right fa-2x"></i></a>
                  </div>
                  <a className="fullscreen_toggle" onClick={this._toggle_screen}><i className={togglebuttonClassName}></i></a>
                  <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={this.props.swipeOptions}>
                    {image_list}
                  </ReactSwipe>
              </div>

          );
      } else{
          return (<div></div>);
      }
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(AdminSlidesContainer)
