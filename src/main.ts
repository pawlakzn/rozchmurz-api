import { Logger as NestLogger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { urlencoded } from 'express';
import helmet, { contentSecurityPolicy, hidePoweredBy, noSniff } from 'helmet';
import validationPipe from '@utils/pipes/validation.pipe';
import { setupSwagger } from '@infrastructure/swagger/setup';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { bufferLogs: true, cors: true });
    const configService = app.get(ConfigService);
    const logger = new NestLogger('bootstrap');

    app.use(urlencoded({ extended: true, limit: '30mb' }));

    app.use(helmet());
    app.use(hidePoweredBy());
    app.use(noSniff());

    app.enableCors();
    app.useGlobalPipes(validationPipe);
    app.setGlobalPrefix(configService.get('app.apiPrefix', ''), {
        exclude: ['/', '/health', '/docs', '/changelog'],
    });
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    if (configService.get('app.swaggerEnabled')) {
        logger.log('Swagger is enabled at url "/docs"');
        app.use(
            contentSecurityPolicy({
                directives: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'script-src': [
                        // eslint-disable-next-line quotes
                        "'self'",
                        // eslint-disable-next-line quotes
                        "'unsafe-inline'",
                    ],
                },
            }),
        );
        setupSwagger(app);
    }
    await app.listen(configService.get('app.port', 3000), () => {
        logger.log(`Application is running in "${configService.get('app.port')}" port`);
    });
}
bootstrap();
