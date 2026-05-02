import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from './expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) {}

  async create(userId: string, createDto: CreateExpenseDto): Promise<Expense> {
    const created = new this.expenseModel({ ...createDto, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId }).sort({ data: -1 }).exec();
  }

  async update(userId: string, id: string, updateDto: UpdateExpenseDto): Promise<Expense> {
    // SECURITY: Strip userId from DTO to prevent Mass Assignment (stealing records)
    const { userId: _, ...safeDto } = updateDto as any;

    const updated = await this.expenseModel.findOneAndUpdate(
      { _id: id, userId }, // Only allow if record belongs to the user (IDOR Protection)
      { $set: safeDto },
      { new: true }
    ).exec();

    if (!updated) throw new NotFoundException('Expense not found or unauthorized');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.expenseModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Expense not found or unauthorized');
  }
}
