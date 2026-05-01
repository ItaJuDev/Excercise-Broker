import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BrokersModule } from './brokers/brokers.module';

@Module({
  imports: [PrismaModule, BrokersModule],
})
export class AppModule {}
