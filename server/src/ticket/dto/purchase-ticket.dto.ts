import { IsString, IsInt, Min, IsOptional, IsUUID } from 'class-validator';

export class PurchaseTicketDto {
  @IsUUID()
  competitionId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}