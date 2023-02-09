import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
//
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Route, RouteDocument } from './entities/route.entity';

@Injectable()
export class RoutesService {

	constructor(@InjectModel(Route.name) private readonly routeEntity: Model<RouteDocument>) {
	}

	public create(createRouteDto: CreateDto) {
		return 'This action adds a new route';
	}

	public findAll(): Promise<RouteDocument[]> {
		return this.routeEntity.find().exec();
	}

	public findOne(id: number) {
		return `This action returns a #${id} route`;
	}

	public update(id: number, updateRouteDto: UpdateDto) {
		return `This action updates a #${id} route`;
	}

	public remove(id: number) {
		return `This action removes a #${id} route`;
	}
}
