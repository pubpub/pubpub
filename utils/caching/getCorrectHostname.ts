import { isDuqDuq } from 'utils/environment';

export const getCorrectHostname = (subdomain: string, domain?: string | null) =>
	isDuqDuq() ? `${subdomain}.duqduq.org` : domain ?? `${subdomain}.pubpub.org`;
