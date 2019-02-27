import PropTypes from 'prop-types';

export default {
	communityData: PropTypes.shape({
		accentMinimalColor: PropTypes.string.isRequired,
	}),
	loginData: PropTypes.shape({}),
	locationData: PropTypes.shape({}),
	pubData: PropTypes.shape({
		editorKey: PropTypes.string.isRequired,
		isDraft: PropTypes.bool.isRequired,
		isDraftEditor: PropTypes.bool.isRequired,
		isEditor: PropTypes.bool.isRequired,
		isManager: PropTypes.bool.isRequired,
		slug: PropTypes.bool.isRequired,
	}),
};
