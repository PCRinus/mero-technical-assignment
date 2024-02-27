import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecurringCalendarEntryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  duration: Date;

  @IsString()
  @IsNotEmpty()
  rule: string;
}
