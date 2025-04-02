import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeveloperDto {
  @ApiProperty({ description: 'Полное имя разработчика' })
  @IsString()
  full_name: string;

  @ApiProperty({ description: 'Ссылка на Telegram', required: false })
  @IsOptional()
  @IsString()
  tg_link?: string;

  @ApiProperty({ description: 'Ссылка на LinkedIn', required: false })
  @IsOptional()
  @IsString()
  linkedln_link?: string;

  @ApiProperty({ description: 'Электронная почта разработчика' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '74951234567',
    description: 'Номер телефона в формате 7XXXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^7\d{10}$/, { message: 'Введите номер в формате 74951234567' })
  phone_number: string;

  @ApiProperty({ description: 'Описание разработчика', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
