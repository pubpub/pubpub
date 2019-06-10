import Cookies from 'js-cookie';

import { apiFetch } from './apiFetch';

const cookieKey = 'gdpr-consent';
const persistSignupCookieKey = 'gdpr-consent-survives-login';
const expireInOneThousandYears = { expires: 365 * 1000 };

export const gdprCookiePersistsSignup = () => Cookies.get(persistSignupCookieKey) === 'yes';

export const getGdprConsentElection = (loginData = null) => {
	const cookieValue = Cookies.get(cookieKey);
	if (loginData && loginData.gdprConsent !== null) {
		return loginData.gdprConsent === true;
	}
	if (cookieValue) {
		return cookieValue === 'accept';
	}
	return null;
};

export const updateGdprConsent = (loginData, doesUserConsent) => {
	const loggedIn = !!loginData.id;
	Cookies.set(cookieKey, doesUserConsent ? 'accept' : 'decline', expireInOneThousandYears);
	Cookies.set(persistSignupCookieKey, 'yes', expireInOneThousandYears);
	if (loggedIn) {
		return apiFetch('/api/users', {
			method: 'PUT',
			body: JSON.stringify({
				userId: loginData.id,
				gdprConsent: doesUserConsent,
			}),
		});
	}
	return Promise.resolve();
};
