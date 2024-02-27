import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CalendarEntry } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

const FETCH_LIMIT = 25;

export type CreateCalendarEntry = {
  title: string;
  startDate: Date;
  endDate: Date;
  forceOverlap?: boolean;
};

export type UpdatedCalendarEntry = {
  title: string;
  startDate: Date;
  endDate: Date;
  forceOverlap?: boolean;
};
@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCalendarEntry(calendarEntry: CreateCalendarEntry) {
    const { forceOverlap, ...calendarEntryData } = calendarEntry;

    const existingEntry = await this.prismaService.calendarEntry.findFirst({
      where: {
        startDate: {
          lte: calendarEntry.endDate,
        },
        endDate: {
          gte: calendarEntry.startDate,
        },
      },
    });

    if (existingEntry && !forceOverlap) {
      throw new HttpException('Entry overlaps with existing entry', HttpStatus.CONFLICT);
    }

    const newEntry = await this.prismaService.calendarEntry.create({
      data: calendarEntryData,
    });

    return newEntry.id;
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
    const { forceOverlap, ...calendarEntryData } = updatedCalendarEntry;

    const existingEntry = await this.prismaService.calendarEntry.findFirst({
      where: {
        startDate: {
          lte: updatedCalendarEntry.endDate,
        },
        endDate: {
          gte: updatedCalendarEntry.startDate,
        },
      },
    });

    if (existingEntry && !forceOverlap) {
      throw new HttpException('Entry overlaps with existing entry', HttpStatus.CONFLICT);
    }

    return await this.prismaService.calendarEntry.update({
      where: {
        id,
      },
      data: calendarEntryData,
    });
  }
}
