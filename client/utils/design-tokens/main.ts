import fs from 'fs';
import { execSync } from 'child_process';
import SD from 'style-dictionary';

import { colors, lightBase } from './tokens';

const transformedTokenPath = 'build/style-dictionary/token.json';
const tokenToTransformPath = 'build/rawToken.json';
const SDConfigPath = 'build/config.json';
const themeExportPath = 'build/theme';
const StyleDictionary = SD.extend(SDConfigPath);

const parseFontWeight = (value: string | number) => {
	if (typeof value !== 'string') return value;
	const val = value?.toLowerCase().replace(' ', '');
	switch (val) {
		case 'thin':
			return 100;
		case 'extra light':
			return 200;
		case 'light':
			return 300;
		case 'regular':
			return 400;
		case 'medium':
			return 500;
		case 'semibold':
			return 600;
		case 'bold':
			return 700;
		case 'extra bold':
			return 800;
		case 'black':
			return 900;
		case 'extra black':
			return 950;
		default:
			return val;
	}
};

const parseLetterSpacing = (value: string | number) => {
	if (typeof value === 'string') {
		const lastChar = value.slice(-1);
		if (lastChar === '%') {
			const newBase = value.slice(0, value.length - 1);
			return newBase + 'em';
		}
		return value;
	}
	return `${value}px`;
};

const parseNumberToPixel = (value: string | number) =>
	typeof value === 'string' ? value : `${value}px`;

const parseLineHeight = (value: string | number) => parseNumberToPixel(value);

const rawTokens = { global: { 'color set': { ...colors }, ...lightBase } };

fs.writeFileSync(`${tokenToTransformPath}`, JSON.stringify(rawTokens));

execSync(
	`npx token-transformer ${tokenToTransformPath} ${transformedTokenPath} --expandTypography=true`,
);

const config = {
	source: [transformedTokenPath],
	platforms: {
		mui: {
			transformGroup: 'js/custom',
			buildPath: themeExportPath,
			files: [
				{
					destination: 'typography.json',
					format: 'muiTypography',
				},
				{
					destination: 'misc.json',
					format: 'jsMisc',
				},
				{
					destination: 'colors.json',
					format: 'jsColors',
				},
				{
					destination: 'shadows.json',
					format: 'jsShadows',
				},
			],
		},
	},
};

fs.writeFileSync(`${SDConfigPath}`, JSON.stringify(config));

StyleDictionary.registerTransform({
	name: 'lineHeight/px',
	type: 'value',
	matcher: ({ type }: SD.TransformedToken) => type === 'lineHeights',
	transformer: ({ value }: { value: string | number }) => parseLineHeight(value),
});

StyleDictionary.registerTransform({
	name: 'letterSpacing/em',
	type: 'value',
	matcher: ({ type }: SD.TransformedToken) => type === 'letterSpacing',
	transformer: ({ value }: { value: string | number }) => parseLetterSpacing(value),
});

StyleDictionary.registerTransform({
	name: 'fontWeight/lowerCaseOrNum',
	type: 'value',
	matcher: ({ type }: SD.TransformedToken) => type === 'fontWeights',
	transformer: ({ value }: { value: string | number }) => parseFontWeight(value),
});

StyleDictionary.buildAllPlatforms();
