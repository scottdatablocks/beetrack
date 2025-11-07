import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DecisionsService } from './decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';

@ApiTags('decisions')
@Controller('api/decisions')
export class DecisionsController {
  constructor(private decisionsService: DecisionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all decisions' })
  @ApiResponse({ status: 200, description: 'Returns all decisions' })
  async getDecisions(@Query('limit') limit: string = '50') {
    return this.decisionsService.getDecisions(parseInt(limit, 10));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get decision by ID' })
  @ApiResponse({ status: 200, description: 'Returns a single decision' })
  @ApiResponse({ status: 404, description: 'Decision not found' })
  async getDecisionById(@Param('id') id: string) {
    return this.decisionsService.getDecisionById(id);
  }

  @Get('token/:token')
  @ApiOperation({ summary: 'Get decision by token' })
  @ApiResponse({ status: 200, description: 'Returns decision by token' })
  async getDecisionByToken(@Param('token') token: string) {
    return this.decisionsService.getDecisionByToken(token);
  }

  @Get('alert/:alertId')
  @ApiOperation({ summary: 'Get decisions for an alert' })
  @ApiResponse({ status: 200, description: 'Returns decisions for an alert' })
  async getDecisionsByAlert(@Param('alertId') alertId: string) {
    return this.decisionsService.getDecisionsByAlert(alertId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new decision' })
  @ApiResponse({ status: 201, description: 'Decision created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createDecision(@Body() createDecisionDto: CreateDecisionDto) {
    return this.decisionsService.createDecision(createDecisionDto);
  }

  @Put(':token')
  @ApiOperation({ summary: 'Record a decision using token (SMS/Slack response)' })
  @ApiResponse({ status: 200, description: 'Decision recorded successfully' })
  @ApiResponse({ status: 400, description: 'Token already used or invalid' })
  async recordDecision(
    @Param('token') token: string,
    @Body() body: { action: string; user_id: string },
  ) {
    const decision = await this.decisionsService.recordDecision(
      token,
      body.user_id,
      body.action,
    );
    return { status: 'success', decision };
  }

  @Get('generate/token')
  @ApiOperation({ summary: 'Generate a new decision token' })
  @ApiResponse({ status: 200, description: 'Token generated' })
  async generateToken() {
    const token = this.decisionsService.generateDecisionToken();
    return { token };
  }
}
