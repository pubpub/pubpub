import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubBody from 'components/PubBody/PubBody';
import Footer from 'components/Footer/Footer';

import { getPubData } from 'actions/pub';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	componentWillMount() {
		this.props.dispatch(getPubData(this.props.match.params.slug));
	}

	render() {
		const pubData = this.props.pubData.data || {};
		if (!pubData.id) { return <p>Loading</p>; }

		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>{pubData.title}</title>
				</Helmet>

				<PubPresHeader
					title={pubData.title}
					description={pubData.description}
					backgroundImage={pubData.headerImage}
				/>


				<PubPresDetails
					slug={pubData.slug}
					numDiscussions={pubData.discussions.length}
					numSuggestions={pubData.discussions.reduce((prev, curr)=> {
						if (curr.suggestions) { return prev + 1; }
						return prev;
					}, 0)}
					collaborators={pubData.contributors}
					// versions={pubData.versions}
					versions={[]}
				/>

				{/* <PubBody content={this.props.pubData.data.body} /> */}
				<PubBody content={<div>this.props.pubData.data.body</div>} />

				<div className={'license-wrapper'}>
					CCBY 4.0
				</div>

				<Footer />
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({
	pubData: state.pub
}))(PubPresentation));
