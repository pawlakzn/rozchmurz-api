import { GetObjectOutput } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { Injectable, Logger } from '@nestjs/common';
import { PassThrough } from 'node:stream';
import { Uuid } from '@utils/types';
import { BUCKET_ACL } from '@domain/media/constants/media.constants';
import { S3ProviderService } from './s3-provider.service';

@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);

    constructor(private readonly s3ProviderService: S3ProviderService) {}

    public provider(): S3ProviderService {
        return this.s3ProviderService;
    }

    public async generatePresignedPost(
        bucket: string,
        s3Key: string,
        mediaId: Uuid,
        mimeType: string,
        maxFileSize: number,
        shouldCreateThumbnail: boolean,
    ): Promise<PresignedPost | undefined> {
        const Conditions = [
            { acl: BUCKET_ACL } as Record<string, string>,
            { bucket } as Record<string, string>,
            ['eq', '$Content-Type', mimeType] as ['eq', string, string],
            [
                'eq',
                '$Tagging',
                `<Tagging><TagSet><Tag><Key>mediaId</Key><Value>${mediaId}</Value></Tag><Tag><Key>shouldCreateThumbnail</Key><Value>${shouldCreateThumbnail}</Value></Tag></TagSet></Tagging>`,
            ] as ['eq', string, string],
            ['content-length-range', 0, maxFileSize] as ['content-length-range', number, number],
        ];
        const options = {
            Bucket: bucket,
            Key: s3Key,
            Conditions,
            Fields: { acl: BUCKET_ACL },
        };

        try {
            return createPresignedPost(this.s3ProviderService.getS3(), options);
        } catch (err) {
            this.logger.error(err);
        }
    }

    public async deleteFile(s3Key: string, bucket: string): Promise<void> {
        await this.s3ProviderService.getS3().deleteObject({ Key: s3Key, Bucket: bucket });
    }

    public async getFile(s3Key: string, bucket: string): Promise<GetObjectOutput> {
        return this.s3ProviderService.getS3().getObject({ Key: s3Key, Bucket: bucket });
    }

    public async upload(
        bucket: string,
        s3Key: string,
        body: Buffer,
        mimeType: string,
    ): Promise<void> {
        await this.s3ProviderService.getS3().putObject({
            Bucket: bucket,
            Key: s3Key,
            ACL: BUCKET_ACL,
            ContentType: mimeType,
            Body: body,
        });
    }

    public async uploadStream(
        bucket: string,
        s3Key: string,
        body: PassThrough,
        mimeType: string,
    ): Promise<any> {
        return new Promise((resolve) => {
            this.s3ProviderService.getS3().putObject(
                {
                    Bucket: bucket,
                    Key: s3Key,
                    Body: body,
                    ContentType: mimeType,
                },
                (error, data) => {
                    this.logger.log('Zip uploaded.', error, data);
                    resolve(s3Key);
                },
            );
        });
    }
}
