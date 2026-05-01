import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { QueryBrokerDto } from './dto/query-broker.dto';
import { BrokerEntity } from './dto/broker.entity';

@ApiTags('brokers')
@Controller('brokers')
export class BrokersController {
  constructor(private readonly brokers: BrokersService) {}

  @Get()
  @ApiOperation({ summary: 'List brokers (with optional search & type filter)' })
  @ApiOkResponse({ type: BrokerEntity, isArray: true })
  findAll(@Query() query: QueryBrokerDto) {
    return this.brokers.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single broker by slug' })
  @ApiOkResponse({ type: BrokerEntity })
  @ApiNotFoundResponse({ description: 'Broker not found' })
  findOne(@Param('slug') slug: string) {
    return this.brokers.findOne(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new broker' })
  @ApiCreatedResponse({ type: BrokerEntity })
  @ApiConflictResponse({ description: 'Slug already exists' })
  create(@Body() dto: CreateBrokerDto) {
    return this.brokers.create(dto);
  }
}
