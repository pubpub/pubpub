import PropTypes from 'prop-types';

export default {
	communityData: PropTypes.shape({
		accentMinimalColor: PropTypes.string.isRequired,
	}),
	loginData: PropTypes.shape({}),
	locationData: PropTypes.shape({}),
	pubData: PropTypes.shape({
		editorKey: PropTypes.string.isRequired,
		isDraft: PropTypes.bool,
		isDraftEditor: PropTypes.bool,
		isEditor: PropTypes.bool,
		isManager: PropTypes.bool,
		slug: PropTypes.string.isRequired,
	}),
};
