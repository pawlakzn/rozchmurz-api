import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import s3Config from '@config/s3.config';
import { RawFile } from '@utils/types';
import { S3_PHOTOS_DIRECTORY } from '@infrastructure/aws/constants/s3.constants';
import { S3Service } from '@infrastructure/aws/services/s3.service';
import { BUCKET_ACL, MAX_FILE_SIZE_IN_BYTES } from '@domain/media/constants/media.constants';
import { ImagePresignedUrlDto } from '@domain/media/dto/image-presigned-url.dto';
import { PresignedUrlResponse } from '@domain/media/interfaces/presigned-url.response.interface';

@Injectable()
export class ImageService {
    private readonly bucket: string;

    constructor(
        @Inject(s3Config.KEY)
        private readonly s3Conf: ConfigType<typeof s3Config>,
        private readonly s3Service: S3Service,
    ) {
        if (!this.s3Conf.mediaBucket) {
            throw new Error('Media bucket is not defined');
        }

        this.bucket = this.s3Conf.mediaBucket;
    }

    public async createImagePresignedUrl(
        imagePresignedUrlDto: ImagePresignedUrlDto,
    ): Promise<PresignedUrlResponse> {
        // TODO: add mimetype validation
        // const media = await this.mediaRepository.createEmptyMedia();
        const date = new Date();
        const id = uuidV4();
        const s3Key = `${S3_PHOTOS_DIRECTORY}/${date.getFullYear()}/${
            date.getMonth() + 1
        }/${uuidV4()}`;
        const presignedPost = await this.s3Service.generatePresignedPost(
            this.bucket,
            s3Key,
            id,
            imagePresignedUrlDto.mimeType,
            MAX_FILE_SIZE_IN_BYTES,
            imagePresignedUrlDto.shouldCreateThumbnail,
        );

        if (!presignedPost) {
            throw new Error('Failed to generate presigned post');
        }

        return {
            url: presignedPost.url,
            id,
            fields: Object.assign(presignedPost.fields, {
                key: s3Key,
                acl: BUCKET_ACL,
                'Content-Type': imagePresignedUrlDto.mimeType,
                tagging: `<Tagging><TagSet><Tag><Key>mediaId</Key><Value>${id}</Value></Tag><Tag><Key>shouldCreateThumbnail</Key><Value>${imagePresignedUrlDto.shouldCreateThumbnail}</Value></Tag></TagSet></Tagging>`,
            }),
        };
    }

    public async uploadFile(file: RawFile): Promise<void> {
        if (!file) {
            throw new Error('File is not defined');
        }

        const awsKey = uuidV4();
        const result = await this.s3Service.upload(this.bucket, awsKey, file.buffer, file.mimetype);

        console.log('result', result);
    }
}
