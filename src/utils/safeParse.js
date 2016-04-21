import Immutable from 'immutable';

export function safeGetInToJS(obj, props) {
	if (obj && obj.hasOwnProperty('getIn')) {
		const val = obj.getIn(['pubData', 'featuredInList']);
		if (Immutable.Iterable.isIterable(val) && val.hasOwnProperty('toJS')) {
			return val.toJS();
		}
	}
	return null;
}
