import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LanguageService } from './language.service';
import { CreateLanguageDto, UpdateLanguageDto, LanguageResponseDto } from './dto/language.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

@ApiTags('Languages')
@Controller('languages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully', type: LanguageResponseDto })
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({ status: 200, description: 'Return all languages', type: [LanguageResponseDto] })
  async findAll() {
    return this.languageService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({ status: 200, description: 'Return all active languages', type: [LanguageResponseDto] })
  async getActiveLanguages() {
    return this.languageService.getActiveLanguages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language by id' })
  @ApiResponse({ status: 200, description: 'Return a language by id', type: LanguageResponseDto })
  async findOne(@Param('id') id: string) {
    return this.languageService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a language' })
  @ApiResponse({ status: 200, description: 'Language updated successfully', type: LanguageResponseDto })
  async update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(+id, updateLanguageDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a language' })
  @ApiResponse({ status: 200, description: 'Language deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.languageService.remove(+id);
  }

  @Put(':id/set-default')
  @Roles('admin')
  @ApiOperation({ summary: 'Set a language as default' })
  @ApiResponse({ status: 200, description: 'Language set as default successfully' })
  async setDefaultLanguage(@Param('id') id: string) {
    await this.languageService.setDefaultLanguage(+id);
    return { message: 'Default language updated successfully' };
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get a language by code' })
  @ApiResponse({ status: 200, description: 'Return a language by code', type: LanguageResponseDto })
  async findByCode(@Param('code') code: string) {
    return this.languageService.findByCode(code);
  }
}
