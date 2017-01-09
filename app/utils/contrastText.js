/* eslint-disable id-length */

// Inspired and taken from Stackoverflow response of Vivin Paliath
// http://stackoverflow.com/questions/4726344/how-do-i-change-text-color-determined-by-the-background-color

function hexToRGB(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		R: parseInt(result[1], 16),
		G: parseInt(result[2], 16),
		B: parseInt(result[3], 16)
	} : {};
}

// Accepts Hex background color
// e.g. #FFF, #1287f3, #001177
export function contrastText(bgColor) {
	const nThreshold = 105;
	const components = hexToRGB(bgColor);
	const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

	return ((255 - bgDelta) < nThreshold) ? '#000000' : '#ffffff';   
}
