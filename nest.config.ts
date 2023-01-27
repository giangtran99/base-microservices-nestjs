import { CacheModule, CacheStore } from '@nestjs/common';
import {redisStore} from 'cache-manager-redis-store';
// import type { ClientOpts } from 'redis';
import { CACHE_STORE } from 'helper/enum';
import * as dotenv from 'dotenv'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
dotenv.config()

// console.log({on:redisStore.})

const Config = {
    cache: {
        currentStore: CACHE_STORE.REDIS,
        store: {
            [CACHE_STORE.REDIS]: CacheModule.registerAsync({
                imports: [ConfigModule],
                useFactory: async (config: ConfigService) =>{
                  const store = await redisStore({
                    socket: {
                      host: process.env.REDIS_HOST,
                      port: +process.env.REDIS_PORT
                    },
                  }) as unknown as CacheStore
                  return {
                    store: store as unknown as CacheStore,
                    ttl: 60 * 10,
                  }
                },
                inject: [ConfigService],
              }),
            
            [CACHE_STORE.LOCAL_MEMORY]: CacheModule.register({
            })
        },
    },
    jwt: {
        jwtSecrect: process.env.JWT_SECRET,
        refreshTokenExpire: "7d",
        accessTokenExpire: "1d"
    },
    cors:{
      origin: 'http://localhost:3001',
      credentials: true,
      
    } as CorsOptions
}

export default Config