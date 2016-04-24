import Immutable from 'immutable';

//Example: safeGetInToJS(this.props.readerData, ['pubData', 'featuredInList']) || [])
export function safeGetInToJS(obj, props) {
	if (obj && obj.hasOwnProperty('getIn')) {
		const val = obj.getIn(props);
		if (Immutable.Iterable.isIterable(val) && val.hasOwnProperty('toJS')) {
			return val.toJS();
		}
	}
	return null;
}
