import { IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListAllCalendarEntriesDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
