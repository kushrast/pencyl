const ReactDOM = require('react-dom');
const client = require('./client');
const ThoughtCard = require('./ThoughtCard');

class App extends React.Component {

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