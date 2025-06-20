import { Controller, Post, Get, Param, Delete, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { QueryJobDto } from './dto/query-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  create(@Body() dto: CreateJobDto, @Request() req) {
    return this.jobService.create(dto, req.user);
  }

  @Get()
  findAll(@Query() query: QueryJobDto) {
    return this.jobService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY')
  delete(@Param('id') id: string, @Request() req) {
    return this.jobService.delete(id, req.user);
  }
}
