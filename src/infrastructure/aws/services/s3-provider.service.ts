import { S3 } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Nullable } from '@utils/types';
import s3Config from '../../../config/s3.config';

@Injectable()
export class S3ProviderService {
    private s3: Nullable<S3> = null;

    constructor(
        @Inject(s3Config.KEY)
        private s3Conf: ConfigType<typeof s3Config>,
    ) {}

    public getS3(): S3 {
        if (!this.s3Conf.accessKeyId) {
            throw new Error('S3 accessKeyId is not defined');
        }

        if (!this.s3Conf.secretAccessKey) {
            throw new Error('S3 secretAccessKey is not defined');
        }

        if (!this.s3Conf.region) {
            throw new Error('S3 region is not defined');
        }

        if (!this.s3) {
            this.s3 = new S3({
                region: this.s3Conf.region,
                credentials: {
                    accessKeyId: this.s3Conf.accessKeyId,
                    secretAccessKey: this.s3Conf.secretAccessKey,
                },
            });
        }

        return this.s3;
    }
}
