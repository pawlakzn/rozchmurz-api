import { ApiBody } from '@nestjs/swagger';
import {
    ReferenceObject,
    SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function ApiMultiPartBody(
    properties: Record<string, SchemaObject | ReferenceObject>,
): MethodDecorator {
    return (target: any, key: string | symbol) => {
        ApiBody({
            schema: {
                type: 'object',
                properties: properties,
            },
        })(target, key, Object.getOwnPropertyDescriptor(target, key)!);
    };
}
