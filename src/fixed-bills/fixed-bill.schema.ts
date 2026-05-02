import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class FixedBill extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Number }) // 1 to 31
  dueDay: number;

  @Prop({ default: false })
  isVariable: boolean;

  @Prop({ type: Number, default: null }) // null = indeterminate
  totalInstallments: number;

  @Prop({ type: Number, default: null })
  remainingInstallments: number;

  @Prop({ type: Date, default: null })
  lastPaidDate: Date;

  @Prop({ default: 'pending' }) // pending, paid
  status: string;
}

export const FixedBillSchema = SchemaFactory.createForClass(FixedBill);
