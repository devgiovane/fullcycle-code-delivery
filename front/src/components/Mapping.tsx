import './mapping.css';
//
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { io, Socket } from "socket.io-client";
import { Loader } from "google-maps";
import { useSnackbar } from "notistack";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
//
import Marker from "../assets/marker.png";
import MarkerCar from "../assets/markercar.png";
import { Route} from "../@types/route";
import { Navbar} from "./Navbar";
import { RouteExistsError } from "../errors/routeExistsError";
import { getCurrentPosition } from "../services/geolocation";
import { Map } from "../services/map";

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

type MappingProps = {

};

export const Mapping = (props: MappingProps) => {
	const [routes, setRoutes] = useState<Route[]>([]);
	const [routeSelected, setRouteSelected] = useState<string>('');
	const mapRef = useRef<Map>();
	const socketRef = useRef<Socket|null>(null);
	const { enqueueSnackbar } = useSnackbar();
	const finishRoute = useCallback((route: Route) => {
		enqueueSnackbar(`${route?.title} already added wait to finish`, {
			variant: 'success',
		});
		mapRef.current?.removeRoutes(route._id);
	}, []);
	useEffect(() => {
		if (!socketRef.current) {
			socketRef.current = io(process.env.REACT_APP_API_URL as string);
			socketRef.current?.on('connect' , () => {
				console.log('connected');
			});
		}
		const handler = (data: { route_id: string; position: [ number, number ]; finished: boolean; }) => {
			console.log(data);
			mapRef.current?.moveCurrentMarker(data.route_id, {
				lat: data.position[0],
				lng: data.position[1]
			});
			if (data.finished) {
				const route = routes.find(route => route._id === data.route_id);
				if (route) {
					finishRoute(route);
				}
			}
		};
		socketRef.current.on('position', handler);
		return () => {
			socketRef.current?.off('position', handler);
		}
	}, [ finishRoute, routes, routeSelected ]);
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/routes`)
			.then(response => response.json())
			.then(response => setRoutes(response));
	}, []);
	useEffect(() => {
		(async () => {
			const [, position] = await Promise.all([
				googleMapsLoader.load(),
				getCurrentPosition({ enableHighAccuracy: true })
			]);
			const divMap = document.getElementById('map') as HTMLElement;
			mapRef.current = new Map(divMap, {
				zoom: 15,
				center: position
			});
		})();
	}, []);
	const startRoute = useCallback((event: FormEvent) => {
		event.preventDefault();
		const route = routes.find(route => route._id === routeSelected);
		try {
			mapRef.current?.addRoute(routeSelected, {
				currentMarkerOptions: {
					position: route?.startPosition,
					icon: MarkerCar
				},
				endMarkerOptions: {
					position: route?.endPosition,
					icon: Marker
				}
			});
			socketRef.current?.emit('direction', {
				id: routeSelected
			})
		} catch (error) {
			if (error instanceof RouteExistsError) {
				enqueueSnackbar(`${route?.title} already added wait to finish`, {
					variant: 'error',
				});
				return;
			}
			throw error;
		}
	}, [routes, routeSelected, enqueueSnackbar]);
	return(
		<Grid className="root" container>
			<Grid item xs={12} sm={2}>
				<Navbar />
				<form onSubmit={startRoute} className="form">
					<Select fullWidth value={routeSelected} onChange={e => setRouteSelected(String(e.target.value))}>
						<MenuItem value="">
							<em>Select a race</em>
						</MenuItem>
						{routes.map((route, key) => (
							<MenuItem key={key} value={route._id}>
								{route.title}
							</MenuItem>
						))}
					</Select>
					<div className="button__container">
						<Button fullWidth type="submit" color="primary" variant="contained">
							Start race
						</Button>
					</div>
				</form>
			</Grid>
			<Grid item xs={12} sm={10}>
				<div id="map" className="map"/>
			</Grid>
		</Grid>
	)
}
