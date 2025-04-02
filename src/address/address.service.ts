import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiResponse } from '../common/types/api-response.type';
import { createApiResponse } from '../common/utils/api-response';

// Service metodlarida 'Promise'ni ishlatish yoki 'async/await'ni qo'llash zarur
@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  // Create a new address
  async create(
    createAddressDto: CreateAddressDto,
  ): Promise<ApiResponse<Address>> {
    const createdAddress = new this.addressModel(createAddressDto);
    await createdAddress.save();

    return createApiResponse(201, 'Адрес успешно создан', createdAddress); // Return created address
  }

  // Get all addresses
  async findAll(): Promise<ApiResponse<Address[]>> {
    const addresses = await this.addressModel.find().exec(); // Await the promise to resolve

    return createApiResponse(200, 'Все адреса получены успешно', addresses); // Return addresses
  }

  // Get a single address by ID
  async findOne(id: string): Promise<ApiResponse<Address>> {
    const address = await this.addressModel.findById(id).exec(); // Await the promise to resolve

    if (!address) {
      throw new NotFoundException('Адрес с таким ID не найден');
    }

    return createApiResponse(200, 'Адрес найден', address); // Return the found address
  }

  // Update an existing address by ID
  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ApiResponse<Address>> {
    const updatedAddress = await this.addressModel
      .findByIdAndUpdate(id, updateAddressDto, { new: true })
      .exec(); // Await the promise to resolve

    if (!updatedAddress) {
      throw new NotFoundException('Адрес с таким ID не найден');
    }

    return createApiResponse(200, 'Адрес обновлен успешно', updatedAddress); // Return updated address
  }

  // Delete an address by ID
  async remove(id: string): Promise<ApiResponse<null>> {
    const deletedAddress = await this.addressModel.findByIdAndDelete(id).exec(); // Await the promise to resolve

    if (!deletedAddress) {
      throw new NotFoundException('Адрес с таким ID не найден');
    }

    return createApiResponse(200, 'Адрес удален успешно', null); // Return null as the payload
  }
}
