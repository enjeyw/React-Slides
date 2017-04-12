import React from 'react';
import ReactSwipe from 'react-swipe';


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

export default AdminSlides