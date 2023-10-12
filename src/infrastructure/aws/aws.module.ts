import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3ProviderService } from './services/s3-provider.service';
import { S3Service } from './services/s3.service';
import s3Config from '../../config/s3.config';

@Module({
    imports: [ConfigModule.forFeature(s3Config)],
    providers: [S3Service, S3ProviderService],
    exports: [S3Service],
})
export class AwsModule {}
