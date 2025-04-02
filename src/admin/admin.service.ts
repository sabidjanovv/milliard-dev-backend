import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { hash } from 'argon2';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createApiResponse } from '../common/utils/api-response';

@ApiTags('Admin')
@Injectable()
export class AdminService {
  private isCreatorChecked = false; // Yangi o'zgaruvchi: is_creator maydoni tekshirilganligini belgilash

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  // Tokenlarni yaratish
  async generateTokens(admin: Admin) {
    const payload: JwtPayload = {
      id: admin._id,
      full_name: admin.full_name,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
      email: admin.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  // Admin yaratish
  async create(createAdminDto: CreateAdminDto, adminId: string) {
    const { email, phone_number, password } = createAdminDto;

    // Admin mavjudligini tekshirish
    const existsAdmin = await this.adminModel
      .findOne({
        $or: [{ email }, { phone_number }],
      })
      .exec();

    if (existsAdmin) {
      throw new BadRequestException('Bunday email yoki telefon raqami mavjud!');
    }

    // Parolni hash qilish
    const hashedPassword = await hash(password);

    let is_creator = false;

    // is_creator faqat bitta admin bo'lishi mumkin, shu sababli tekshirishni faqat bir marta amalga oshiramiz
    if (!this.isCreatorChecked) {
      const creatorAdmin = await this.adminModel
        .findOne({ is_creator: true })
        .exec();
      is_creator = creatorAdmin ? false : true; // Agar is_creator: true bo'lgan admin mavjud bo'lsa, yangi adminni false qilamiz
      this.isCreatorChecked = true; // Tekshiruvni faollashtirish
    }

    const activation_link = uuid.v4();
    // Adminni yaratish
    const newAdmin = new this.adminModel({
      ...createAdminDto,
      hashed_password: hashedPassword, // Parolni saqlash
      is_creator: is_creator, // is_creator maydonini avtomatik ravishda sozlash
      activation_link,
    });

    await newAdmin.save(); // Adminni saqlash

    try {
      await this.mailService.sendMail(newAdmin);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error sending activation email');
    }

    // Token yaratish
    const { refresh_token } = await this.generateTokens(newAdmin);
    newAdmin.hashed_refresh_token = await hash(refresh_token);

    await newAdmin.save(); // Refresh tokenni yangilab saqlash
    return createApiResponse(200, 'Админ успешно создан', newAdmin);
  }

  // Barcha adminlarni olish
  async findAll(paginationDto: PaginationDto, adminId: string) {
    const limit = Number(paginationDto.limit ?? 10); // Ensuring limit is a number
    const page = Number(paginationDto.page ?? 1); // Ensuring page is a number
    const { email, phone_number, fromDate, toDate } = paginationDto;

    // Filtr uchun obyekt yaratish
    const filter: any = {};
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (phone_number)
      filter.phone_number = { $regex: phone_number, $options: 'i' };

    if (fromDate || toDate) {
      if (fromDate && !/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
        throw new BadRequestException(
          'Invalid fromDate format. Use YYYY-MM-DD',
        );
      }
      if (toDate && !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
        throw new BadRequestException('Invalid toDate format. Use YYYY-MM-DD');
      }

      filter.created_at = {};
      if (fromDate) filter.created_at.$gte = `${fromDate} 00:00:00`;
      if (toDate) filter.created_at.$lte = `${toDate} 23:59:59`;
    }

    // Paginatsiya va filtrni qo'llash
    const [admins, totalCount] = await Promise.all([
      this.adminModel
        .find(filter)
        .sort({ _id: 'desc' })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec(),

      this.adminModel.countDocuments(filter).exec(), // Umumiy countni olish
    ]);

    // Adminni userId ga mos kelmasligini tekshirish
    const filteredAdmins = admins.filter((u) => u._id.toString() !== adminId);

    return createApiResponse(200, 'Админы получены успешно', {
      payload: filteredAdmins,
      total: totalCount,
      limit,
      page,
    });
  }

  // Bir adminni topish
  async findOne(id: string) {
    const admin = await this.adminModel.findById(id).exec(); // Await the promise to resolve

    if (!admin) {
      throw new NotFoundException('Админ с таким ID не найден');
    }

    return createApiResponse(200, 'Админ найден', admin); // Return the found admin
  }

  // Adminni yangilash
  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (!admin) {
      throw new BadRequestException('Админ не найден');
    }

    // Adminni yangilash
    return this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
  }

  // Adminni o'chirish
  async remove(id: string) {
    const admin = await this.findOne(id);

    if (!admin) {
      throw new BadRequestException('Админ не найден');
    }

    await this.adminModel.findByIdAndDelete(id).exec();
    return createApiResponse(200, 'Админ успешно удален', null);
  }

  async activateAdmin(link: string, res: Response) {
    try {
      const admin = await this.adminModel.findOne({ activation_link: link });
      if (!admin) {
        return res.status(400).send({ message: 'Пользователь не найден!' });
      }

      if (admin.is_active) {
        return res
          .status(400)
          .send({ message: 'Пользователь уже активирован.' });
      }

      admin.is_active = true;
      await admin.save();

      res.send({
        is_active: admin.is_active,
        message: 'Пользователь успешно активирован.',
      });
    } catch (error) {
      // console.log(error);
    }
  }
}
