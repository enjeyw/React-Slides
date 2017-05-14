import React from 'react';
import { connect } from 'react-redux';
import { postPreRegEmail } from './actions.js'


const mapStateToProps = (state) => {
    return {
        hasErrored: state.postEmailPreRegHasErrored,
        success: state.postEmailPreRegSuccess
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postPreRegEmail: (email) => dispatch(postPreRegEmail(email))
    };
};

var EmailPreReg = React.createClass({

  _onClick: function(){
    var input = document.getElementById('input-email');
    var email = input.value;
    this.props.postPreRegEmail(email)
  },

  _onEmailKeyPress: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    var email = e.target.value;
    this.props.postPreRegEmail(email)
  },

  render: function() {
      return (
          <div className="row">
              <div className="col-12" style={{marginBottom: '20px'}}>
                  <input id="input-email" type="email" className="text-input light" style={{width: '350px'}} onKeyPress={this._onEmailKeyPress} placeholder="Enter your email here" />
                  <button className="submit-button light" onClick={this._onClick}>
                      Submit
                  </button>
              </div>
          </div>
      );
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(EmailPreReg)