package main

import (
	goKafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"log"
	appKafka "simulator/application/kafka"
	"simulator/infra/kafka"
)

func init()  {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error in load .env file")
	}
}

func main() {
	messageChan := make(chan *goKafka.Message)
	consumer := kafka.NewConsumer(messageChan)
	go consumer.Consume()
	for message := range messageChan{
		go appKafka.Produce(message)
	}
}
