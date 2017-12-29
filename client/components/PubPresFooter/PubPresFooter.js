import React from 'react';
import PropTypes from 'prop-types';

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
		<div className="pub-pres-footer-component">
			<div className="container pub">
				<div className="row">
					<div className="col-12">
						<div className="details">
							{props.collections.sort((foo, bar)=> {
								if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
								if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
								return 0;
							}).map((item)=> {
								return <a key={`footer-collection-${item.id}`} href={`/${item.slug}`} className="pt-tag pt-large pt-intent-primary pt-minimal">{item.title}</a>;
							})}
						</div>
						{props.localPermissions !== 'none' && !!props.numDiscussions &&
							<div className="button">
								<a href={`/pub/${props.slug}/collaborate`} className="pt-button pt-intent-primary">View {props.numDiscussions} Discussion{props.numDiscussions === 1 ? '' : 's'}</a>
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
