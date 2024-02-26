import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCalendarEntryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
