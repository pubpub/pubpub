import React from 'react';
import PropTypes from 'prop-types';

require('./inputField.scss');

const propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	isRequired: PropTypes.bool,
	helperText: PropTypes.string,
	error: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	children: PropTypes.node,

};

const defaultProps = {
	placeholder: undefined,
	isRequired: false,
	helperText: '',
	error: undefined,
	value: undefined,
	onChange: undefined,
	children: undefined,
};

const InputField = function(props) {
	return (
		<div className={`input-field pt-form-group ${props.error ? 'pt-intent-danger' : ''}`}>
			<label className="pt-lablel" htmlFor={`input-${props.label}`}>
				{props.label}
				{props.isRequired &&
					<span className="pt-text-muted">(required)</span>
				}
			</label>
			<div className="pt-form-content">
				{props.children}
				<div className={`pt-input-group ${props.error ? 'pt-intent-danger' : ''}`}>
					{!props.children &&
						<input
							id={`input-${props.label}`}
							className="pt-input"
							placeholder={props.placeholder}
							value={props.value}
							onChange={props.onChange}
							type="text"
							dir="auto"
						/>
					}
					<div className="pt-form-helper-text">{props.error || props.helperText}</div>
				</div>

			</div>
		</div>
	);
};

InputField.defaultProps = defaultProps;
InputField.propTypes = propTypes;
export default InputField;
