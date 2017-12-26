import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import CommunityPreview from 'components/CommunityPreview/CommunityPreview';
import Footer from 'components/Footer/Footer';
import { getActiveCommunities } from 'actions/explore';

require('./landing.scss');

const propTypes = {
	exploreData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Landing extends Component {
	componentWillMount() {
		this.props.dispatch(getActiveCommunities());
	}

	render() {
		const exploreData = this.props.exploreData.data || {};
		const activeCommunities = exploreData.activeCommunities || [
			{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
		];
		return (
			<div className={'landing'}>

				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Collaborative Community Publishing</h1>
							<div className={'subtitle'}>Build empowered communities of researchers to publish, review, organize, and progress towards discovery.</div>
							<div className={'action'}>
								<Link className={'pt-button pt-intent-primary pt-large'} to={'/signup'}>Join to Collaborate</Link>
							</div>

							<div className={'image-wrapper pt-elevation-3'}>
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-responsive-framed.png'} alt={'PubPub Community'} />
								{/*
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-viral-framed.png'} alt={'PubPub Community'} />
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-joi-framed.png'} alt={'PubPub Community'} />
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-plix-framed.png'} alt={'PubPub Community'} />
								*/}
							</div>

							<h2>Empowered Publishing</h2>
							<div className={'subtitle'}>Take control of your research and how it's communicated. Powerful tools to let you publish with and for your community.<br />Free to write, free to review, free to publish.</div>


						</div>

						<div className={'col-12'}>
							<h2>Explore Active Communities</h2>
						</div>

						{activeCommunities.map((item)=> {
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
						<div className={'col-12 explore-all-button'}>
							<Link to={'/explore'} className={'pt-button pt-intent-primary pt-large'}>Explore All Communities</Link>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default withRouter(connect(state => ({
	exploreData: state.explore,
}))(Landing));
