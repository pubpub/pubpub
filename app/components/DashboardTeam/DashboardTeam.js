import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';

require('./dashboardTeam.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	onAddAdmin: PropTypes.func,
	onRemoveAdmin: PropTypes.func,
};
const defaultProps = {
	onAddAdmin: ()=>{},
	onRemoveAdmin: ()=>{},
};

class DashboardTeam extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
		this.handleAdminAdd = this.handleAdminAdd.bind(this);
		this.handleAdminRemove = this.handleAdminRemove.bind(this);
	}
	handleAdminAdd(user) {
		this.props.onAddAdmin({
			userId: user.id,
			communityId: this.props.appData.id,
		});
	}
	handleAdminRemove(userId) {
		this.props.onRemoveAdmin({
			userId: userId,
			communityId: this.props.appData.id,
		});
	}

	render() {
		return (
			<div className={'dashboard-team'}>
				<h1 className={'content-title'}>Team</h1>
				<div className={'details'}>Add administrators to the team. Administrators will be able to publish documents, see private collections, and create new collections.</div>

				<div className={'autocomplete-wrapper'}>
					<UserAutocomplete
						onSelect={this.handleAdminAdd}
						placeholder={'Add new administrator...'}
					/>
				</div>

				{this.props.appData.admins.sort((foo, bar)=> {
					if (foo.fullName < bar.fullName) { return -1; }
					if (foo.fullName > bar.fullName) { return 1; }
					return 0;
				}).map((admin)=> {
					return (
						<div key={`admin-${admin.id}`} className={'admin-wrapper'}>
							<div className={'avatar-wrapper'}>
								<Link to={`/user/${admin.slug}`}>
									<Avatar width={50} userInitials={admin.initials} userAvatar={admin.avatar} />
								</Link>
							</div>

							<div className={'content'}>
								<div className={'name'}>
									<Link to={`/user/${admin.slug}`}>
										{admin.fullName}
									</Link>
								</div>
							</div>
							<div className={'remove-wrapper'}>
								<button className={'pt-button pt-minimal'} onClick={()=>{ this.handleAdminRemove(admin.id); }}>Remove</button>
							</div>

						</div>
					);
				})}
			</div>
		);
	}
}

DashboardTeam.propTypes = propTypes;
DashboardTeam.defaultProps = defaultProps;
export default DashboardTeam;
