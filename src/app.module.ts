import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import { AwsModule } from '@infrastructure/aws/aws.module';
import { MediaModule } from '@domain/media/media.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: `${process.cwd()}/.env`,
        }),
        AwsModule,
        MediaModule,
    ],
})
export class AppModule {}
