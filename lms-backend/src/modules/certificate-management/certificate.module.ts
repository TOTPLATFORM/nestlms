import { Module } from '@nestjs/common';
import { UserCertificateController } from './user/user-certificate.controller';
import { CertificateService } from './certificate.service';

@Module({
  controllers: [UserCertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
