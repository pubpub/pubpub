import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import request from 'superagent';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';
import dateFormat from 'dateformat';
import {FormattedMessage} from 'react-intl';

const InputFields = [];

const Config = {
	title: 'collectionList',
	autocomplete: true,
	preview: false,
	color: 'rgba(185, 215, 249, 0.5)',
	page: true,
};

const EditorWidget = (inputProps) => (<span>Collection List</span>);

const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
	},
	getInitialState() {
		return {
			collections: [],
			activeIndex: 0,
		};
	},
	componentDidMount() {
		request.get('/api/getJournalCollections').end((err, response)=>{
			this.setState({collections: response.body});
		});
	},

	setActiveIndex: function(index) {
		return ()=>{
			this.setState({activeIndex: index});
		};
	},

	render: function() {
		const collections = this.state.collections || [];
		const activeCollection = this.state.collections[this.state.activeIndex] || {};
		const pubs = activeCollection.pubs || [];
		return (
			<div className={'collectionList wrapper'}>
				<div className={'collectionList collectionButtons'}>
					{
						collections.map((collection, index)=>{
							return (
								<div key={'collectionButton-' + index} className={'collectionList collectionButton' + (this.state.activeIndex === index ? ' active' : '')} onClick={this.setActiveIndex(index)}>
									{collection.title}
								</div>
							);
						})
					}
				</div>

				<div className={'collectionList collectionTitle'}>{activeCollection.title}</div>

				<div className={'collectionList collectionPubs'}>
					{
						pubs.map((pub, pubIndex)=>{
							return (
								<div key={'collectionPub-' + pubIndex} className={'collectionList pubList pub'}>
									<Link style={globalStyles.link} to={'/pub/' + pub.slug}>
										<div className={'collectionList pubList title'}>{pub.title}</div>
										<div className={'collectionList pubList authors'}>
											{pub.authors.map((author, authorIndex)=>{
												return <div className={'collectionList pubList author'} key={'pub-' + pubIndex + '-author-' + authorIndex}>{author.name}</div>;
											})}
										</div>
										<div className={'collectionList pubList abstract'}>{pub.abstract}</div>
										<div className={'collectionList pubList createDate'}>{dateFormat(pub.createDate, 'mmm dd, yyyy')}</div>
										<div className={'collectionList pubList lastUpdated'}>{dateFormat(pub.lastUpdated, 'mmm dd, yyyy')}</div>
										<div className={'collectionList pubList discussionCount'}>{pub.discussions.length}</div>
									</Link>
								</div>
							);
						})
					}
					{!pubs.length
						? <div key={'collectionPub-empty'} className={'collectionList pubList pub emptyPub'}>
							<div className={'collectionList pubList title emptyTitle'}>
								<FormattedMessage id="collectionList.noPubs" defaultMessage="No Pubs in this Collection"/>
							</div>
						</div>
						: null
					}
				</div>

				{!collections.length
					? <div className={'collectionList noCollectionsWrapper'}>
						<div className={'collectionList noCollectionsText'}>No Collections in this journal yet.</div>
					</div>
					: null
				}

			</div>
		);
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
