import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import { getResizedUrl } from 'utilities';

require('./notificationsTable.scss');

const propTypes = {
	resultsData: PropTypes.object.isRequired,
};

const NotificationsTable = function(props) {
	return (
		<table className="notifications-table-component pt-table pt-striped pt-interactive">
			<tbody>
				{props.resultsData.map((result)=> {
					let title;
					let link;
					let image;
					const firstActivity = result.activities[0];

					if (result.verb === 'submitted') {
						title = <span><b>{firstActivity.object.title}</b> has been submitted for publication.</span>;
						image = firstActivity.object.avatar;
						link = `/pub/${firstActivity.object.slug}/collaborate`;
					} else if (result.verb === 'created') {
						title = <span><b>{firstActivity.actor.fullName}</b> created a new pub: <b>{firstActivity.object.title}</b></span>;
						link = `/pub/${firstActivity.object.slug}/collaborate`;
						image = firstActivity.actor.avatar;
					} else if (result.verb === 'published') {
						title = firstActivity.isFirstPublish
							? <span><b>{firstActivity.object.title}</b> has been published.</span>
							: <span><b>{firstActivity.object.title}</b> has {result.activity_count} new published version{result.activity_count === 1 ? '' : 's'}.</span>;
						link = `/pub/${firstActivity.object.slug}`;
						image = firstActivity.object.avatar;
					} else if (result.verb === 'discussed') {
						// TODO: This is only new threads at the moment. Should probably be all new discussions
						const count = result.activity_count;
						title = <span><b>{count} new discussion{count === 1 ? '' : 's'}</b> {count === 1 ? 'has' : 'have'} been added to <b>{firstActivity.target.title}</b></span>;
						link = `/pub/${firstActivity.target.slug}/discussions`;
						image = firstActivity.target.avatar;
					} else if (result.verb === 'added') {
						title = <span>You have been added to <b>{firstActivity.object.title}</b></span>;
						link = `/pub/${firstActivity.target.slug}`;
						image = firstActivity.object.avatar;
					} else if (result.verb === 'replied') {
						const count = result.activity_count;
						title = <span><b>{count} new repl{count === 1 ? 'y' : 'ies'}</b> {count === 1 ? 'has' : 'have'} been posted to a discussion thread you are in on <b>{firstActivity.target.title}</b>.</span>;
						link = `/pub/${firstActivity.target.slug}/discussions/${firstActivity.object.threadNumber}`;
						image = firstActivity.target.avatar;
					}

					const resizedImageUrl = getResizedUrl(image, null, '50x50');

					return (
						<tr>
							<td className="icon">
								<a href={link}>
									{image &&
										<div className="icon-image" style={{ backgroundImage: `url("${resizedImageUrl}")` }}/>
										/*<img src={image} alt="Activity Icon" />*/
									}
								</a>
							</td>

							<td className="title">
								<a href={link}>
									{title}
								</a>
							</td>

							<td className="time">
								<a href={link}>
									<TimeAgo date={result.updated_at} title="Last Updated" />
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
