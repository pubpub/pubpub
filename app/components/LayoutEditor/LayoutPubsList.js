import { InputGroup, NonIdealState } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

import Link from 'components/Link/Link';
import SinglePub from './LayoutSinglePub';
import { browserHistory } from 'react-router';
import dateFormat from 'dateformat';
import { globalStyles } from 'utils/globalStyles';

let styles = {};

export const LayoutPubsList = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	// getInitialState: function() {
	// 	return {
	// 		confirmFeature: undefined,
	// 		confirmReject: undefined,
	// 	};
	// },
	getInitialState() {
		return {
			search: '',
		};
	},

	componentWillReceiveProps(nextProps) {
		// if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
		// 	this.setState({ confirmReject: undefined });
		// 	this.setState({ confirmFeature: undefined });
		// }
	},

	inputUpdate: function(evt) {
		const value = evt.target.value || '';
		this.setState({ search: value });
	},

	searchSubmited: function(evt) {
		evt.preventDefault();
		browserHistory.push('/search?q=' + this.state.search);
		this.setState({ search: '' });
	},

	render: function() {
		const journal = this.props.journal || {};
		const pubFeatures = journal.pubFeatures || [];
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;
    const n = this.props.n || pubFeatures.length;

    const { showPreview = true, order = [], label } = this.props;

		return (
			<div>

				{!pubFeatures.length &&
					<NonIdealState
						action={
							<form onSubmit={this.searchSubmited}>
								<InputGroup leftIconName="search" placeholder={'Search...'} value={this.state.search} onChange={this.inputUpdate}/>
							</form>
						}
						description={'This journal has not yet featured any pubs. Search for pubs to feature below.'}
						title={'No Featured Pubs'}
						visual={'application'} />
				}

				{
          pubFeatures.slice(0, n )
					.sort((foo, bar)=>{
            const orderFoo = order.indexOf(foo.pub.slug);
            const orderBar = order.indexOf(bar.pub.slug);


            if (orderFoo !== -1 || orderBar !== -1) {
              if (orderBar === -1) {
                return -1;
              } else if (orderFoo === -1) {
                return 1;
              } else if (orderFoo < orderBar) {
                return -1;
              } else if (orderFoo > orderBar) {
                return 1;
              }
            }

						// Sort so that most recent is first in array
						if (foo.createdAt > bar.createdAt) { return -1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						return 0;
					}).filter((item)=> {
						const pub = item.pub || {};
						return pub.slug !== 'designandsciencej';
					}).map((pubFeature, index)=> {
						return (<SinglePub key={'feature-' + index}  pub={pubFeature.pub} pubFeature={pubFeature} journal={journal} showPreview={showPreview} />);
					})
				}


			</div>
		);
	}

});

export default LayoutPubsList;

styles = {
	featureWrapper: {
		// padding: '0em 0em 1em',
		margin: '0em 0em 1em 0em',
		borderBottom: '1px solid #CCC',
	},
	featureTable: {
		display: 'table',
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		width: '100px',
	},
	featureImage: {
		width: '100px',
		paddingRight: '1em',
	},
	featureDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttons: {
		display: 'table-cell',
		width: '1%',
	},
	loaderContainer: {
		display: 'inline-block',
		margin: 'auto 0',
	},

};
