import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    port: +(process.env.APP_PORT || process.env.PORT || 3000),
    swaggerEnabled: process.env.SWAGGER_ENABLED || true,
}));
