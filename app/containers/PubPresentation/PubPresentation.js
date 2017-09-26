import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { NonIdealState } from '@blueprintjs/core';

import NoMatch from 'containers/NoMatch/NoMatch';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubBody from 'components/PubBody/PubBody';
import License from 'components/License/License';
import Footer from 'components/Footer/Footer';
import { getPubData } from 'actions/pub';

import PubPresentationLoading from './PubPresentationLoading';

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
		const pubData = this.props.pubData.data || { versions: [] };
		if (this.props.pubData.isLoading) { return <PubPresentationLoading />; }

		if (!pubData.id) { return <NoMatch />; }
		if (!pubData.versions.length) {
			return (
				<div className={'no-snapshots-wrapper'}>
					<NonIdealState
						title={'No Published Snapshots'}
						visual={'pt-icon-issue'}
						description={'This URL presents published snapshots. Go to Collaborate mode to continue.'}
						action={<Link to={`/pub/${this.props.match.params.slug}/collaborate`} className={'pt-button pt-intent-primary'}>Collaborate</Link>}
					/>
				</div>
			);
		}

		const versionQuery = undefined;
		let activeVersion;
		pubData.versions.sort((foo, bar)=> {
			if (foo.createdAt < bar.createdAt) { return 1; }
			if (foo.createdAt > bar.createdAt) { return -1; }
			return 0;
		}).forEach((item, index)=> {
			if (!versionQuery && index === 0) { item.isActive = true; activeVersion = item; }
			if (versionQuery && versionQuery === item.id) { item.isActive = true; activeVersion = item; }
		});

		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>{pubData.title}</title>
				</Helmet>

				<PubPresHeader
					title={pubData.title}
					description={pubData.description}
					backgroundImage={pubData.useHeaderImage ? pubData.avatar : undefined}
				/>


				<PubPresDetails
					slug={pubData.slug}
					numDiscussions={pubData.discussions.length}
					numSuggestions={pubData.discussions.reduce((prev, curr)=> {
						if (curr.suggestions) { return prev + 1; }
						return prev;
					}, 0)}
					collaborators={pubData.contributors}
					versions={pubData.versions}
				/>

				{/* <PubBody content={this.props.pubData.data.body} /> */}
				<PubBody content={activeVersion.content} />

				<div className={'license-wrapper'}>
					<License />
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
