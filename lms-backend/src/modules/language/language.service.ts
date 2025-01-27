import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language, Prisma } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LanguageCreateInput): Promise<Language> {
    return this.prisma.language.create({
      data,
    });
  }

  async findAll(): Promise<Language[]> {
    return this.prisma.language.findMany();
  }

  async findOne(id: number): Promise<Language | null> {
    return this.prisma.language.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Language | null> {
    return this.prisma.language.findUnique({
      where: { code },
    });
  }

  async update(id: number, data: Prisma.LanguageUpdateInput): Promise<Language> {
    return this.prisma.language.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Language> {
    return this.prisma.language.delete({
      where: { id },
    });
  }

  async getDefaultLanguage(): Promise<Language | null> {
    return this.prisma.language.findFirst({
      where: { is_default: true },
    });
  }

  async setDefaultLanguage(id: number): Promise<void> {
    // First, remove default from all languages
    await this.prisma.language.updateMany({
      where: { is_default: true },
      data: { is_default: false },
    });

    // Set the new default language
    await this.prisma.language.update({
      where: { id },
      data: { is_default: true },
    });
  }

  async getActiveLanguages(): Promise<Language[]> {
    return this.prisma.language.findMany({
      where: { status: 1 },
    });
  }
}
