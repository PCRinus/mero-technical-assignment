import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CalendarEntry } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';
import { CreateRecurringCalendarEntryDto } from './dtos/create-recurring-calendar-entry.dto';
import { randomUUID } from 'node:crypto';

const FETCH_LIMIT = 25;

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;

export type CreateCalendarEntry = {
  title: string;
  startDate: Date;
  endDate: Date;
  forceOverlap?: boolean;
};

export type CreateRecurringCalendarEntry = CreateRecurringCalendarEntryDto;
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

  async createRecurringCalendarEntry(recurringCalendarEntry: CreateRecurringCalendarEntry) {
    const recurringEntries = this.generateRecurringEntries(recurringCalendarEntry);
    const createdIds = [];
    const recurringGroupUuid = randomUUID();

    //NOTE: since createMany is not supported in SQLite, we will need to iterate and create each entry
    for await (const entry of recurringEntries) {
      const data: Omit<CalendarEntry, 'id' | 'createdAt' | 'updatedAt'> = {
        ...entry,
        recurringGroup: recurringGroupUuid,
      };
      const result = await this.prismaService.calendarEntry.create({
        data,
      });
      createdIds.push(result.id);
    }

    return createdIds.length;
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

  private generateRecurringEntries(
    recurringCalendarEntry: CreateRecurringCalendarEntry,
  ): Omit<CreateCalendarEntry, 'forceOverlap'>[] {
    const { rule, startDate, duration } = recurringCalendarEntry;
    const recurringEntries: Omit<CreateCalendarEntry, 'forceOverlap'>[] = [];

    let recurringStartDate = startDate;

    if (rule === 'daily') {
      while (recurringStartDate < duration) {
        const newDailyEndDate = new Date(recurringStartDate.getTime() + DAY_IN_MILLISECONDS);

        const newEntry = {
          title: recurringCalendarEntry.title,
          startDate: recurringStartDate,
          endDate: newDailyEndDate,
        } satisfies Omit<CreateCalendarEntry, 'forceOverlap'>;

        recurringEntries.push(newEntry);

        recurringStartDate = newDailyEndDate;
      }
    }

    if (rule === 'weekly') {
      while (recurringStartDate < duration) {
        const newWeeklyEndDate = new Date(recurringStartDate.getTime() + WEEK_IN_MILLISECONDS);

        const newEntry = {
          title: recurringCalendarEntry.title,
          startDate: recurringStartDate,
          endDate: newWeeklyEndDate,
        } satisfies Omit<CreateCalendarEntry, 'forceOverlap'>;

        recurringEntries.push(newEntry);

        recurringStartDate = newWeeklyEndDate;
      }
    }

    return recurringEntries;
  }
}
