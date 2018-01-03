import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/labs';
import Avatar from 'components/Avatar/Avatar';
import { apiFetch } from 'utilities';

require('./userAutocomplete.scss');

const propTypes = {
	onSelect: PropTypes.func,
	placeholder: PropTypes.string,
	usedUserIds: PropTypes.array,
	allowCustomUser: PropTypes.bool,
};

const defaultProps = {
	onSelect: ()=>{},
	placeholder: 'Search for users...',
	usedUserIds: [],
	allowCustomUser: false,
};

class UserAutocomplete extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			value: '',
		};
		this.filterItems = this.filterItems.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}

	filterItems(evt) {
		const query = evt.target.value;
		this.setState({ value: query });
		apiFetch(`/api/search/users?q=${query}`)
		.then((result) => {
			const appendedResult = this.props.allowCustomUser && query
				? [
					{
						name: query,
					},
					...result,
				]
				: result;
			this.setState({
				items: appendedResult.filter((item)=> {
					return this.props.usedUserIds.indexOf(item.id) === -1;
				})
			});
		})
		.catch((error) => {
			console.log(error);
		});
	}

	handleSelect(data) {
		this.props.onSelect(data);
		this.setState({ value: '' });
	}


	render() {
		return (
			<div className="user-autocomplete-component">
				<Suggest
					className="input"
					items={this.state.items}
					inputProps={{
						value: this.state.value,
						onChange: this.filterItems,
						placeholder: this.props.placeholder,
						className: 'pt-large',
					}}
					inputValueRenderer={(item) => { return item.fullName; }}
					itemRenderer={({ item, handleClick, isActive })=> {
						return (
							<li key={item.id || 'empty-user-create'}>
								<a role="button" tabIndex={-1} onClick={handleClick} className={isActive ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
									{item.fullName && <Avatar userInitials={item.initials} userAvatar={item.avatar} width={25} />}
									{item.name && <span>Add collaborator named: </span>}
									<span className="autocomplete-name">{item.name || item.fullName}</span>
								</a>
							</li>
						);
					}}
					onItemSelect={this.handleSelect}
					noResults={<MenuItem disabled text="No results" />}
					popoverProps={{ popoverClassName: 'pt-minimal user-autocomplete-popover' }}
				/>
			</div>
		);
	}
}

UserAutocomplete.propTypes = propTypes;
UserAutocomplete.defaultProps = defaultProps;
export default UserAutocomplete;
