import { DynamicModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Config from 'nest.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PartitionerArgs } from 'kafkajs';
import { KafkaModule } from 'cores/microservices/kafka/kafka-module';


const explicitPartitioner = () => {
  return ({ message }: PartitionerArgs) => {
    console.log({summer:message})
    return parseFloat(message.headers.toPartition.toString());
  };
};


@Module({
  imports: [
    Config.cache.store[Config.cache.currentStore],
    TypeOrmModule.forFeature([User]),
    KafkaModule.register({
        client:{
          clientId: 'user-service',
          brokers: ['192.168.1.12:9092'],
        },
        consumer:{
          groupId: 'user-consumer'
        }
    })
    // ClientsModule.register([
    //   {
    //     name: 'USER_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'user-service',
    //         brokers: ['192.168.1.8:9092'],

    //       },
    //       consumer: {
    //         // sessionTimeout: 10000,
    //         groupId: 'user-consumer' // hero-consumer-client
    //       },
    //       producer:{
    //       }
    //       // run: {
    //       //   partitionsConsumedConcurrently: 3,
    //       // },
    //       // producerOnlyMode:true,
    //       // producer: {
    //       //   createPartitioner: explicitPartitioner,
    //       // },
    //     }
    //   },
    // ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
