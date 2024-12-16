import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

@Injectable()
export class TranslationService {
  constructor(private prisma: PrismaService) {}

  async translate(
    tableName: string,
    tableId: number,
    fieldName: string,
    languageId: number,
    translation: string,
  ) {
    return this.prisma.translation.upsert({
      where: {
        unique_translation: {
          language_id: languageId,
          table_name: tableName,
          table_id: tableId,
          field_name: fieldName,
        },
      },
      update: {
        translation,
      },
      create: {
        language_id: languageId,
        table_name: tableName,
        table_id: tableId,
        field_name: fieldName,
        translation,
      },
    });
  }

  async getTranslations(
    tableName: string,
    tableId: number,
    languageId: number,
  ) {
    const translations = await this.prisma.translation.findMany({
      where: {
        table_name: tableName,
        table_id: tableId,
        language_id: languageId,
      },
    });

    // Convert array of translations to an object
    return translations.reduce((acc, curr) => {
      acc[curr.field_name] = curr.translation;
      return acc;
    }, {});
  }

  async getTranslationsForMultipleRecords(
    tableName: string,
    tableIds: number[],
    languageId: number,
  ) {
    const translations = await this.prisma.translation.findMany({
      where: {
        table_name: tableName,
        table_id: { in: tableIds },
        language_id: languageId,
      },
    });

    // Group translations by table_id
    return translations.reduce((acc, curr) => {
      if (!acc[curr.table_id]) {
        acc[curr.table_id] = {};
      }
      acc[curr.table_id][curr.field_name] = curr.translation;
      return acc;
    }, {});
  }

  async deleteTranslations(
    tableName: string,
    tableId: number,
  ) {
    return this.prisma.translation.deleteMany({
      where: {
        table_name: tableName,
        table_id: tableId,
      },
    });
  }

  async getSystemMessage(
    key: string,
    languageId: number,
  ) {
    const message = await this.prisma.systemMessage.findUnique({
      where: {
        unique_message: {
          language_id: languageId,
          key,
        },
      },
    });
    return message?.value;
  }

  async setSystemMessage(
    key: string,
    languageId: number,
    value: string,
    category: string,
  ) {
    return this.prisma.systemMessage.upsert({
      where: {
        unique_message: {
          language_id: languageId,
          key,
        },
      },
      update: {
        value,
        category,
      },
      create: {
        language_id: languageId,
        key,
        value,
        category,
      },
    });
  }
}
