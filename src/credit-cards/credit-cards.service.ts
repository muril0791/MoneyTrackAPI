import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditCard } from './credit-card.schema';

@Injectable()
export class CreditCardsService {
  constructor(@InjectModel(CreditCard.name) private creditCardModel: Model<CreditCard>) {}

  async create(userId: string, createDto: any): Promise<CreditCard> {
    const created = new this.creditCardModel({ ...createDto, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<CreditCard[]> {
    return this.creditCardModel.find({ userId }).exec();
  }

  async update(userId: string, id: string, updateDto: any): Promise<CreditCard> {
    const updated = await this.creditCardModel.findOneAndUpdate(
      { _id: id, userId },
      updateDto,
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Credit Card not found');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.creditCardModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Credit Card not found');
  }
}
