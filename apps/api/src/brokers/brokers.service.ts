import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Broker } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { QueryBrokerDto } from './dto/query-broker.dto';

@Injectable()
export class BrokersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryBrokerDto): Promise<Broker[]> {
    const { search, type } = query;
    const where: Prisma.BrokerWhereInput = {
      ...(type ? { broker_type: type } : {}),
      ...(search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {}),
    };
    return this.prisma.broker.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(slug: string): Promise<Broker> {
    const broker = await this.prisma.broker.findUnique({ where: { slug } });
    if (!broker) {
      throw new NotFoundException(`Broker with slug "${slug}" not found`);
    }
    return broker;
  }

  async create(dto: CreateBrokerDto): Promise<Broker> {
    try {
      return await this.prisma.broker.create({ data: dto });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`A broker with slug "${dto.slug}" already exists`);
      }
      throw e;
    }
  }
}
