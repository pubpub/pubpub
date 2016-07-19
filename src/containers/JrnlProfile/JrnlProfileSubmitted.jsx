import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';
import dateFormat from 'dateformat';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileSubmitted = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleFeatureAtom: PropTypes.func,
		handleRejectAtom: PropTypes.func,
	},

	getInitialState: function() {
		return {
			confirmFeature: null,
			confirmReject: null,
		};
	},

	componentWillReceiveProps(nextProps) {
		this.cancelConfirm();
	},

	featureAtom: function(id) {
		this.props.handleFeatureAtom(id);
	},
	rejectAtom: function(id) {
		this.props.handleRejectAtom(id);
	},

	setConfirmFeature: function(id) {
		this.setState({confirmFeature: id, confirmReject: null});
	},

	setConfirmReject: function(id) {
		this.setState({confirmFeature: null, confirmReject: id});
	},

	cancelConfirm: function(id) {
		this.setState({confirmFeature: null, confirmReject: null});
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const submittedData = safeGetInToJS(this.props.jrnlData, ['submittedData']) || [];
		const metaData = {
			title: 'Submitted · ' + jrnlData.jrnlName,
		};

		return (
			<div>
				<Helmet {...metaData} />				

				{
					submittedData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						let buttons = [ 
							{ type: 'button', text: 'Feature', action: this.setConfirmFeature.bind(this, item.source._id) }, 
							{ type: 'button', text: 'Reject', action: this.setConfirmReject.bind(this, item.source._id) }
						];

						if (this.state.confirmFeature === item.source._id) {
							buttons = [ 
								{ type: 'button', text: 'Cancel Feature', action: this.cancelConfirm.bind(this, item.source._id) },
								{ type: 'button', text: 'Confirm Feature', action: this.featureAtom.bind(this, item.source._id) }
							];
						}

						if (this.state.confirmReject === item.source._id) {
							buttons = [ 
								{ type: 'button', text: 'Confirm Reject', action: this.rejectAtom.bind(this, item.source._id) },
								{ type: 'button', text: 'Cancel Reject', action: this.cancelConfirm.bind(this, item.source._id) }
							];
						}

						return (
							<div style={[item.inactive && styles.inactive]} key={'submitted-' + index} className={index === 0 && 'firstChildNoTopMargin'}>
								<PreviewCard 
									type={'atom'}
									image={item.source.previewImage}
									slug={item.source.slug}
									title={item.source.title}
									description={item.source.description} 
									header={
										<div>
											<div>Submitted on {dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</div>
											<div style={[!item.inactive && {display: 'none'}]}><span style={styles.inactiveNote}>{item.inactiveNote}</span> on {dateFormat(item.inactiveDate, 'mmm dd, yyyy h:MM TT')}</div>
										</div>
									}
									buttons = {item.inactive ? [] : buttons}/>
							</div>
						);
					})
				}
				
			</div>
		);
	}
});

export default Radium(JrnlProfileSubmitted);

styles = {
	inactive: {
		opacity: '0.5',
	},
	inactiveNote: {
		textTransform: 'capitalize',
	},
};
