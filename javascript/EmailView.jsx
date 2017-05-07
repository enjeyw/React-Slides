import React from 'react';
import { connect } from 'react-redux';
import { postEmail } from './actions.js'


const mapStateToProps = (state) => {
    return {
        hasErrored: state.postEmailHasErrored,
        success: state.postEmailSuccess
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postEmail: (email) => dispatch(postEmail(email))
    };
};

var EmailView = React.createClass({

  _onClick: function(){
    var input = document.getElementById('input-name');
    var email = input.value;
    this.props.postEmail(email)
  },

  _onName: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    var email = e.target.value;
    this.props.postEmail(email)
  },

  render: function() {
      return (
          <div style={{marginTop: '20px'}}>
              <input id="input-name" className="swish-input" style={{width: '350'}} onKeyPress={this._onName} placeholder="Enter your email here" />
              <button className="bright-blue-hover btn-white" onClick={this._onClick} id="try-it-out">
                  Submit Email
              </button>
          </div>
      );
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(EmailView)