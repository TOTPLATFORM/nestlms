import * as winston from 'winston';
import * as chalk from 'chalk';
import { createLogger, LoggerOptions } from 'winston';
import { Injectable, LoggerService } from '@nestjs/common';
import { coreConstant } from '../../shared/helpers/coreConstant';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logger;

  private level = 'info';

  private context: string;

  private static LOGS_PATH = coreConstant.FILE_DESTINATION + '/logs';

  constructor() {
    this.logger = createLogger(this.getLoggerOptions(this.level));
    this.setContext('Main');
  }

  public getLoggerOptions(level: string): LoggerOptions {
    const currentDate = new Date().toISOString().split('T')[0];
    return {
      level: level,
      transports: [
        new winston.transports.File({
          filename: `${MyLogger.LOGS_PATH}/${currentDate}.log`,
        }),
      ],
    };
  }
  public setContext(context: string): this {
    this.context = context;

    return this;
  }

  public setLevel(level: string): this {
    this.level = level;

    const loggerOptions = this.getLoggerOptions(level);
    this.overrideOptions(loggerOptions);

    return this;
  }

  log(message: string): void {
    this.setLevel('info');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    this.logToConsole('info', message);
  }

  error(message: string, trace?: string): void {
    this.setLevel('error');
    const currentDate = new Date();
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('error', message);
  }

  warn(message: string): void {
    this.setLevel('warning');
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('warning', message);
  }

  info(message: string): void {
    this.setLevel('info');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('info', message);
  }

  debug(message: string): void {
    this.setLevel('debug');
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole('debug', message);
  }

  overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }

  // this method just for printing a cool log in your terminal , using chalk
  private logToConsole(level: string, message: string): void {
    let result;
    const color = chalk.default;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      default:
      case 'info':
        result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(
          time,
        )} [${color.green(this.context)}] ${message}`;
        break;
      case 'error':
        result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(
          time,
        )} [${color.green(this.context)}] ${message}`;
        break;
      case 'warning':
        result = `[${color.yellow(
          'WARNING',
        )}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context,
        )}] ${message}`;
        break;
    }

    this.logger.close();
  }
}
