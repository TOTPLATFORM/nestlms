import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { prismaExclude } from 'prisma-exclude';

export const exclude = prismaExclude(new PrismaClient());

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
  async onModuleInit() {
    await this.$connect();

    // Type-safe event handlers
    const errorHandler = (event: Prisma.LogEvent) => {
      console.log('Prisma-Error: ' + JSON.stringify(event), 'error');
    };

    const warnHandler = (event: Prisma.LogEvent) => {
      console.log('Prisma-Warn: ' + JSON.stringify(event), 'warn');
    };

    const queryHandler = (event: Prisma.QueryEvent) => {
      console.log('\nQuery: ' + event.query);
      console.log('Params: ' + JSON.stringify(event.params));
      console.log('Duration: ' + event.duration + 'ms\n');
    };

    // Register event handlers
    (this as any).$on('error', errorHandler);
    (this as any).$on('warn', warnHandler);

    if (process.env.QUERY_DEBUG === 'true') {
      (this as any).$on('query', queryHandler);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
