import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import s3Config from '@config/s3.config';
import { AwsModule } from '@infrastructure/aws/aws.module';
import { ImageController } from '@domain/media/controllers/image.controller';
import { ImageService } from '@domain/media/services/image.service';

@Module({
    imports: [ConfigModule.forFeature(s3Config), AwsModule],
    controllers: [ImageController],
    providers: [ImageService],
})
export class MediaModule {}
