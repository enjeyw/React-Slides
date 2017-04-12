import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'


const mapStateToProps = (state) => {
    return {
        admin_hash: state.presupload,
        hasErrored: state.presuploadHasErrored,
        isLoading: state.presuploadIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadpres: (file) => dispatch(uploadpresentation(file))
    };
};


var ShareView = React.createClass({

  render: function() {
      if (this.props.isLoading) {
          return <p>Loading…</p>;
      } else if (this.props.admin_hash == '') {
        return (
            <div>

            </div>
        )
      } else {
        return (
          <div>
              <Link to={'admin/' + this.props.admin_hash}>Admin link</Link>
          </div>
        );
      }
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(ShareView);