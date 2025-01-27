import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LanguageInterceptor } from '../../shared/interceptors/language.interceptor';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LanguageMiddleware } from '../../shared/middlewares/language.middleware';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { MailConfig } from 'src/shared/configs/mail.config';
import { UsersModule } from '../users/users.module';
import { ApiSecretCheckMiddleware } from 'src/shared/middlewares/apisecret.middleware';
import { FilesModule } from '../file/files.module';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import { BigIntTransformInterceptor } from 'src/shared/utils/transform.interseptor';
import googleauthConfig from 'src/shared/configs/googleauth.config';
import { CheckDemoMode } from 'src/shared/middlewares/check-demo.middleware';
import { PublicModule } from '../public/public.module';
import { LoggerModule } from '../logger/logger.module';
import { KycModule } from '../kyc/kyc.module';
import { CategoryModule } from '../category/category.module';
import { FaqModule } from '../faq/faq.module';
import { CouponModule } from '../coupon/coupon.module';
import { SubscriberModule } from '../subscriber/subscriber.module';
import { SettingsModule } from '../settings/settings.module';
import { PaymentModule } from '../payment/payment.module';
import { CourseModule } from '../course/course.module';
import { FollowerModule } from '../follower-management/follower.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { NotificationModule } from '../notification-management/notification.module';
import { ReviewModule } from '../review/review.module';
import { QuizModule } from '../quiz-management/quiz.module';
import { CertificateModule } from '../certificate-management/certificate.module';
import { EarningModule } from '../earning-management/earning.module';
import { BlogModule } from '../blog/blog.module';
import { ClassModule } from '../liveclass/class.module';
import { WishListModule } from '../wishlist-management/wishlist.module';
import { SocialMediaModule } from '../social-media-management/social-media.module';
import { LanguageModule } from '../language/language.module';
import { TranslationModule } from '../../shared/services/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [MailConfig, googleauthConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FilesModule,
    PublicModule,
    LoggerModule,
    KycModule,
    CategoryModule,
    FaqModule,
    CouponModule,
    SubscriberModule,
    SettingsModule,
    PaymentModule,
    CourseModule,
    FollowerModule,
    EnrollmentModule,
    NotificationModule,
    ReviewModule,
    QuizModule,
    CertificateModule,
    EarningModule,
    BlogModule,
    ClassModule,
    WishListModule,
    SocialMediaModule,
    LanguageModule,
    TranslationModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        const guard = new JwtAuthGuard(reflector);
        return guard;
      },
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply language middleware globally
    consumer
      .apply(LanguageMiddleware)
      .forRoutes('*');

    // Apply API secret middleware
    consumer
      .apply(ApiSecretCheckMiddleware)
      .exclude({
        path: `/${coreConstant.FILE_DESTINATION}/*`,
        method: RequestMethod.ALL,
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer.apply(CheckDemoMode).forRoutes('*');
  }
}
