import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, enum: ['entrada', 'saida'] })
  tipo: string;

  @Prop({ required: true })
  tipoTransacao: string;

  @Prop({ type: Number, default: null })
  parcelas: number;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true, type: Number })
  valor: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ default: '' })
  descricao: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CreditCard', default: null })
  creditCardId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
