import PropTypes from 'prop-types';
import { propTypes } from '../components/CollectionEditor/CollectionEditor';

export default PropTypes.shape({
	id: PropTypes.string.isRequired,
	isAuthor: PropTypes.bool.isRequired,
	roles: PropTypes.arrayOf(PropTypes.string).isRequired,
	user: PropTypes.shape({
		initials: PropTypes.string,
		avatar: PropTypes.string,
		fullName: propTypes.string,
		slug: PropTypes.string,
	}).isRequired,
});
