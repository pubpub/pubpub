import Immutable from 'immutable';

// Example: safeGetInToJS(this.props.readerData, ['pubData', 'featuredInList']) || []
export function safeGetInToJS(obj, props) {
	if (obj && obj.getIn) {
		const val = obj.getIn(props);
		if (Immutable.Iterable.isIterable(val) && val.toJS) {
			return val.toJS();
		}
		return val; // If there is no toJS(), it is like just a string or other static value. So return that.
	}
	return null;
}


export function safeToJS(val) {
	if (Immutable.Iterable.isIterable(val) && val.toJS) {
		return val.toJS();
	}
	return null;
}
