import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FixedBill, FixedBillSchema } from './fixed-bill.schema';
import { FixedBillsService } from './fixed-bills.service';
import { FixedBillsController } from './fixed-bills.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FixedBill.name, schema: FixedBillSchema }]),
  ],
  controllers: [FixedBillsController],
  providers: [FixedBillsService],
  exports: [FixedBillsService],
})
export class FixedBillsModule {}
