import { CacheInterceptor, CacheKey, CacheTTL, CACHE_MANAGER, Controller, HttpCode, Inject, OnModuleDestroy, OnModuleInit, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateManyDto, Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard-strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard-strategy/roles.guard';
import { Roles } from 'decorators/roles.decorator';
import { Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Client, ClientKafka, MessagePattern, Transport } from '@nestjs/microservices';
import { PartitionerArgs } from 'kafkajs';
import { lastValueFrom, Observable } from 'rxjs';
// import { Cache } from 'cache-manager';



//https://github.com/nestjsx/crud/wiki/Requests#search
@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
// @Roles("admin")
// @UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
// @UseGuards(RolesGuard)
export class UsersController implements CrudController<User>, OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientKafka,
    public service: UsersService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }
  get base(): CrudController<User> {
    return this;
  }

  async onModuleInit() {
    const requestPatterns = ['user.list'];
    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Override()
  // @HttpCode(200)
  // @Roles("admin")
  // @CacheTTL(60 * 5)
  // @UseInterceptors(CacheInterceptor)
  // @MessagePattern("user.list")
  async getMany(
    // @Req() expressReq: Request,
    @ParsedRequest() req: CrudRequest,
  ) : Promise<Observable<any>>{
    // const users = await this.base.getManyBase(req)
    const result = await lastValueFrom(this.client.send('user.list', {
      headers: {
        toPartition: 1,
      },
      key: '1',
      value: {
        users: "alo alo",
      },
    }))
    return result
    // return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getOneAndDoStuff(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<User>
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  coolFunction(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  awesomePUT(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
  ) {
    return this.base.deleteOneBase(req);
  }

}
