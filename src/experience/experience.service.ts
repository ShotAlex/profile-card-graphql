import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { ExperienceModel } from './experience.model';

/** Business rules for work periods. Pure functions, no database access. */
@Injectable()
export class ExperienceService {
  toModel(row: Experience, now: Date = new Date()): ExperienceModel {
    return {
      id: row.id,
      company: row.company,
      position: row.position,
      context: row.context,
      startDate: this.formatMonth(row.startDate),
      endDate: row.endDate ? this.formatMonth(row.endDate) : null,
      isCurrent: row.endDate === null,
      durationMonths: this.durationMonths(row.startDate, row.endDate ?? now),
    };
  }

  /** Most recent job first; current jobs always go on top. */
  sort(rows: readonly Experience[]): Experience[] {
    return [...rows].sort((a, b) => {
      if ((a.endDate === null) !== (b.endDate === null)) return a.endDate === null ? -1 : 1;
      return b.startDate.getTime() - a.startDate.getTime();
    });
  }

  durationMonths(start: Date, end: Date): number {
    const months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()) + 1;
    return Math.max(months, 1);
  }

  private formatMonth(date: Date): string {
    return date.toISOString().slice(0, 7);
  }
}
