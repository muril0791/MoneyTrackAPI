import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCard, CreditCardSchema } from './credit-card.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CreditCard.name, schema: CreditCardSchema }])],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
})
export class CreditCardsModule {}
