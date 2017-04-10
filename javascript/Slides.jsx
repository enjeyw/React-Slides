import React from 'react';
import ReactSwipe from 'react-swipe';

var Slides = React.createClass({

  render: function() {
      if (this.props.images.length != 0) {
          var image_list = this.props.images.map(function (image) {
              return (
                  <div className="slide" id={"slide_" + image[0] } key={image[0]}>
                      <img src={image[1]}/>
                  </div>
              )
          });

          return (

              <ReactSwipe className="carousel" swipeOptions={{continuous: false}}>
                {image_list}
              </ReactSwipe>

          );
      } else{
          return (<div></div>);
      }
  }
});

export default Slides