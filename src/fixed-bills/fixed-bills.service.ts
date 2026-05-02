import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FixedBill } from './fixed-bill.schema';

@Injectable()
export class FixedBillsService {
  constructor(@InjectModel(FixedBill.name) private fixedBillModel: Model<FixedBill>) {}

  async create(userId: string, createDto: any): Promise<FixedBill> {
    const payload = { 
      ...createDto, 
      userId,
      remainingInstallments: createDto.totalInstallments || null
    };
    const created = new this.fixedBillModel(payload);
    return created.save();
  }

  async findAll(userId: string): Promise<FixedBill[]> {
    return this.fixedBillModel.find({ userId }).sort({ dueDay: 1 }).exec();
  }

  async update(userId: string, id: string, updateDto: any): Promise<FixedBill> {
    const updated = await this.fixedBillModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateDto },
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Bill not found');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.fixedBillModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Bill not found');
  }

  async payBill(userId: string, id: string): Promise<FixedBill> {
    const bill = await this.fixedBillModel.findOne({ _id: id, userId }).exec();
    if (!bill) throw new NotFoundException('Bill not found');

    const updateData: any = {
      lastPaidDate: new Date(),
      status: 'paid'
    };

    if (bill.remainingInstallments !== null) {
      updateData.remainingInstallments = Math.max(0, bill.remainingInstallments - 1);
      if (updateData.remainingInstallments === 0) {
        // Option to archive or keep at 0
      }
    }

    const updated = await this.fixedBillModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Bill not found');
    return updated;
  }

  async resetStatus(userId: string, id: string): Promise<FixedBill> {
    // Logic to reset monthly
    const updated = await this.fixedBillModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status: 'pending' } },
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Bill not found');
    return updated;
  }
}
