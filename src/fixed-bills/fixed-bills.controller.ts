import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FixedBillsService } from './fixed-bills.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateFixedBillDto, UpdateFixedBillDto } from './dto/create-fixed-bill.dto';

@Controller('fixed-bills')
export class FixedBillsController {
  constructor(private readonly fixedBillsService: FixedBillsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createDto: CreateFixedBillDto) {
    return this.fixedBillsService.create(user.id, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.fixedBillsService.findAll(user.id);
  }

  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateDto: UpdateFixedBillDto) {
    return this.fixedBillsService.update(user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.fixedBillsService.remove(user.id, id);
  }

  @Post(':id/pay')
  pay(@CurrentUser() user: any, @Param('id') id: string) {
    return this.fixedBillsService.payBill(user.id, id);
  }
}
