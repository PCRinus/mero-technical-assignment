import { Injectable } from '@nestjs/common';
import { CalendarEntry } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma.service';
import { UpdateCalendarEntryDto } from './dtos/update-calendar-entry.dto';

const FETCH_LIMIT = 25;

type UpdatedCalendarEntry = UpdateCalendarEntryDto;
@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCalendarEntry(calendarEntry: Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.prismaService.calendarEntry.create({
      data: calendarEntry,
    });

    return result.id;
  }

  async listAllCalendarEntries(
    start: Date,
    end: Date,
    limit = FETCH_LIMIT,
  ): Promise<CalendarEntry[]> {
    return await this.prismaService.calendarEntry.findMany({
      where: {
        startDate: {
          gte: start,
        },
        endDate: {
          lte: end,
        },
      },
      take: limit,
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async deleteCalendarEntry(id: number): Promise<CalendarEntry> {
    return await this.prismaService.calendarEntry.delete({
      where: {
        id,
      },
    });
  }

  async updateCalendarEntry(
    id: number,
    updatedCalendarEntry: UpdatedCalendarEntry,
  ): Promise<CalendarEntry> {
    return await this.prismaService.calendarEntry.update({
      where: {
        id,
      },
      data: {
        title: updatedCalendarEntry.title,
      },
    });
  }
}
