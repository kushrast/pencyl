import React, { Component } from 'react';
import ThoughtCard from './ThoughtCard.jsx';
import ReactDOM from 'react-dom';
import "./css/app.css";
import client from './client';

class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container">
				<Icon />
				<ThoughtCard />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
);