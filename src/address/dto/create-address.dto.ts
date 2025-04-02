import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'Тверская улица',
    description: 'Название адреса (Москва)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Рядом с Кремлём',
    description: 'Описание адреса',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '74951234567',
    description: 'Номер телефона в формате 7XXXXXXXXXX',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^7\d{10}$/, { message: 'Введите номер в формате 74951234567' })
  phone_number: string;

  @ApiProperty({
    example: '55.7558, 37.6173',
    description: 'Координаты (широта, долгота) Москвы',
  })
  @IsString()
  @IsNotEmpty()
  latitude_altitude: string;
}
