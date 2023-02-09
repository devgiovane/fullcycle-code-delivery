package kafka

import (
	goKafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
)

type Consumer struct {
	MessageChan chan *goKafka.Message
}

func NewConsumer(messageChan chan *goKafka.Message) *Consumer {
	return &Consumer{
		MessageChan: messageChan,
	}
}

func (k* Consumer) Consume()  {
	configMap := &goKafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
		"group.id": os.Getenv("KAFKA_CONSUMER_GROUP_ID"),
	}
	c, err := goKafka.NewConsumer(configMap)
	if err != nil {
		log.Fatalf("kafka consumer error " + err.Error())
	}
	topics := []string{os.Getenv("KAFKA_CONSUME_TOPIC")}
	c.SubscribeTopics(topics, nil)
	log.Println("kafka consumer has been stared")
	for {
		message, err := c.ReadMessage(-1)
		if err == nil {
			k.MessageChan <- message
		}
	}
}
