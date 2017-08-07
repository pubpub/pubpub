import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';

require('./pubPreview.scss');

const propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	authors: PropTypes.array,
	contributors: PropTypes.array,
	publicationDate: PropTypes.string,
	bannerImage: PropTypes.string,
	isLarge: PropTypes.bool,
};

const defaultProps = {
	title: undefined,
	description: undefined,
	authors: [],
	contributors: [],
	publicationDate: undefined,
	bannerImage: undefined,
	isLarge: false,
};

const PubPreview = function(props) {
	const bannerStyle = {
		backgroundImage: `url("${props.bannerImage}")`
	};
	const contributorsCount = props.authors.length + props.contributors.length;
	return (
		<div className={`pub-preview ${props.isLarge ? 'large-preview' : ''}`}>
			<div className={'preview-banner'} style={bannerStyle} />

			<div className={'preview-content'}>
				<h3 className={'title'}>{props.title}</h3>
				<div className={'description'}>{props.description}</div>

				<div className={'contributors'}>
					<div className={'avatars'}>
						{props.authors.map((author, index)=> {
							return (
								<Avatar
									key={`author-${author.id}`}
									width={35}
									doesOverlap={index !== props.authors.length - 1}
									borderColor={'#FFF'}
									userAvatar={author.userAvatar}
									userInitials={author.userInitials}
								/>
							);
						})}
					</div>
					<div className={'details'}>
						<div className={'subtext'}>{contributorsCount} contributor{contributorsCount === 1 ? '' : 's'}</div>
						<div className={'subtext'}>{dateFormat(props.publicationDate, 'mmm dd, yyyy')}</div>
					</div>
				</div>
			</div>

		</div>
	);
};

PubPreview.defaultProps = defaultProps;
PubPreview.propTypes = propTypes;
export default PubPreview;
