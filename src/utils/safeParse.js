import Immutable from 'immutable';

// Example: safeGetInToJS(this.props.readerData, ['pubData', 'featuredInList']) || [])
export function safeGetInToJS(obj, props) {
	if (obj && obj.getIn) {
		const val = obj.getIn(props);
		if (Immutable.Iterable.isIterable(val) && val.toJS) {
			return val.toJS();
		}
	}
	return null;
}
