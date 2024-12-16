import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateBusinessSettingsDto {
  @Max(100)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  withdraw_percentage: number;
}
