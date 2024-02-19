export const ORCID_PATTERN = /(\d{4}-){3}\d{3}(\d|X)/g;

/** Same as the ORCID_PATTERN, but with ^ and $ to match the entire string. */
export const ORCID_ID_PATTERN = /^(\d{4}-){3}\d{3}(\d|X)$/g;
