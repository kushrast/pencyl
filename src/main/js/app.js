import { Component } from 'react';
import ThoughtCard from './ThoughtCard.jsx';
import "./css/app.css";

const ReactDOM = require('react-dom');
const client = require('./client');

class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container">
				<ThoughtCard />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
);