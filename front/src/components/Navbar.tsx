import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import DriveEtaIcon from '@mui/icons-material/DriveEta';

type NavbarProps = {};

export const Navbar = (props: NavbarProps) => {
	return(
		<AppBar position="static" color="primary" enableColorOnDark>
			<Toolbar>
				<IconButton edge="start" color="inherit" aria-label="menu">
					<DriveEtaIcon/>
					<Typography ml={1} variant="h6">Code Delivery</Typography>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
