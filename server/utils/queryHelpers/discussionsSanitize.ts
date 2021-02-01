import { Discussion } from 'utils/types';
import { sanitizeOnVisibility } from './util';

export default (discussions: Discussion[], activePermissions, loginId) => {
	return sanitizeOnVisibility(discussions, activePermissions, loginId);
};
