import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import CommunityPreview from 'components/CommunityPreview/CommunityPreview';
import Footer from 'components/Footer/Footer';
import { getAllCommunities } from 'actions/explore';


require('./explore.scss');

const propTypes = {
	exploreData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Explore extends Component {
	componentWillMount() {
		this.props.dispatch(getAllCommunities());
	}

	render() {
		const exploreData = this.props.exploreData.data || {};
		const allCommunities = exploreData.allCommunities || [
			{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
		];

		return (
			<div className={'explore-wrapper'}>
				<Helmet>
					<title>Explore</title>
				</Helmet>

				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Explore PubPub Communities</h1>
							<div className={'details'}>Communities are groups focused on a particular topic, theme, or expertise. While their focus may be narrow, they invite perspective and contribution from all.</div>
						</div>


						{allCommunities.filter((item)=> {
							return item.numDiscussions;
						}).sort((foo, bar)=> {
							if (foo.title < bar.title) { return -1; }
							if (foo.title > bar.title) { return 1; }
							return 0;
						}).map((item)=> {
							return (
								<div className={'col-4'} key={`active-${item.id}`}>
									<CommunityPreview
										subdomain={item.subdomain}
										domain={item.domain}
										title={item.title}
										description={item.description}
										largeHeaderBackground={item.largeHeaderBackground}
										largeHeaderLogo={item.largeHeaderLogo}
										accentColor={item.accentColor}
										accentTextColor={item.accentTextColor}
										numPubs={item.numPubs}
										numDiscussions={item.numDiscussions}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

Explore.propTypes = propTypes;
export default withRouter(connect(state => ({
	exploreData: state.explore,
}))(Explore));
