import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Developer, DeveloperDocument } from './schemas/developer.schema';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { createApiResponse } from '../common/utils/api-response';
import { ApiResponse } from '../common/types/api-response.type';

@Injectable()
export class DeveloperService {
  constructor(
    @InjectModel(Developer.name)
    private readonly developerModel: Model<DeveloperDocument>,
  ) {}

  // Create a new developer
  async create(
    createDeveloperDto: CreateDeveloperDto,
  ): Promise<ApiResponse<Developer>> {
    const newDeveloper = new this.developerModel(createDeveloperDto);
    const savedDeveloper = await newDeveloper.save();

    return createApiResponse(201, 'Разработчик успешно создан', savedDeveloper); // Return created developer
  }

  // Get all developers
  async findAll(): Promise<ApiResponse<Developer[]>> {
    const developers = await this.developerModel.find().exec();
    return createApiResponse(200, 'Список всех разработчиков', developers); // Return list of developers
  }

  // Get one developer by ID
  async findOne(id: string): Promise<ApiResponse<Developer>> {
    const developer = await this.developerModel.findById(id).exec();
    if (!developer) {
      throw new NotFoundException('Разработчик с таким ID не найден');
    }

    return createApiResponse(200, 'Разработчик найден', developer); // Return the found developer
  }

  // Update a developer by ID
  async update(
    id: string,
    updateDeveloperDto: UpdateDeveloperDto,
  ): Promise<ApiResponse<Developer>> {
    const updatedDeveloper = await this.developerModel
      .findByIdAndUpdate(id, updateDeveloperDto, { new: true })
      .exec();

    if (!updatedDeveloper) {
      throw new NotFoundException('Разработчик с таким ID не найден');
    }

    return createApiResponse(
      200,
      'Разработчик успешно обновлён',
      updatedDeveloper,
    ); // Return updated developer
  }

  // Remove a developer by ID
  async remove(id: string): Promise<ApiResponse<string>> {
    const deletedDeveloper = await this.developerModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedDeveloper) {
      throw new NotFoundException('Разработчик с таким ID не найден');
    }

    return createApiResponse(
      200,
      'Разработчик успешно удалён',
      `Разработчик с ID ${id} был удалён`,
    );
  }
}
