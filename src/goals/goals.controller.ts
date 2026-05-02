import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateGoalDto } from './dto/create-goal.dto';
import { AddValueDto } from './dto/add-value.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createDto: CreateGoalDto) {
    return this.goalsService.create(user.id, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.goalsService.findAll(user.id);
  }

  @Patch(':id/add')
  addValue(@CurrentUser() user: any, @Param('id') id: string, @Body() addValueDto: AddValueDto) {
    return this.goalsService.addValue(user.id, id, addValueDto);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateDto: any) {
    return this.goalsService.update(user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.goalsService.remove(user.id, id);
  }
}
