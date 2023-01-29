import { Injectable } from "@nestjs/common";
import { KafkaOptions } from "@nestjs/microservices";
import { Consumer, ConsumerConfig, Kafka, KafkaConfig, Producer, ProducerConfig } from "kafkajs";


export interface KafkaClientConfig {
    consumer?: ConsumerConfig
    producer?: ProducerConfig
    client: KafkaConfig
}

export class KafkaClient {
    private client: Kafka
    private consumer: Consumer
    private producer: Producer
    constructor(options: KafkaClientConfig) {
        this.client = new Kafka(options.client)
        this.consumer = this.client.consumer(options.consumer)
        this.producer = this.client.producer(options.producer)
    }

    connect() {
        this.consumer.connect()
        this.producer.connect()
    }

    close() {
        this.producer.disconnect()
        this.producer.disconnect()
    }

    async call(topic: string, messages: any) {
        //emit to kafka
        await this.producer.send({
            topic,
            messages
        })

        //subcribe handled data from kafka
        // await this.consumer.subscribe({topic:`${topic}.handled`,fromBeginning:false})
        // const handledData = await this.consumer.run({
        //     eachMessage: async ({ topic, partition, message }) => {
                
                
        //     },
        // })
         
    }
    emit(topic: string, data: any) {

    }


}