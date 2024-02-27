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

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async createCalendarEntry(@Body() createCalendarDto: CreateCalendarEntryDto) {
    const { startDate, endDate } = createCalendarDto;

    if (startDate > endDate)
      throw new HttpException('Start date cannot be greater than end date', HttpStatus.BAD_REQUEST);

    return await this.calendarService.createCalendarEntry(createCalendarDto);
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

  @Put(':id')
  async updateCalendarEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarDto: UpdateCalendarEntryDto,
  ) {
    return await this.calendarService.updateCalendarEntry(id, updateCalendarDto);
  }
}
