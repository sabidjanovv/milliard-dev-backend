import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  // Yangi mijoz qo'shish
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const newCustomer = new this.customerModel(createCustomerDto);
    return await newCustomer.save();
  }

  // Barcha mijozlarni olish
  async findAll(): Promise<Customer[]> {
    return await this.customerModel.find().exec();
  }

  // Bitta mijozni ID orqali olish
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  // Mijoz ma'lumotlarini yangilash
  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return updatedCustomer;
  }

  // Mijozni o'chirish
  async remove(id: string): Promise<{ message: string }> {
    const deletedCustomer = await this.customerModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return { message: 'Customer successfully deleted' };
  }
}
