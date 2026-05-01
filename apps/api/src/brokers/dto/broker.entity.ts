import { ApiProperty } from '@nestjs/swagger';
import { BrokerType } from '@prisma/client';

export class BrokerEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Exness' })
  name: string;

  @ApiProperty({ example: 'exness-broker' })
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  logo_url: string;

  @ApiProperty()
  website: string;

  @ApiProperty({ enum: BrokerType, enumName: 'BrokerType' })
  broker_type: BrokerType;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;
}
