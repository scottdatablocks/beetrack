import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlertDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({ description: 'Order Line ID' })
  @IsOptional()
  @IsUUID()
  orderLineId?: string;

  @ApiPropertyOptional({ description: 'Buffer piercing score (0-1)', minimum: 0, maximum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  bufferPiercing?: number;

  @ApiPropertyOptional({ description: 'ROI at stake in dollars', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  roiAtStake?: number;

  @ApiPropertyOptional({ description: 'Alert severity', enum: ['low', 'medium', 'high', 'critical'] })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ description: 'Alert status', enum: ['open', 'in_progress', 'resolved', 'dismissed'] })
  @IsOptional()
  @IsString()
  status?: string;
}
