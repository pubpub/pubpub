import PropTypes from 'prop-types';

type collection = {
	id: string;
	title: string;
	isPublic: boolean;
	pageId: string;
	metadata?: any;
};
const collection: PropTypes.Requireable<collection> = PropTypes.shape({
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	isPublic: PropTypes.bool.isRequired,
	pageId: PropTypes.string.isRequired,
	metadata: PropTypes.object,
});
export default collection;
