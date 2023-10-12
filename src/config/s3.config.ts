import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
    region: process.env.S3_AWS_REGION,
    accessKeyId: process.env.S3_POLICY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_POLICY_AWS_SECRET_ACCESS_KEY,
    mediaBucket: process.env.S3_AWS_MEDIA_BUCKET_NAME,
}));
