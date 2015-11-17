import React from 'react';
import Radium from 'radium';
import {baseStyles} from './modalStyle';

let styles = {};

const EditorModalReferences = React.createClass({
	getInitialState: function() {
		return {
			showAddOptions: false,
		};
	},
	toggleShowAddOptions: function() {
		this.setState({
			showAddOptions: !this.state.showAddOptions,	
		});
	},
	render: function() {
		const sampleCites = [
			{
				refName: 'santic',
				citation: 'Santic, Marina, et al. "The Francisella tularensis pathogenicity island protein IglC and its regulator MglA are essential for modulating phagosome biogenesis and subsequent bacterial escape into the cytoplasm." Cellular microbiology 7.7 (2005): 969-979.',
			},
			{
				refName: 'testref',
				citation: 'Öhman, Arne, Anders Flykt, and Francisco Esteves. "Emotion drives attention: detecting the snake in the grass." Journal of experimental psychology: general130.3 (2001): 466. APA',
			},
			{
				refName: 'second',
				citation: 'Fritts, Thomas H., Norman J. Scott Jr, and Julie A. Savidge. "Activity of the arboreal brown tree snake (Boiga irregularis) ',
			},
			{
				refName: 'fishyfish',
				citation: 'Santic, Marina, et al. "The Francisella tularensis pathogenicity island protein IglC and its regulator MglA are essential for modulating phagosome biogenesis and subsequent bacterial escape into the cytoplasm." Cellular microbiology 7.7 (2005): 969-979.',
			},
			{
				refName: 'santic',
				citation: 'Santic, Marina, et al. "The Francisella tularensis pathogenicity island protein IglC and its regulator MglA are essential for modulating phagosome biogenesis and subsequent bacterial escape into the cytoplasm." Cellular microbiology 7.7 (2005): 969-979.',
			},
			{
				refName: 'testref',
				citation: 'Öhman, Arne, Anders Flykt, and Francisco Esteves. "Emotion drives attention: detecting the snake in the grass." Journal of experimental psychology: general130.3 (2001): 466. APA',
			},
			{
				refName: 'second',
				citation: 'Fritts, Thomas H., Norman J. Scott Jr, and Julie A. Savidge. "Activity of the arboreal brown tree snake (Boiga irregularis) ',
			},
			{
				refName: 'fishyfish',
				citation: 'Santic, Marina, et al. "The Francisella tularensis pathogenicity island protein IglC and its regulator MglA are essential for modulating phagosome biogenesis and subsequent bacterial escape into the cytoplasm." Cellular microbiology 7.7 (2005): 969-979.',
			},
		];

		return (
			<div>
				<h2 style={baseStyles.topHeader}>References</h2>

				{/* Search for new Ref bar and advanced add option */}
				<div style={[baseStyles.rightCornerSearch, styles.mainContent[this.state.showAddOptions]]}>
					<input style={baseStyles.rightCornerSearchInput} type="text" placeholder="Search for new reference"/>
					<div key="refAdvancedText" style={baseStyles.rightCornerSearchAdvanced} onClick={this.toggleShowAddOptions}>more add options</div>
				</div>

				{/* Back button that displays in advanced mode */}
				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showAddOptions]]} onClick={this.toggleShowAddOptions}>
					Back
				</div>

				{/* Main References table */}
				<div className="main-ref-content" style={styles.mainContent[this.state.showAddOptions]}>
					{/* References table header */}
					<div style={styles.rowContainer}>
						<div style={[styles.refNameColumn, styles.columnHeader]}>refName</div>
						<div style={[styles.bodyColumn, styles.columnHeader]}>citation</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={styles.clearfix}></div>
					</div>
					
					{/* Iterate over citations */}
					{
						sampleCites.map((citation, index) => {
							return (
								<div key={'citation-' + index} style={styles.rowContainer}>
									<div style={[styles.refNameColumn]}>{citation.refName}</div>
									<div style={[styles.bodyColumn]}>{citation.citation}</div>
									<div style={[styles.optionColumn]}>edit</div>
									<div style={[styles.optionColumn]}>delete</div>
									<div style={styles.clearfix}></div>
								</div>
							);
						})
					}
					
				</div>

				{/* Content section displayed when in advanced add mode */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showAddOptions], styles.addOptionsContent]}>
					<h2 style={styles.sectionHeader}>Add Bibtex</h2>
					<textarea></textarea>

					<h2 style={styles.sectionHeader}>Manual Entry</h2>
					<p>'Fritts, Thomas H., Norman J. Scott Jr, and Julie A. Savidge. "Activity of the arboreal brown tree snake (Boiga irregularis) '</p>
				</div>

			</div>
		);
	}
});

export default Radium(EditorModalReferences);

styles = {
	mainContent: {
		true: {
			display: 'none',
		},
	},
	addOptions: {
		true: {
			display: 'block',
		},
		display: 'none',
		
	},
	addOptionsContent: {
		padding: '15px 25px',
	},
	rowContainer: {
		width: 'calc(100% - 30px)',
		padding: 15,
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	refNameColumn: {
		width: 'calc(25% - 20px)',
		padding: '0px 10px',
		float: 'left',
	},
	columnHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
	},
	bodyColumn: {
		width: 'calc(55% - 20px)',
		padding: '0px 10px',
		float: 'left',
	},
	optionColumn: {
		width: 'calc(10% - 10px)',
		padding: '0px 5px',
		float: 'left',
		textAlign: 'center',
	},
	clearfix: {
		// necessary because we float elements with variable height 
		display: 'table',
		clear: 'both',
	},
	sectionHeader: {
		margin: 0,
	},
};
