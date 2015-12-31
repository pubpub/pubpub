import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubModalCite = React.createClass({
	propTypes: {
		string: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			// markdown: '',
		};
	},

	render: function() {
		const bibtex = `@book{radomski2008occupational,
	title={Occupational therapy for physical dysfunction},
	author={Radomski, Mary Vining and Latham, Catherine A Trombly},
	year={2008},
	publisher={Lippincott Williams \& Wilkins}
}`;
		const apa = 'Radomski, M. V., & Latham, C. A. T. (Eds.). (2008). Occupational therapy for physical dysfunction. Lippincott Williams & Wilkins.';
		const mla = 'Radomski, Mary Vining, and Catherine A. Trombly Latham, eds. Occupational therapy for physical dysfunction. Lippincott Williams & Wilkins, 2008.';
		const chicago = 'Radomski, Mary Vining, and Catherine A. Trombly Latham, eds. Occupational therapy for physical dysfunction. Lippincott Williams & Wilkins, 2008.';

		return (
			<div style={baseStyles.pubModalContainer}>

				{/* TODO: use the <Reference/> component for the styling. Just gotta make the citation object first. */}

				<div style={baseStyles.pubModalTitle}>
					<FormattedMessage {...globalMessages.cite} />
				</div>
				<div style={baseStyles.pubModalContentWrapper}>

					<div style={styles.typeTitle}>Bibtex</div>
					<div style={styles.typeContent}>
						{bibtex}
					</div>

					<div style={styles.typeTitle}>APA</div>
					<div style={styles.typeContent}>
						{apa}
					</div>

					<div style={styles.typeTitle}>MLA</div>
					<div style={styles.typeContent}>
						{mla}
					</div>

					<div style={styles.typeTitle}>Chicago</div>
					<div style={styles.typeContent}>
						{chicago}
					</div>
				</div>


			</div>
		);
	}
});

export default Radium(PubModalCite);

styles = {
	typeTitle: {
		fontSize: '20px',
		color: '#777',
	},
	typeContent: {
		padding: '5px 20px 25px 20px',
		whiteSpace: 'pre-wrap',
		color: '#222',
		outline: 'none',
	},
};
