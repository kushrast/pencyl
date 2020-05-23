import React, { Component } from 'react';
const axios = require('axios').default;
import "./css/login.css";

class LoginComponent extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate(prevProps) {
		var component = this;
		var element = document.getElementById("login-button");

		if (prevProps.googleAuth == null || this.props.googleAuth != null) {
			this.props.googleAuth.attachClickHandler(element, {},
			    function(googleUser) {
			    	console.log(googleUser.getAuthResponse().id_token);
			    	axios({
			    		method: "post",
			    		url: "/v2/authenticate",
			    		data: googleUser.getAuthResponse().id_token
			    	})
			    	.then(function(response) {
						if (response.status === 200) {
							if (response.data.error != "") {
								alert(JSON.stringify(response.data.error, undefined, 2));
							} else {
							component.props.saveUserData(response.data.userId, response.data.userEmail);
							component.props.history.push("/");
							}
						} else {
							alert(JSON.stringify(response.data.error, undefined, 2));
						}
					}).catch(function(err) {
						console.log(err);
						alert(JSON.stringify(err, undefined, 2));
					});
			    }, function(error) {
			      alert(JSON.stringify(error, undefined, 2));
			});
		}
	}

  render() {
  	return (
	  	<div className="login-container">
	  	  		{ this.props.googleAuth != null ?
	  		<div className="login-box">
		  		<div class="login-logo-row"><img className="login-logo" src="/img/logo_color_transparent.png" alt="Menu Logo" /></div>
		  		<div className="login-title">Pencyl</div>
		  		<div className="login-subtitle"> Keep track of your thoughts. </div>
		  		<div class="login-button g-signin" id="login-button"><img className="login-google-logo" src="/img/google_logo.svg"/> Sign in with Google</div>
		  	</div>
		  	: null }
	  	</div>
  	);
  }
}
export default LoginComponent;