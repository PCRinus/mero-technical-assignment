import { Injectable } from '@nestjs/common';
import { CreateCalendarEntryDto } from './dtos/create-calendar-entry-dto';

type CalendarEntry = CreateCalendarEntryDto;

const FETCH_LIMIT = 25;
@Injectable()
export class CalendarService {
  async createCalendarEntry(calendarEntry: CalendarEntry) {
    return calendarEntry;
  }

  async listAllCalendarEntries(start: Date, end: Date, limit = FETCH_LIMIT) {
    console.log(start, end, limit);
    return [];
  }

  async deleteCalendarEntry(id: string) {
    return id;
  }

  async updateCalendarEntry(id: string, calendarEntry: CalendarEntry) {
    return calendarEntry;
  }
}
