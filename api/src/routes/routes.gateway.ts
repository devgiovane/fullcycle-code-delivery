import { Producer } from 'kafkajs';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RoutesGateway implements OnModuleInit {

	@WebSocketServer()
	private server: Server;

	private producerKafka: Producer;

	constructor(
		@Inject('KAFKA_SERVICE')
		private readonly clientKafka: ClientKafka
	) {
	}

	public async onModuleInit(): Promise<void> {
		this.producerKafka = await this.clientKafka.connect();
	}

	@SubscribeMessage('direction')
	public async handleMessage(client: Socket, payload: { id: string }) {
		await this.producerKafka.send({
			topic: 'route.direction',
			messages: [{
				key: 'route.direction',
				value: JSON.stringify({
					route_id: payload.id,
					client_id: client.id
				})
			}]
		});
		console.log(payload);
	}

	public sendPosition(data: { client_id: string, route_id: string, position: [ number, number ], finished: boolean}) {
		const { client_id, ...rest } = data;
		const clients = this.server.sockets.sockets;
		const socket = clients.get(client_id);
		socket.emit('position', rest);
	}

}
