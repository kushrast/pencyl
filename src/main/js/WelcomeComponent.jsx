import React, { Component } from 'react';

import "./css/welcome.css";

class WelcomeComponent extends Component {

  render() {
  	return (
		<div class="welcome-card">
			<div>
				Welcome to Pencyl!
			</div>

			<div style={{marginTop:"30px"}}>
				Pencyl is an application that helps you take notes and reflect on your past thoughts. Unlike other note applications, Pencyl will periodically give you a gentle nudge to review your previous entries by entering the <b>Reflect</b> mode. In Reflect mode, Pencyl uses an algorithm to find notes you haven’t seen or interacted with in a while, making sure that over time you get to see and interact with all of your previous thoughts. You can also access Reflect mode through the menu. Happy Notetaking!
			</div>

			<div style={{marginTop:"30px"}}>
				<div class="welcome-home inverted-button" onClick={this.props.finishedSignOnTutorial}>
					Got it!
				</div>
			</div>
		</div>
  	);
  }
}
export default WelcomeComponent;