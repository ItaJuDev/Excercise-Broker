import { ApiPropertyOptional } from '@nestjs/swagger';
import { BrokerType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryBrokerDto {
  @ApiPropertyOptional({ example: 'exness', description: 'Case-insensitive substring match on name' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ enum: BrokerType, enumName: 'BrokerType', example: BrokerType.cfd })
  @IsOptional()
  @IsEnum(BrokerType)
  type?: BrokerType;
}
