import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Addresses') // Yangi manzillar uchun API
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Create a new address
  @Post()
  @ApiOperation({ summary: 'Создание нового адреса' })
  @ApiResponse({ status: 201, description: 'Адрес успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос' })
  async create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  // Get all addresses
  @Get()
  @ApiOperation({ summary: 'Получить все адреса' })
  @ApiResponse({ status: 200, description: 'Все адреса успешно получены' })
  @ApiResponse({ status: 404, description: 'Адреса не найдены' })
  async findAll() {
    return this.addressService.findAll();
  }

  // Get a single address by ID
  @Get(':id')
  @ApiOperation({ summary: 'Получить адрес по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID адреса',
    example: '60b7c3e8f1a7e564c6d1c2f1', // Example of a valid address ID
  })
  @ApiResponse({ status: 200, description: 'Адрес найден' })
  @ApiResponse({ status: 404, description: 'Адрес с таким ID не найден' })
  async findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  // Update an existing address by ID
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить адрес по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID адреса для обновления',
  })
  @ApiResponse({ status: 200, description: 'Адрес успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Адрес с таким ID не найден' })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(id, updateAddressDto);
  }

  // Delete an address by ID
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить адрес по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID адреса для удаления',
  })
  @ApiResponse({ status: 200, description: 'Адрес успешно удален' })
  @ApiResponse({ status: 404, description: 'Адрес с таким ID не найден' })
  async remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
