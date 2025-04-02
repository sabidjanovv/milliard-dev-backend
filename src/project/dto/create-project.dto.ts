import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Awesome Project', description: 'Название проекта' })
  @IsNotEmpty({ message: 'Название проекта обязательно' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'Это очень крутой проект',
    description: 'Описание проекта',
  })
  @IsNotEmpty({ message: 'Описание проекта обязательно' })
  @IsString({ message: 'Описание должно быть строкой' })
  description: string;

  @ApiProperty({
    example: 'https://github.com/awesome-project',
    description: 'Ссылка на проект',
  })
  @IsNotEmpty({ message: 'Ссылка на проект обязательна' })
  @IsUrl({}, { message: 'Ссылка должна быть корректным URL' })
  link: string;

  @ApiProperty({
    description: 'Изображение проекта',
    type: 'string',
    format: 'binary', // Swagger-specific to indicate a file upload
  })
  image?: string;

  @ApiProperty({
    example: '64e3f1a8d3a8b3f4f5e7c4d1',
    description: 'ID разработчика',
  })
  @IsNotEmpty({ message: 'ID разработчика обязателен' })
  @IsString({ message: 'ID разработчика должен быть строкой' })
  developerId: string;
}
