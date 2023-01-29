import { DynamicModule, Module } from "@nestjs/common";
import { KafkaOptions } from "@nestjs/microservices";
import { KafkaConfig } from "kafkajs";
import { KafkaClient, KafkaClientConfig } from "./kafka-client";



@Module({})
export class KafkaModule {
    static register(options:KafkaClientConfig): DynamicModule {
        const kafkaClient = new KafkaClient(options)
        
        return {
            module: KafkaModule,
            exports:[
                {
                    provide: "KAFKA_CLIENT",
                    useValue: kafkaClient
                }
            ],
            providers: [
                {
                    provide: "KAFKA_CLIENT",
                    useValue: kafkaClient
                }
            ]
        }
    }
}