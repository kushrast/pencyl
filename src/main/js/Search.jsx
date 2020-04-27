import React, { Component } from 'react';
import Select from 'react-select';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchQuery: "",
			searchOptions: [],
		}
	}

	updateSearchOptions = (newValue) => {
		if (newValue == "") {
			this.setState({
				searchOptions: [],
			})
			return;
		}

		this.setState({	
			searchOptions: 
				[
					{
						label:`'${newValue}'`, value: newValue, type: "regular"
					},
					{
					      label: "Tags",
					      options: [
					        { label: newValue, value: newValue, type: "tag" },
					      ]
					},				
					],
		});
	}

	onChange = (item, action) => {
		console.log(action);
		if (action.action === "select-option") {
			this.props.updateSearch(item[0], action);
		} else if (action.action === "remove-value") {
			this.props.updateSearch(action.removedValue, action);
		}
	}

  render() {

const customStyles = {
		container: (provided, state) => ({
			...provided,
			width: '300px',
		}),
		dropdownIndicator: (provided, state) => ({
			display: "none",
		}),
		control: (provided, state) => ({
			...provided,
			backgroundPosition: "right center",
			backgroundImage: "url(/img/magnifying_glass_mini.svg)",
			backgroundSize: "30px 30px",
			backgroundRepeat: "no-repeat",
			paddingRight: "30px",
			overflowX: "scroll",
			overflowY: "none",
			cursor: "text",
		}),
		placeholder: (provided, state) => ({
			...provided,
			color: '#DDDDDD',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '17px',
		}),
		input: (provided, state) => ({
			color: '#858585',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '17px',
			outline: 0,
		}),
		multiValue: (provided, state) => ({
			...provided,
			width: "auto",
			color: '#858585',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '17px',
			backgroundColor: '#FAFAFA', 
			backgroundPosition: state.data.type === "tag" ? "left center" : "none",
			backgroundImage: state.data.type === "tag" ? "url(/img/tag_mini.svg)" : "none",
			backgroundSize: state.data.type === "tag" ? "30px 30px" : "none",
			backgroundRepeat: state.data.type === "tag" ? "no-repeat" : "none",
			paddingLeft: state.data.type === "tag" ? "30px" : "none",
		}),
		indicatorsContainer: (provided, state) => ({
		}),
		option: (provided, state) => ({
			...provided,
			color:  state.isFocused ? '#5C8DD7' : '#858585',
			fontFamily: 'Roboto',
			fontWeight: '400',
			fontSize: '17px',
			background: state.isFocused ? '#F5F5F5' : '#FFFFFF',
			width: 'auto',
			cursor: 'pointer',
			backgroundPosition: "left center",
			backgroundImage: state.data.type === "tag" ? "url(/img/tag_mini.svg)" : "url(/img/magnifying_glass_mini_grey.svg)",
			backgroundSize: "30px 30px",
			backgroundRepeat: "no-repeat",
			paddingLeft: "40px",
			cursor: "pointer",
		}),
		group: (provided, state) => ({
			...provided,
			paddingBottom: "0px",
		})
	}

  	return (
	  	<div className="search-container">
	  		<Select styles={customStyles} placeholder="Search" options={this.state.searchOptions} isClearable={false} isSearchable={true} onInputChange={this.updateSearchOptions} isMulti={true} onChange={this.onChange} />
	  	</div>
  	);
  }
}
export default Search;