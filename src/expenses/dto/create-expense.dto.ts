import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsEnum(['entrada', 'saida'], { message: 'Tipo deve ser "entrada" ou "saida"' })
  tipo: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo de transação é obrigatório' })
  tipoTransacao: string;

  @IsOptional()
  @IsNumber({}, { message: 'Parcelas deve ser um número' })
  @Min(1)
  parcelas?: number;

  @IsString()
  @IsNotEmpty({ message: 'Data é obrigatória' })
  data: string;

  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  valor: number;

  @IsString()
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  categoria: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  creditCardId?: string;
}
