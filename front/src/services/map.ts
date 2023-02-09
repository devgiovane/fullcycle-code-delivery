import { RouteExistsError } from "../errors/routeExistsError";

type RouteOptions = {
	currentMarkerOptions: google.maps.ReadonlyMarkerOptions
	endMarkerOptions: google.maps.ReadonlyMarkerOptions
}

export class Route {

	public endMarker: google.maps.Marker;
	public currentMarker: google.maps.Marker;
	private directionsRenderer: google.maps.DirectionsRenderer;

	constructor(options: RouteOptions) {
		const { currentMarkerOptions, endMarkerOptions } = options;
		this.currentMarker = new google.maps.Marker(currentMarkerOptions);
		this.endMarker = new google.maps.Marker(endMarkerOptions);
		this.directionsRenderer = new google.maps.DirectionsRenderer({
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "#FFCD00",
				strokeOpacity: .5,
				strokeWeight: 5
			}
		});
		this.directionsRenderer.setMap(this.currentMarker.getMap() as google.maps.Map);
		this.calculateRoute();
	}

	private calculateRoute(): void {
		const currentPosition = this.currentMarker.getPosition() as google.maps.LatLng;
		const endPosition = this.endMarker.getPosition() as google.maps.LatLng;
		new google.maps.DirectionsService().route({
			origin: currentPosition,
			destination: endPosition,
			travelMode: google.maps.TravelMode.DRIVING
		}, (result, sataus) => {
			if (sataus === 'OK') {
				this.directionsRenderer.setDirections(result);
				return;
			}
			throw new Error(sataus);
		});
	}

	public delete(): void {
		this.currentMarker.setMap(null);
		this.endMarker.setMap(null);
		this.directionsRenderer.setMap(null);
	}

}

type MapRoutes = {
	[id: string]: Route
}

export class Map {

	public map: google.maps.Map;
	public routes: MapRoutes = {};

	constructor(element: Element, options: google.maps.MapOptions) {
		this.map = new google.maps.Map(element, options);
	}

	public moveCurrentMarker(id: string, position: google.maps.ReadonlyLatLngLiteral): void {
		this.routes[id].currentMarker.setPosition(position);
	}

	removeRoutes(id: string): void {
		const route = this.routes[id];
		route.delete();
		delete this.routes[id];
	}

	public addRoute(id: string, options: RouteOptions): void {
		if (id in this.routes) {
			throw new RouteExistsError();
		}
		this.routes[id] = new Route({
			currentMarkerOptions: {...options.currentMarkerOptions, map: this.map},
			endMarkerOptions: {...options.endMarkerOptions, map: this.map}
		});
		this.fitBounds();
	}

	private fitBounds(): void {
		const bounds = new google.maps.LatLngBounds();
		Object.keys(this.routes).forEach((id: string) => {
			const route = this.routes[id];
			bounds.extend(route.currentMarker.getPosition() as any);
			bounds.extend(route.endMarker.getPosition() as any);
		});
		this.map.fitBounds(bounds);
	}

}
