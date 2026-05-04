import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Goal extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  targetAmount: number;

  @Prop({ required: true, type: Number, default: 0 })
  currentAmount: number;

  @Prop({ default: 'target' })
  icon: string;

  @Prop({ type: Date, default: null })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
