import { Controller, Get, Post, Body, Patch, Param, Delete, Res,UseInterceptors } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  Crud,
  CrudController,
  Override,
  CrudRequest,
  ParsedRequest,
  ParsedBody,
  CreateManyDto,
  GetManyDefaultResponse,
  CrudRequestInterceptor,
  CrudService,
} from '@nestjsx/crud';
import { Response , Request} from 'express'
import { Req } from '@nestjs/common/decorators';

@Crud({
  model: {
    type: User,
  }
})
@Controller('auth')
export class AuthController implements CrudController<User>{
  constructor(public authService: AuthService) { }
  service: CrudService<User>;


  @Post("/register")
  @UseInterceptors(CrudRequestInterceptor)
  register(@ParsedRequest() req: CrudRequest, @Body() createAuthDto: CreateAuthDto) {
    const payload = {
      username: createAuthDto.username,
      password: createAuthDto.password
    }
    return this.authService.register(req, payload)
  }

  @Post("/refresh-token")
  @UseInterceptors(CrudRequestInterceptor)
  refreshToken(@Req() req : Request) {
      const refreshToken = req.cookies["refresh_token"]
      this.authService.refreshToken(refreshToken)
  }

  @Post("/login")
  @UseInterceptors(CrudRequestInterceptor)

  async login(
  @Req() req : Request,
  @Res({ passthrough: true }) res : Response,
  @ParsedRequest() crudReq: CrudRequest,
  @Body() createAuthDto: CreateAuthDto){
    const payload = {
      username: createAuthDto.username,
      password: createAuthDto.password
    }
    
    const { refresh_token, access_token } = await this.authService.login(payload);
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    
    // console.log({aaa:res.header})
    return {
      access_token,
    }
  }

}
