import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(userId: string, createDto: any): Promise<Category> {
    const created = new this.categoryModel({ ...createDto, userId });
    return created.save();
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryModel.find({ userId }).exec();
  }

  async update(userId: string, id: string, updateDto: any): Promise<Category> {
    const updated = await this.categoryModel.findOneAndUpdate(
      { _id: id, userId },
      updateDto,
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.categoryModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Category not found');
  }
}
