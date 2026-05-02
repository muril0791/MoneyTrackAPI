import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsHexColor, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGoalDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'O valor objetivo é obrigatório' })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0.01, { message: 'O valor objetivo deve ser maior que zero' })
  targetAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @IsOptional()
  @IsHexColor({ message: 'Cor inválida' })
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de início inválida' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data final inválida' })
  endDate?: string;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}
