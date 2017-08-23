import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PubHeader from 'components/PubHeader/PubHeader';
import PubDetails from 'components/PubDetails/PubDetails';
import PubBody from 'components/PubBody/PubBody';
import Footer from 'components/Footer/Footer';

import { getPubData } from 'actions/pub';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	componentWillMount() {
		this.props.dispatch(getPubData(this.props.match.params.slug));
	}

	render() {
		if (!this.props.pubData.data) { return <p>Loading</p>; }

		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>Pub</title>
				</Helmet>

				<PubHeader
					title={'Soundscapes'}
					description={this.props.pubData.data.pub.description}
					backgroundImage={'/dev/pubHeader3.jpg'}
				/>

				<PubDetails
					collaborators={this.props.pubData.data.collaborators}
					pubData={this.props.pubData.data.pub}
					versions={this.props.pubData.data.versions}
				/>

				<PubBody content={this.props.pubData.data.body} />

				<div className={'license-wrapper'}>
					CCBY 4.0
				</div>
				<Footer />
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app, pubData: state.pub }))(PubPresentation));
