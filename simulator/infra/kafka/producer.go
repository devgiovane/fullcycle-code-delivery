package kafka

import (
	goKafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
)

type Producer struct {
	producer *goKafka.Producer
}

func NewProducer() *Producer  {
	configMap := &goKafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
	}
	p, err := goKafka.NewProducer(configMap)
	if err != nil {
		log.Println("kafka producer error", err.Error())
	}
	return &Producer{
		producer: p,
	}
}

func (k *Producer) Publish(message string, topic string) error {
	kafkaMessage := &goKafka.Message{
		TopicPartition: goKafka.TopicPartition{Topic: &topic, Partition: goKafka.PartitionAny},
		Value: []byte(message),
	}
	err := k.producer.Produce(kafkaMessage, nil)
	if err != nil {
		return err
	}
	return nil
}
