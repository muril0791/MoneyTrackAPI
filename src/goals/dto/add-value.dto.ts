import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddValueDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  value: number;
}
