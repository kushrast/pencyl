import { Component } from 'react';
import ThoughtCard from './ThoughtCard.jsx';

const ReactDOM = require('react-dom');
const client = require('./client');

class App extends Component {

	constructor(props) {
		super(props);
		// this.state = {employees: []};
	}

	// componentDidMount() {
	// 	client({method: 'GET', path: '/api/employees'}).done(response => {
	// 		this.setState({employees: response.entity._embedded.employees});
	// 	});
	// }

	render() {
		return (
			// <EmployeeList employees={this.state.employees}/>
			<ThoughtCard />
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
);