package kafka

import (
	"encoding/json"
	goKafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
	appRoute "simulator/application/route"
	"simulator/infra/kafka"
	"time"
)

// Produce {"client_id": "1", "route_id": "1"}
func Produce(message *goKafka.Message)  {
	producer := kafka.NewProducer()
	route := appRoute.NewRoute()
	json.Unmarshal(message.Value, &route)
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Println("application produce error ", err.Error())
	}
	for _ , p := range positions{
		producer.Publish(p, os.Getenv("KAFKA_PRODUCE_TOPIC"))
		log.Println(p)
		time.Sleep(time.Millisecond * 500)
	}
}
