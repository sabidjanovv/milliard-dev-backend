import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Request,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreatorGuard } from '../common/guard/creator.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin') // Swagger uchun 'Admin' kategoriya nomi
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Admin yaratish' })
  @ApiResponse({ status: 201, description: 'Admin muvaffaqiyatli yaratildi.' })
  @ApiResponse({ status: 400, description: 'Xatolik yuz berdi.' })
  create(@Body() createAdminDto: CreateAdminDto, adminId: string) {
    return this.adminService.create(createAdminDto, adminId);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha adminlarni olish' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'find between two date',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'find between two date',
  })
  @ApiResponse({
    status: 200,
    description: 'Barcha adminlar muvaffaqiyatli olinmoqda.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), CreatorGuard)
  findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.findAll(paginationDto, adminId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Adminni ID bo‘yicha topish' })
  @ApiParam({ name: 'id', description: 'Adminning IDsi' })
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli topildi.' })
  @ApiResponse({ status: 404, description: 'Admin topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: 'Link for activate admin' })
  @Get('activate/:link')
  activateAdmin(@Param('link') link: string, @Res() res: Response) {
    return this.adminService.activateAdmin(link, res);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Adminni yangilash' })
  @ApiParam({
    name: 'id',
    description: 'Yangilanishi kerak bo‘lgan adminning IDsi',
  })
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli yangilandi.' })
  @ApiResponse({ status: 400, description: 'Xatolik yuz berdi.' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Adminni o‘chirish' })
  @ApiParam({
    name: 'id',
    description: 'O‘chirilishi kerak bo‘lgan adminning IDsi',
  })
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli o‘chirildi.' })
  @ApiResponse({ status: 404, description: 'Admin topilmadi.' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
