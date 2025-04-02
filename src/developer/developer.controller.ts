import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Developer } from './schemas/developer.schema'; // Developer schema

@ApiTags('Разработчики') // Grouping in Swagger
@Controller('developers')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  // Создание разработчика
  @Post()
  @ApiOperation({ summary: 'Создать нового разработчика' })
  @ApiResponse({
    status: 201,
    description: 'Разработчик успешно создан.',
    type: Developer,
  })
  async create(
    @Body() createDeveloperDto: CreateDeveloperDto,
  ){
    return this.developerService.create(createDeveloperDto);
  }

  // Получение всех разработчиков
  @Get()
  @ApiOperation({ summary: 'Получить всех разработчиков' })
  @ApiResponse({
    status: 200,
    description: 'Список всех разработчиков.',
    type: [Developer],
  })
  async findAll(){
    return this.developerService.findAll();
  }

  // Получение разработчика по ID
  @Get(':id')
  @ApiOperation({ summary: 'Получить разработчика по ID' })
  @ApiResponse({
    status: 200,
    description: 'Разработчик найден.',
    type: Developer,
  })
  @ApiResponse({
    status: 404,
    description: 'Разработчик с таким ID не найден.',
  })
  async findOne(@Param('id') id: string){
    return this.developerService.findOne(id);
  }

  // Обновление разработчика по ID
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить разработчика по ID' })
  @ApiResponse({
    status: 200,
    description: 'Разработчик успешно обновлен.',
    type: Developer,
  })
  @ApiResponse({
    status: 404,
    description: 'Разработчик с таким ID не найден.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ){
    return this.developerService.update(id, updateDeveloperDto);
  }

  // Удаление разработчика по ID
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить разработчика по ID' })
  @ApiResponse({
    status: 200,
    description: 'Разработчик успешно удален.',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Разработчик с таким ID не найден.',
  })
  async remove(@Param('id') id: string){
    return this.developerService.remove(id);
  }
}
