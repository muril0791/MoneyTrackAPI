import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCreditCardDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome do cartão é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Limite deve ser um número' })
  @Min(0, { message: 'Limite deve ser positivo' })
  limit: number;

  @IsNumber({}, { message: 'Dia de fechamento deve ser um número' })
  @Min(1, { message: 'Dia de fechamento deve ser entre 1 e 31' })
  @Max(31, { message: 'Dia de fechamento deve ser entre 1 e 31' })
  closingDay: number;

  @IsNumber({}, { message: 'Dia de vencimento deve ser um número' })
  @Min(1, { message: 'Dia de vencimento deve ser entre 1 e 31' })
  @Max(31, { message: 'Dia de vencimento deve ser entre 1 e 31' })
  dueDay: number;
}
