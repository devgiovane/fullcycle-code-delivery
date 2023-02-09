import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type Position = {
	lat: number,
	lng: number
}

@Schema()
export class Route {

	@Prop()
	public  _id: string;

	@Prop()
	public title: string;

	@Prop(raw({
		lat: { type: Number},
		lng: { type: Number}
	}))
	public startPosition: Position;

	@Prop(raw({
		lat: { type: Number},
		lng: { type: Number}
	}))
	public endPosition: Position;
}

export type RouteDocument = Route & Document;
export const RouteSchema = SchemaFactory.createForClass(Route);
