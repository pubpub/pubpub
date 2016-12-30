import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles;

export const PreviewJournal = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		bottomContent: PropTypes.node,
		rightContent: PropTypes.node,
	},

	render() {
		const journal = this.props.journal || {};
		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/' + journal.slug} style={[styles.pubPreviewImageWrapper, { backgroundImage: journal.icon ? 'url("' + journal.icon + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<Link to={'/' + journal.slug}><h4>{journal.name}</h4></Link>
					<p>{journal.shortDescription}</p>
					{this.props.bottomContent &&
						<div>
							{this.props.bottomContent}
						</div>
					}
				</div>

				{!!this.props.rightContent &&
					<div style={styles.rightContent}>
						{this.props.rightContent}
					</div>
				}
			</div>
		);
	}

});

export default Radium(PreviewJournal);

styles = {
	pubPreviewWrapper: {
		display: 'table',
		marginBottom: '1em',
		width: '100%',
		boxShadow: '0 1px 4px rgba(0,0,0,0.05),inset 0 0 0 1px rgba(0,0,0,0.1)',
		borderRadius: '0px 2px 2px 0px',
	},
	pubPreviewImageWrapper: {
		display: 'table-cell',
		verticalAlign: 'middle',
		boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
		width: '125px',
		height: '125px',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		borderRadius: '2px 0px 0px 2px',
		boxSizing: 'border-box',
	},
	pubPreviewDetails: {
		display: 'table-cell',
		verticalAlign: 'middle',
		padding: '1em',
	},
	pubPreviewTitle: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		marginBottom: '1em',
	},
	rightContent: {
		display: 'table-cell',
		width: '1%',
		verticalAlign: 'middle',
		whiteSpace: 'nowrap',
	},
};
