import { ApiProperty } from '@nestjs/swagger';
import { BrokerType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrokerDto {
  @ApiProperty({ example: 'Exness', description: 'Display name of the broker' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiProperty({
    example: 'exness-broker',
    description: 'URL-safe slug. Lowercase letters, digits and hyphens only.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters/digits separated by single hyphens (e.g. "exness-broker")',
  })
  slug: string;

  @ApiProperty({ example: 'A multi-asset broker offering CFDs on forex, metals, crypto...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsUrl({ require_protocol: true })
  logo_url: string;

  @ApiProperty({ example: 'https://exness.com' })
  @IsUrl({ require_protocol: true })
  website: string;

  @ApiProperty({ enum: BrokerType, enumName: 'BrokerType', example: BrokerType.cfd })
  @IsEnum(BrokerType)
  broker_type: BrokerType;
}
