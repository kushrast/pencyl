import React, { Component } from 'react';
import Icon from './Icon.jsx';
import ThoughtCard from './ThoughtCard.jsx';
import ReactDOM from 'react-dom';
import client from './client';
import "./css/app.css";

class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container">
				<Icon />
				<ThoughtCard/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
);