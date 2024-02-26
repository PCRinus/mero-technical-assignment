import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ListAllCalendarEntriesDto {
  @IsDate()
  @IsNotEmpty()
  start: Date;

  @IsDate()
  @IsNotEmpty()
  end: Date;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
