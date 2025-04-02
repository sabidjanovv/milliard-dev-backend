import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { createApiResponse } from '../common/utils/api-response';

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

    return createApiResponse(201, 'Проект успешно создан', project);
  }

  async findAll() {
    const projects = await this.projectModel.find().exec();
    return createApiResponse(200, 'Список проектов', projects);
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Проект с таким ID не найден');
    }
    return createApiResponse(200, 'Проект найден', project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Проект с таким ID не найден');
    }

    return createApiResponse(200, 'Проект успешно обновлен', updatedProject);
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException('Проект с таким ID не найден');
    }
    return createApiResponse(200, 'Проект успешно удален');
  }
}
