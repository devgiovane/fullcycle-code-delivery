import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from "notistack";
import CssBaseline from '@mui/material/CssBaseline';
//
import { theme } from "./theme";
import { Mapping } from "./components/Mapping";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={3}>
				<CssBaseline />
				<Mapping />
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default App;
