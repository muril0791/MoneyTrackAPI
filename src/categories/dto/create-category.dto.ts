import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome da categoria é obrigatório' })
  name: string;

  @IsEnum(['entrada', 'saida'], { message: 'Tipo deve ser "entrada" ou "saida"' })
  type: string;

  @IsOptional()
  @IsString()
  color?: string;
}
