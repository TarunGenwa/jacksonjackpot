import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class AddFundsDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'GBP';

  @IsOptional()
  @IsString()
  description?: string;
}
