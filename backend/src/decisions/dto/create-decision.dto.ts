import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDecisionDto {
  @ApiPropertyOptional({ description: 'Alert ID' })
  @IsOptional()
  @IsUUID()
  alertId?: string;

  @ApiProperty({ description: 'Decision token for verification' })
  @IsString()
  decisionToken: string;

  @ApiProperty({ description: 'Decision type (approve, reject, escalate, etc.)' })
  @IsString()
  decisionType: string;

  @ApiProperty({ description: 'User who made the decision' })
  @IsString()
  decidedBy: string;
}
