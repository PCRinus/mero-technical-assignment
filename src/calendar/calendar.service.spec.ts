import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService, CreateCalendarEntry, UpdatedCalendarEntry } from './calendar.service';
import { PrismaService } from '../shared/prisma.service';
import { CalendarEntry } from '@prisma/client';

describe('CalendarService', () => {
  let service: CalendarService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarService, PrismaService],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  const existingEntry: CalendarEntry = {
    id: 1,
    title: 'Test',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-01-02'),
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01'),
  };

  describe('createCalendarEntry', () => {
    it('should throw if an existing entry is found and no overlap flag is set', async () => {
      const calendarEntry: CreateCalendarEntry = {
        title: 'Test',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
      };

      prisma.calendarEntry.findFirst = jest.fn().mockResolvedValueOnce(existingEntry);

      await expect(service.createCalendarEntry(calendarEntry)).rejects.toThrow();
    });

    it('should pass if an existing entry is found and the overlap flag is set', async () => {
      const calendarEntry: CreateCalendarEntry & { id: number } = {
        id: 1,
        title: 'Test',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
        forceOverlap: true,
      };

      prisma.calendarEntry.findFirst = jest.fn().mockResolvedValueOnce(existingEntry);
      prisma.calendarEntry.create = jest.fn().mockResolvedValueOnce(calendarEntry);

      const result = await service.createCalendarEntry(calendarEntry);

      expect(result).toEqual(calendarEntry.id);
    });
  });

  describe('listAllCalendarEntries', () => {
    it('should return an empty list if no entries are found', async () => {
      prisma.calendarEntry.findMany = jest.fn().mockResolvedValueOnce([]);

      const result = await service.listAllCalendarEntries(
        new Date('2022-01-01'),
        new Date('2022-01-02'),
      );

      expect(result).toEqual([]);
    });

    it('should return a list of calendar entries', async () => {
      const entries: CalendarEntry[] = [
        {
          id: 1,
          title: 'Test',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-02'),
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01'),
        },
      ];

      prisma.calendarEntry.findMany = jest.fn().mockResolvedValueOnce(entries);

      const result = await service.listAllCalendarEntries(
        new Date('2022-01-01'),
        new Date('2022-01-02'),
      );

      expect(result).toEqual(entries);
    });
  });

  describe('deleteCalendarEntry', () => {
    it('should throw if the entry is not found', async () => {
      prisma.calendarEntry.delete = jest.fn().mockRejectedValueOnce(new Error('Not found'));

      await expect(service.deleteCalendarEntry(1)).rejects.toThrow();
    });

    it('should delete the entry', async () => {
      prisma.calendarEntry.delete = jest.fn().mockResolvedValueOnce(existingEntry);

      const result = await service.deleteCalendarEntry(1);

      expect(result).toEqual(existingEntry);
    });
  });

  describe('updateCalendarEntry', () => {
    it('should throw if the entry is not found', async () => {
      prisma.calendarEntry.update = jest.fn().mockRejectedValueOnce(new Error('Not found'));

      await expect(service.updateCalendarEntry(1, {} as any)).rejects.toThrow();
    });

    it('should throw if the entry overlaps with an existing one', async () => {
      const updatedEntry: UpdatedCalendarEntry & { id: number } = {
        id: 1,
        title: 'Test',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
      };

      prisma.calendarEntry.findFirst = jest.fn().mockResolvedValueOnce(existingEntry);

      await expect(service.updateCalendarEntry(updatedEntry.id, updatedEntry)).rejects.toThrow();
    });

    it('should pass if the entry overlaps with an existing one and the overlap flag is set', async () => {
      const updatedEntry: UpdatedCalendarEntry & { id: number } = {
        id: 1,
        title: 'Test',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
        forceOverlap: true,
      };

      prisma.calendarEntry.findFirst = jest.fn().mockResolvedValueOnce(existingEntry);
      prisma.calendarEntry.update = jest.fn().mockResolvedValueOnce(updatedEntry);

      const result = await service.updateCalendarEntry(updatedEntry.id, updatedEntry);

      expect(result).toEqual(updatedEntry);
    });
  });
});
