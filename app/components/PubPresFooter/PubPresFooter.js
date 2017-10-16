import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

require('./pubPresFooter.scss');

const propTypes = {
	slug: PropTypes.string.isRequired,
	collections: PropTypes.array,
	numDiscussions: PropTypes.number,
	localPermissions: PropTypes.string,
};

const defaultProps = {
	collections: [],
	numDiscussions: undefined,
	localPermissions: 'none'
};

const PubPresFooter = function(props) {
	return (
		<div className={'pub-pres-footer'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div className={'details'}>
							{props.collections.sort((foo, bar)=> {
								if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
								if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
								return 0;
							}).map((item)=> {
								return <Link key={`footer-collection-${item.id}`} to={`/${item.slug}`} className={'pt-tag pt-large pt-intent-primary pt-minimal'}>{item.title}</Link>
							})}
						</div>
						{props.localPermissions !== 'none' && !!props.numDiscussions &&
							<div className={'button'}>
								<Link to={`/pub/${props.slug}/collaborate`} className={'pt-button pt-intent-primary'}>View {props.numDiscussions} Discussion{props.numDiscussions === 1 ? '' : 's'}</Link>
							</div>
						}
						
					</div>

				</div>
			</div>
		</div>
	);
};

PubPresFooter.defaultProps = defaultProps;
PubPresFooter.propTypes = propTypes;
export default PubPresFooter;
