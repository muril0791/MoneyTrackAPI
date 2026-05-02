import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFixedBillDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay: number;

  @IsOptional()
  @IsBoolean()
  isVariable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalInstallments?: number;
}

export class UpdateFixedBillDto extends PartialType(CreateFixedBillDto) {}
