import { BadRequestException, ValidationPipe } from '@nestjs/common';

const validationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors): BadRequestException => new BadRequestException(errors),
});

export default validationPipe;
