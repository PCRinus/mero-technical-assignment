import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCalendarEntryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  forceOverlap?: boolean;
}
