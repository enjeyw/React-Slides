import React from 'react';
import ReactSwipe from 'react-swipe';
import request from 'superagent';


export var AdminPresView = React.createClass({

  render: function() {
    return (
      <div>
        <SlideContainer viewerHash={this.props.presID.slice(0,4)} adminHash={this.props.presID}/>
      </div>
    );
  }

});

export var SlideContainer = React.createClass({
  getInitialState: function() {
    return {
      images: [],
      hasErrored: false,
      isLoading: false
    };
  },

  set_images: function(context) {
      return function(err, res) {
          if (err) {
              context.setState({ hasErrored: true });
              throw Error(err)
          } else {
              context.setState({
                  images: JSON.parse(res.text).images
              });
          }
      }
  },

  componentDidMount: function() {
      this.setState({ isLoading: true });

      var req = request.get('/imagess/' + this.props.viewerHash) ;
      req.end(this.set_images(this))
  },

render: function() {
    return (<Slides images={this.state.images} />);
}


});

export var Slides = React.createClass({

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
