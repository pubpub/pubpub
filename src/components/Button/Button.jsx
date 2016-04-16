import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {LoaderIndeterminate} from '../';
let styles = {};

const Button = React.createClass({
	propTypes: {
		btnKey: PropTypes.string,
		label: PropTypes.string,
		onClick: PropTypes.func,
		isLoading: PropTypes.bool,
		align: PropTypes.string,
	},

	getInitialState() {
		return {
			startTime: Date.now(),
			showDone: false,
			align: 'left',
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading === true && nextProps.isLoading === false) {
			this.setState({showDone: true});
			setTimeout(()=>{
				if (this.isMounted()) {
					this.setState({showDone: false});
				}

			}, 2000);
		}
	},

	render: function() {
		return (
			<div>
				<div style={[styles.container, this.props.align === 'right' && styles.containerRight]}>
					<div style={[styles.done, this.state.showDone && styles.showDone, this.props.align === 'right' ? styles.doneRight : styles.doneLeft]}>
						✓
					</div>

					<div style={styles.button} key={this.props.btnKey} onClick={this.props.onClick}>
						{this.props.label}

						<div style={styles.loaderWrapper}>
							{this.props.isLoading || this.state.delayFinish ? <LoaderIndeterminate color="#555"/> : null}
						</div>

					</div>

				</div>
				<div style={globalStyles.clearFix}></div>
			</div>

		);
	}
});

export default Radium(Button);

styles = {
	container: {
		position: 'relative',
		userSelect: 'none',
		display: 'inline-block',
	},
	containerRight: {
		float: 'right',
	},
	done: {
		position: 'absolute',
		opacity: 0,
		transition: '.1s linear opacity',
		top: 4,
		fontSize: '20px',

	},
	doneLeft: {
		right: -20,
	},
	doneRight: {
		left: -20,
	},
	showDone: {
		opacity: 1,
	},
	button: {
		padding: '5px 15px',
		overflow: 'hidden',
		position: 'relative',
		border: '1px solid #aaa',
		borderRadius: '1px',
		textAlign: 'center',
		display: 'inline-block',
		fontFamily: 'Lato',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			backgroundColor: '#F3F3F3',
			// border: '1px solid #333',
		},
		':active': {
			transform: 'translateY(1px)',
		}
	},
	loaderWrapper: {
		position: 'absolute',
		width: '100%',
		bottom: '0px'
	},
};
