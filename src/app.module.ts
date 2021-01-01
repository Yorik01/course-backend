import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateModule } from './modules/certificate/certificate.module';
import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/course/lesson/lesson.module';
import { JwtGuard } from './modules/guards/jwt.guard';
import { MediaModule } from './modules/media/media.module';
import { StrategyModule } from './modules/strategy/strategy.module';
import { UserCourseModule } from './modules/user-course/user-course.module';
import { UserModule } from './modules/user/user.module';

import { ConfigService } from './shared/services/config.service';

import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    MediaModule,
    CourseModule,
    LessonModule,
    UserModule,
    StrategyModule,
    UserCourseModule,
    CertificateModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule { }
