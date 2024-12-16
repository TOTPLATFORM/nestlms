import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, readFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import {
  errorResponse,
  formatLimitOffset,
  paginatioOptions,
  paginationMetaData,
  processException,
  storeException,
  successResponse,
} from 'src/shared/helpers/functions';

interface LogObject {
  context: string;
  level: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class LogService {
  private logDirectory: string;
  constructor() {
    this.logDirectory = coreConstant.FILE_DESTINATION + '/logs/';
  }
  async getLogFilesName() {
    try {
      const logFiles = readdirSync(this.logDirectory);

      if (!logFiles.length) {
        return errorResponse('No log files found');
      }
      return successResponse('Log files list', logFiles);
    } catch (error) {
      processException(error);
    }
  }

  async getLogFromAllFiles(payload?: any): Promise<any> {
    try {
      const logFiles = readdirSync(this.logDirectory);

      if (!logFiles.length) {
        return errorResponse('No log files found');
      }

      const paginate = await paginatioOptions(payload);

      const logData = payload.file_name
        ? await this.readAllLogFile(payload.file_name, payload.search)
        : await this.readAllLogFiles(logFiles, payload.search);

      const limitOffset = await formatLimitOffset(payload);

      const total = logData.length;
      const startIndex = (limitOffset.offset - 1) * limitOffset.limit;
      const endIndex = startIndex + limitOffset.limit;
      const paginatedLogs = logData.slice(startIndex, endIndex);
      const data = {
        list: paginatedLogs,
        meta: await paginationMetaData(logData, payload),
      };

      return successResponse('All Log', data);
    } catch (error) {
      processException(error);
    }
  }

  private async readAllLogFiles(
    logFiles: string[],
    search?: string,
  ): Promise<any[]> {
    let allLogs: any[] = [];

    try {
      for (const logFile of logFiles) {
        const filePath = join(this.logDirectory, logFile);

        const logContent = readFileSync(filePath, 'utf8');

        const searchPattern = search ? new RegExp(search, 'i') : undefined;

        const logs = logContent
          .split('\n')
          .filter((entry) => entry.trim() !== '')
          .map((entry) => {
            try {
              return JSON.parse(entry) as LogObject;
            } catch (error) {
              storeException(`Error parsing log entry: ${entry}`);
              return null;
            }
          })
          .filter((logObject) => logObject !== null)
          .filter((logObject) =>
            search ? searchPattern.test(logObject.message) : true,
          )
          .map((logObject) => {
            logObject.timestamp = new Date(logObject.timestamp)
              .toISOString()
              .split('T')[0];
            return logObject;
          });

        allLogs = allLogs.concat(logs);
      }

      return allLogs;
    } catch (error) {
      return allLogs;
    }
  }

  private async readAllLogFile(
    logFile: string,
    search?: string,
  ): Promise<any[]> {
    let allLogs: any[] = [];

    try {
      const filePath = join(this.logDirectory, logFile);
      if (!existsSync(filePath)) {
        return allLogs;
      }
      const logContent = readFileSync(filePath, 'utf8');
      const searchPattern = search ? new RegExp(search, 'i') : undefined;

      allLogs = logContent
        .split('\n')
        .filter((entry) => entry.trim() !== '')
        .map((entry) => {
          try {
            return JSON.parse(entry) as LogObject;
          } catch (error) {
            storeException(`Error parsing log entry: ${entry}`);
            return null;
          }
        })
        .filter((logObject) => logObject !== null)
        .filter((logObject) =>
          search ? searchPattern.test(logObject.message) : true,
        )
        .map((logObject) => {
          logObject.timestamp = new Date(logObject.timestamp)
            .toISOString()
            .split('T')[0];
          return logObject;
        });

      return allLogs;
    } catch (error) {
      processException(error);
    }
  }

  async deleteLoggFiles(payload: any) {
    try {
      const deleteResponse = payload.file_name
        ? await this.deleteLogFile(payload.file_name)
        : await this.deleteAllLogFiles();

      return deleteResponse;
    } catch (error) {
      processException(error);
    }
  }

  private async deleteAllLogFiles() {
    try {
      const files = readdirSync(this.logDirectory);

      files.forEach((file) => {
        const filePath = join(this.logDirectory, file);

        // Delete the file
        unlinkSync(filePath);
      });

      return successResponse('Files are deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  private async deleteLogFile(file_name: string) {
    try {
      const filePath = join(this.logDirectory, file_name);

      if (!existsSync(filePath)) {
        return errorResponse('File does not exist!');
      }
      unlinkSync(filePath);

      return successResponse('File is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }
}
