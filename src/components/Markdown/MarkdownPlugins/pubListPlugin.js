import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
import request from 'superagent';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';
import dateFormat from 'dateformat';

const InputFields = [];

const Config = {
	title: 'pubList',
	autocomplete: true,
	color: 'rgba(185, 215, 249, 0.5)',
	page: true,
	preview: false,
};

const EditorWidget = (inputProps) => (<span>Pub List</span>);

const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
	},
	getInitialState() {
		return {
			pubs: [],
		};
	},
	componentDidMount() {
		request.get('/api/getJournalPubs').end((err, response)=>{
			this.setState({pubs: response.body});
		});
	},

	render: function() {
		const pubs = this.state.pubs || [];

		return (
			<div className={'pubList wrapper'}>
				{
					pubs.map((pub, index)=>{
						return (
							<div key={'pub-' + index} className={'pubList pub'}>
								<Link style={globalStyles.link} to={'/pub/' + pub.slug}>
									<div className={'pubList title'}>{pub.title}</div>
									<div className={'pubList authors'}>
										{pub.authors.map((author, authorIndex)=>{
											return <div className={'pubList author'} key={'pub-' + index + '-author-' + authorIndex}>{author.name}</div>;
										})}
									</div>
									<div className={'pubList abstract'}>{pub.abstract}</div>
									<div className={'pubList createDate'}>{dateFormat(pub.createDate, 'mmm dd, yyyy')}</div>
									<div className={'pubList lastUpdated'}>{dateFormat(pub.lastUpdated, 'mmm dd, yyyy')}</div>
									<div className={'pubList discussionCount'}>{pub.discussions.length}</div>

								</Link>

							</div>
						);
					})
				}
				{!pubs.length
					? <div className={'pubList noPubsWrapper'}>
						<div className={'pubList noPubsText'}>No pubs in this journal yet.</div>
					</div>
					: null
				}
			</div>
		);
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
