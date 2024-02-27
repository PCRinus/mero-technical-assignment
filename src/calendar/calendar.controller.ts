import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCalendarEntryDto } from './dtos/create-calendar-entry.dto';
import { CalendarService } from './calendar.service';
import { ListAllCalendarEntriesDto } from './dtos/list-all-calendar-entries.dto';
import { UpdateCalendarEntryDto } from './dtos/update-calendar-entry.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateRecurringCalendarEntryDto } from './dtos/create-recurring-calendar-entry.dto';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async createCalendarEntry(@Body() createCalendarDto: CreateCalendarEntryDto) {
    const { startDate, endDate } = createCalendarDto;

    if (startDate > endDate)
      throw new HttpException('Start date cannot be greater than end date', HttpStatus.BAD_REQUEST);

    return await this.calendarService.createCalendarEntry({
      ...createCalendarDto,
      startDate,
      endDate,
    });
  }

  @Post('recurring')
  async createRecurringCalendarEntry(@Body() recurringDto: CreateRecurringCalendarEntryDto) {
    const { startDate, duration } = recurringDto;

    if (startDate > duration)
      throw new HttpException(
        'Start date cannot be greater the end of the interval',
        HttpStatus.BAD_REQUEST,
      );

    return await this.calendarService.createRecurringCalendarEntry(recurringDto);
  }

  @Get()
  async getCalendarEntries(@Query() query: ListAllCalendarEntriesDto) {
    const { startDate, endDate, limit } = query;

    if (startDate > endDate)
      throw new HttpException('Start date cannot be greater than end date', HttpStatus.BAD_REQUEST);

    return await this.calendarService.listAllCalendarEntries(startDate, endDate, limit);
  }

  @Delete(':id')
  async deleteCalendarEntry(@Param('id', ParseIntPipe) id: number) {
    return await this.calendarService.deleteCalendarEntry(id);
  }

  @Delete('recurring/:recurringGroupId')
  async deleteRecurringCalendarEntry(@Param('recurringGroupId') groupId: string) {
    return await this.calendarService.deleteRecurringCalendarEntries(groupId);
  }

  @Delete('recurring/:recurringGroupId/future')
  async deleteFutureRecurringCalendarEntries(@Param('recurringGroupId') groupId: string) {
    return await this.calendarService.deleteRecurringFutureCalendarEntries(groupId);
  }

  @Put(':id')
  async updateCalendarEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarDto: UpdateCalendarEntryDto,
  ) {
    const { startDate, endDate } = updateCalendarDto;
    return await this.calendarService.updateCalendarEntry(id, {
      ...updateCalendarDto,
      startDate,
      endDate,
    });
  }
}
