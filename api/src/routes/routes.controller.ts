import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Producer } from 'kafkajs';
//
import { RoutesService } from './routes.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { RoutesGateway } from './routes.gateway';

@Controller('routes')
export class RoutesController implements OnModuleInit {

	private producerKafka: Producer;

	constructor(
		private readonly routesService: RoutesService,
		@Inject('KAFKA_SERVICE')
		private readonly clientKafka: ClientKafka,
		private readonly routeGateway: RoutesGateway
	) {
	}

	public async onModuleInit(): Promise<void> {
		// this.producerKafka = await this.clientKafka.connect();
	}

	@Post()
	public create(@Body() createRouteDto: CreateDto) {
		return this.routesService.create(createRouteDto);
	}

	@Get()
	public findAll() {
		return this.routesService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string) {
		return this.routesService.findOne(+id);
	}

	@Patch(':id')
	public update(@Param('id') id: string, @Body() updateRouteDto: UpdateDto) {
		return this.routesService.update(+id, updateRouteDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string) {
		return this.routesService.remove(+id);
	}

	@Get(':id/start')
	public async startRoute(@Param('id') id: string) {
		await this.producerKafka.send({
			topic: 'route.direction',
			messages: [{
				key: 'route.direction',
				value: JSON.stringify({ route_id: id, client_id: '' })
			}]
		})
		return { status: 'success' }
	}

	@MessagePattern('route.position')
	public consumePosition(@Payload() message: any) {
		console.log(message);
		this.routeGateway.sendPosition(message);
	}

}
