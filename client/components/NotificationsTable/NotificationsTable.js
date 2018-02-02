import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { getResizedUrl, generatePubBackground } from 'utilities';

require('./notificationsTable.scss');

const propTypes = {
	resultsData: PropTypes.object.isRequired,
};

const NotificationsTable = function(props) {
	return (
		<table className="notifications-table-component pt-table pt-striped pt-interactive">
			<tbody>
				{props.resultsData.sort((foo, bar)=> {
					if (foo.updated_at > bar.updated_at) { return -1; }
					if (foo.updated_at < bar.updated_at) { return 1; }
					return 0;
				}).map((result)=> {
					let title;
					let link;
					let image;
					const firstActivity = result.activities[0];
					const genBackgroundStyle = (avatar, pubTitle)=> {
						return avatar
							? { backgroundImage: `url("${getResizedUrl(avatar, null, '50x50')}")` }
							: { background: generatePubBackground(pubTitle) };
					};

					if (result.verb === 'submitted') {
						title = <span><b>{firstActivity.object.title}</b> has been submitted for publication.</span>;
						link = `/pub/${firstActivity.object.slug}/collaborate`;
						image = genBackgroundStyle(firstActivity.object.avatar, firstActivity.object.title);
					} else if (result.verb === 'created') {
						title = <span><b>{firstActivity.actor.fullName}</b> created a new pub: <b>{firstActivity.object.title}</b>.</span>;
						link = `/pub/${firstActivity.object.slug}/collaborate`;
						image = genBackgroundStyle(firstActivity.object.avatar, firstActivity.object.title);
					} else if (result.verb === 'published') {
						title = firstActivity.isFirstPublish
							? <span><b>{firstActivity.object.title}</b> has been published.</span>
							: <span><b>{firstActivity.object.title}</b> has {result.activity_count} new published version{result.activity_count === 1 ? '' : 's'}.</span>;
						link = `/pub/${firstActivity.object.slug}`;
						image = genBackgroundStyle(firstActivity.object.avatar, firstActivity.object.title);
					} else if (result.verb === 'discussed') {
						const count = result.activity_count;
						title = <span><b>{count} new discussion{count === 1 ? '' : 's'}</b> {count === 1 ? 'has' : 'have'} been added to <b>{firstActivity.target.title}</b>.</span>;
						link = `/pub/${firstActivity.target.slug}#discussions`;
						image = genBackgroundStyle(firstActivity.target.avatar, firstActivity.target.title);
					} else if (result.verb === 'added') {
						title = <span>You have been added to <b>{firstActivity.object.title}</b>.</span>;
						link = `/pub/${firstActivity.object.slug}`;
						image = genBackgroundStyle(firstActivity.object.avatar, firstActivity.object.title);
					} else if (result.verb === 'replied') {
						const count = result.activity_count;
						title = <span><b>{count} new repl{count === 1 ? 'y' : 'ies'}</b> {count === 1 ? 'has' : 'have'} been posted to your discussion thread on <b>{firstActivity.target.title}</b>.</span>;
						link = `/pub/${firstActivity.target.slug}/discussions/${firstActivity.object.threadNumber}`;
						image = genBackgroundStyle(firstActivity.target.avatar, firstActivity.target.title);
					}

					return (
						<tr>
							<td className="icon">
								<a href={link}>
									<div className="icon-image" style={image} />
								</a>
							</td>

							<td className="title">
								<a href={link}>
									{title}
									<div><TimeAgo date={`${result.updated_at}Z`} title="Last Updated" /></div>
								</a>
							</td>

							<td className="is-new">
								<a href={link}>
									{!result.is_read &&
										<span className="new-dot" />
									}
								</a>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

NotificationsTable.propTypes = propTypes;
export default NotificationsTable;
