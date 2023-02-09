import { Position } from "../@types/position";

export function getCurrentPosition(options?: PositionOptions): Promise<Position> {
	return new Promise<Position>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			resolve({ lat: coords.latitude, lng: coords.longitude });
		}, error => {
			reject(error);
		});
	});
}
