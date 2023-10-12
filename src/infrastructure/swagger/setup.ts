import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pJson from '@root/../package.json';

const getPackageJsonParam = (paramName: string, def = ''): string => {
    try {
        // @ts-ignore
        return pJson[paramName];
    } catch {}

    return def;
};

export const setupSwagger = (app: INestApplication): void => {
    const options = new DocumentBuilder()
        .setTitle(getPackageJsonParam('name'))
        .setDescription(getPackageJsonParam('description'))
        .setVersion(getPackageJsonParam('version', 'x.x.x'))
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/docs', app, document);
};
