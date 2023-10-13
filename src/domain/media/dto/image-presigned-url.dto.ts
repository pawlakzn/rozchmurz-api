import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ImagePresignedUrlDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public mimeType: string;

    @IsBoolean()
    @IsNotEmpty()
    @Transform(({ value }) => {
        return value === 'true' ? true : value === 'false' ? false : value;
    })
    @ApiProperty({ required: false })
    public shouldCreateThumbnail: boolean;
}
