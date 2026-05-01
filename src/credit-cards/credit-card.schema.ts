import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CreditCard extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  limit: number;

  @Prop({ required: true, type: Number })
  closingDay: number;

  @Prop({ required: true, type: Number })
  dueDay: number;
}

export const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
