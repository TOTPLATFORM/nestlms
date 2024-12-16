import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AgoraTokenService } from '../class.service';
@Controller('admin')
export class AdminLiveClassController {
  constructor(private readonly AgoraTokenService: AgoraTokenService) {}

  @Post('create-live-class')
  createLiveClass() {
    return this.AgoraTokenService.generateAccessToken('onion', '123456789');
  }
}
