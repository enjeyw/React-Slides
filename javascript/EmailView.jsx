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
    var input = document.getElementById('input-email');
    var email = input.value;
    this.props.postEmail(email)
  },

  _onEmailKeyPress: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    var email = e.target.value;
    this.props.postEmail(email)
  },

  render: function() {
      return (
          <div>
              <div className="row">
                    <div className="col-12">
                        <p> Please provide your email below so that we can send you an administration link. </p>
                    </div>
              </div>
              <div className="row">
                  <div className="col-12" style={{marginBottom: '20px'}}>
                      <input id="input-email" type="email" className="text-input light" style={{width: '350px'}} onKeyPress={this._onEmailKeyPress} placeholder="Enter your email here" />
                      <button className="submit-button light" onClick={this._onClick}>
                          Submit
                      </button>
                  </div>
              </div>
          </div>
      );
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(EmailView)