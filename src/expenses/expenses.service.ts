import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './expense.schema';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(userId: string, createDto: any): Promise<Expense> {
    const created = new this.expenseModel({ ...createDto, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId }).sort({ created_at: -1 }).exec();
  }

  async update(userId: string, id: string, updateDto: any): Promise<Expense> {
    const updated = await this.expenseModel.findOneAndUpdate(
      { _id: id, userId },
      updateDto,
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Expense not found');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.expenseModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Expense not found');
  }
}
