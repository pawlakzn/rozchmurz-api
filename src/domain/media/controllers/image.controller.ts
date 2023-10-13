import { Body, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBadRequestResponse,
    ApiConsumes,
    ApiNoContentResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiMultiPartBody } from '@utils/decorators/api-multipart-body.decorator';
import { RawFile } from '@utils/types';
import { MAX_FILE_SIZE_IN_BYTES } from '@domain/media/constants/media.constants';
import { ImagePresignedUrlDto } from '@domain/media/dto/image-presigned-url.dto';
import { PresignedUrlResponse } from '@domain/media/interfaces/presigned-url.response.interface';
import { ImageService } from '@domain/media/services/image.service';

@Controller('images')
@ApiTags('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiNoContentResponse({ status: HttpStatus.NO_CONTENT })
    @ApiBadRequestResponse()
    @ApiMultiPartBody({
        file: {
            type: 'string',
            format: 'binary',
            nullable: false,
        },
    })
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_IN_BYTES } }))
    public async uploadImage(@UploadedFile() file: RawFile): Promise<void> {
        await this.imageService.uploadFile(file);
    }

    @Post('url')
    @ApiResponse({ status: HttpStatus.CREATED })
    @ApiBadRequestResponse()
    public createImagePresignedUrl(
        @Body() imagePresignedUrlDto: ImagePresignedUrlDto,
    ): Promise<PresignedUrlResponse> {
        return this.imageService.createImagePresignedUrl(imagePresignedUrlDto);
    }
}
