import { createTheme } from '@mui/material/styles';
import palette from './colors';
import shadows from './shadows';
import typography from './typography';
import misc from './misc';

const theme = createTheme({
	palette,
	typography: {
		...typography,
		...misc,
	},
	shadows,
});

export default theme;
