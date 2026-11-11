import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('SQL');

  constructor(config: ConfigService) {
    const logSql = config.get<string>('LOG_SQL') === 'true';
    super({ log: logSql ? [{ emit: 'event', level: 'query' }] : [] });
    if (logSql) {
      this.$on('query', (event) => this.logger.log(event.query));
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
