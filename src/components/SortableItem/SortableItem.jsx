import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import { sortable } from 'react-anything-sortable';

export const SortableItem = React.createClass({
	propTypes: {
		content: PropTypes.object,
	},

	render: function() {
		return (
			<div {...this.props}>
				<Style rules={{
					'.ui-sortable': { display: 'block', position: 'relative', overflow: 'visible', userSelect: 'none'},
					'.ui-sortable .ui-sortable-item': { cursor: 'move'},
					'.ui-sortable .ui-sortable-item.ui-sortable-dragging': { position: 'absolute', zIndex: 1668},
					'.ui-sortable .ui-sortable-placeholder': { display: 'none'},
					'.ui-sortable .ui-sortable-placeholder.visible': { display: 'block', zIndex: -1, opacity: '0.25'},
				}} />

				{this.props.content}

			</div>
		);
	}
});

export default Radium(sortable(SortableItem));

