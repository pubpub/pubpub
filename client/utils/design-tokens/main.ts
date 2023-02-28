import { transformTokens } from 'token-transformer';
import core from './tokens/colors.json';

console.log(core);

// import token fißle

// convert it with token transformers
const rawTokens = { coreStyles: { ...core } };
const setsToUse = ['coreStyles'];
const excludes: any = [];

const transformerOptions = {
	expandTypography: true,
	expandShadow: true,
	expandComposition: true,
	expandBorder: true,
	preserveRawValue: false,
	throwErrorWhenNotResolved: true,
	resolveReferences: true,
};

const resolved = transformTokens(rawTokens, setsToUse, excludes, transformerOptions);

console.log(resolved);

// transform object to it can register mui tyupography from the token file

// add to style dictionary
