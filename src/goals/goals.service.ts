import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Goal } from './goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { AddValueDto } from './dto/add-value.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private goalModel: Model<Goal>) {}

  async create(userId: string, createDto: CreateGoalDto): Promise<Goal> {
    const created = new this.goalModel({ ...createDto, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.goalModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async addValue(userId: string, id: string, addValueDto: AddValueDto): Promise<Goal> {
    const updated = await this.goalModel.findOneAndUpdate(
      { _id: id, userId },
      { $inc: { currentAmount: addValueDto.value } },
      { new: true }
    ).exec();

    if (!updated) throw new NotFoundException('Goal not found or unauthorized');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.goalModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Goal not found or unauthorized');
  }

  async update(userId: string, id: string, updateDto: any): Promise<Goal> {
    const updated = await this.goalModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateDto },
      { new: true }
    ).exec();

    if (!updated) throw new NotFoundException('Goal not found or unauthorized');
    return updated;
  }
}
