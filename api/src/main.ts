import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
//
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.connectMicroservice({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: process.env.KAFKA_CLIENT_ID,
				brokers: [process.env.KAFKA_BROKER]
			},
			consumer: {
				groupId: "consumer" + Math.random(),
			}
		}
	})
	await app.startAllMicroservices();
	await app.listen(3001);
}

(async () => await bootstrap())();
