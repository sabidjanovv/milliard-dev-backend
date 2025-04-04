import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { createApiResponse } from '../common/utils/api-response';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto, file?: Express.Multer.File) {
    if (file) {
      createProjectDto['image'] = `/uploads/${file.filename}`;
    }

    const project = new this.projectModel(createProjectDto);
    await project.save();

    return createApiResponse(201, 'Проект успешно создан', {
      payload: project,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const limit = paginationDto.limit ?? 20;
    const page = paginationDto.page ?? 1;
    const fromDate = paginationDto.fromDate;
    const toDate = paginationDto.toDate;
    const filter: any = {};

    if (fromDate || toDate) {
      if (fromDate && !/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        throw new BadRequestException(
          'Invalid fromDate format. Use YYYY-MM-DD',
        );
      }
      if (toDate && !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
        throw new BadRequestException('Invalid toDate format. Use YYYY-MM-DD');
      }

      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = `${fromDate} 00:00:00`;
      if (toDate) filter.createdAt.$lte = `${toDate} 23:59:59`;
    }
    const totalCount = await this.projectModel.countDocuments(filter);
    const projects = await this.projectModel
      .find(filter)
      .sort({ _id: 'desc' })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    return createApiResponse(200, 'Список проектов', {
      payload: projects,
      total: totalCount,
      limit,
      page,
    });
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Проект с таким ID не найден');
    }
    return createApiResponse(200, 'Проект найден', {
      payload: project,
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Проект с таким ID не найден');
    }

    return createApiResponse(200, 'Проект успешно обновлен', {
      payload: updatedProject,
    });
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException('Проект с таким ID не найден');
    }
    return createApiResponse(200, 'Проект успешно удален', {
      payload: deletedProject, // yoki agar hech narsa qaytarilmasa: payload: null
    });
  }
}
