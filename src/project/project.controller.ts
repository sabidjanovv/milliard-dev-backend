import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';  // fs modulini import qilish

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Создать проект' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        developerId: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Upload folder
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname); // Get file extension
          callback(null, `${uniqueSuffix}${ext}`); // Unique file name
        },
      }),
    }),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createProjectDto.image = file.filename; // Store file name in DTO
    }
    return this.projectService.create(createProjectDto); // Pass to service
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех проектов' })
  async findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить проект по ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить проект по ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiConsumes('multipart/form-data') // Important for handling form data (including files)
  @ApiBody({
    description: 'Обновить проект с изображением',
    type: UpdateProjectDto,
    required: false, // image is optional
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Upload folder
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname); // Get file extension
          callback(null, `${uniqueSuffix}${ext}`); // Save only the file name
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Fetch the existing project
    const existingProject = await this.projectService.findOne(id);

    // If the project is not found, throw an exception
    if (!existingProject) {
      throw new NotFoundException('Проект с таким ID не найден');
    }

    // If an image exists, remove the old one
    if (existingProject.data?.image) {
      const oldImagePath = `./uploads/${existingProject.data.image}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Eski rasmini o'chirish
      } else {
        console.log('Fayl topilmadi:', oldImagePath);
      }
    }

    // If a new image is uploaded, save the new image
    if (file) {
      updateProjectDto['image'] = file.filename; // Save the file name, not the full path
    } else {
      // Keep the old image if no new image is uploaded
      updateProjectDto['image'] = existingProject.data?.image;
    }

    return this.projectService.update(id, updateProjectDto); // Pass to service for updating
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить проект по ID' })
  @ApiParam({ name: 'id', type: 'string' })
  async remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
