import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateCalendarEntryDto } from './dtos/create-calendar-entry-dto';
import { CalendarService } from './calendar.service';
import { ListAllCalendarEntriesDto } from './dtos/list-all-calendar-entries-dto';
import { UpdateCalendarEntryDto } from './dtos/update-calendar-entry-dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  async createCalendarEntry(@Body() createCalendarDto: CreateCalendarEntryDto) {
    return await this.calendarService.createCalendarEntry(createCalendarDto);
  }

  @Get()
  async getCalendarEntries(@Param() query: ListAllCalendarEntriesDto) {
    const { start, end, limit } = query;
    return await this.calendarService.listAllCalendarEntries(start, end, limit);
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
