import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createDto: any) {
    return this.expensesService.create(user.id, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.expensesService.findAll(user.id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateDto: any) {
    return this.expensesService.update(user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.expensesService.remove(user.id, id);
  }
}
