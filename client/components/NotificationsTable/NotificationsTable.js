import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';

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
						title = `${firstActivity.object.title} has been submitted for publication.`;
						image = firstActivity.object.avatar;
					} else if (result.verb === 'discussed') {
						const count = result.activity_count;
						title = <span><b>{count} new discussion{count === 1 ? '' : 's'}</b> have been added to <b>{firstActivity.target.title}</b></span>;
						link = `/pub/${firstActivity.target.slug}/discussions`;
						image = firstActivity.target.avatar;
					} else if (result.verb === 'replied') {
						const count = result.activity_count;
						title = <span><b>{count} new repl{count === 1 ? 'y' : 'ies'}</b> {count === 1 ? 'has' : 'have'} been posted to a discussion thread you are in on <b>{firstActivity.target.title}</b>.</span>;
						link = `/pub/${firstActivity.target.slug}/discussions/${firstActivity.object.threadNumber}`;
						image = firstActivity.target.avatar;
					}

					return (
						<tr>
							<td className="icon">
								<a href={link}>
									{image &&
										<img src={image} alt="Activity Icon" />
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
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

NotificationsTable.propTypes = propTypes;
export default NotificationsTable;
