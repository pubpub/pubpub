import React from 'react';
import Radium from 'radium';
import {baseStyles} from './modalStyle';

let styles = {};

const EditorModalReferences = React.createClass({
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
				<div style={baseStyles.rightCornerSearch}>
					<input style={baseStyles.rightCornerSearchInput} type="text" placeholder="Search for new reference"/>
					<div key="refAdvancedText" style={baseStyles.rightCornerSearchAdvanced}>more add options</div>
				</div>

				<div className="main-ref-content">
					<div style={styles.rowContainer}>
						<div style={[styles.refNameColumn, styles.columnHeader]}>refName</div>
						<div style={[styles.bodyColumn, styles.columnHeader]}>citation</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
					</div>
					

					{
						sampleCites.map((citation, index) => {
							return (
								<div key={'citation-' + index} style={styles.rowContainer}>
									<div style={[styles.refNameColumn]}>{citation.refName}</div>
									<div style={[styles.bodyColumn]}>{citation.citation}</div>
									<div style={[styles.optionColumn]}>edit</div>
									<div style={[styles.optionColumn]}>delete</div>
								</div>
							);
						})
					}
					
				</div>

			</div>
		);
	}
});

export default Radium(EditorModalReferences);

styles = {};
