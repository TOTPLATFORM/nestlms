import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  redirect_url: string;

  @IsOptional()
  @IsNumber()
  user_id: number;
}
