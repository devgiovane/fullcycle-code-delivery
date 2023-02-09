import { createTheme, ThemeOptions } from '@mui/material/styles';

const palette: ThemeOptions = {
	palette: {
		mode: 'dark',
		primary: {
			main: "#FFCD00",
			contrastText: "#242426"
		},
		background: {
			default: "#242526"
		}
	}
}

export const theme = createTheme(palette);
