import { Controller, Get, Param, ParseIntPipe, Response } from '@nestjs/common';
import { CertificateService } from '../certificate.service';
import { Response as ExpressResponse } from 'express';
import fs from 'fs';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';

@Controller('certificate')
export class UserCertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get('generate-certificate-:course_id')
  async generateCertificate(
    @UserInfo() user: User,
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return this.certificateService.generateCertificate(user, course_id);
  }
}
