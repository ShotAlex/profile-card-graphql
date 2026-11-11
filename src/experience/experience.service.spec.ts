import { Experience } from '@prisma/client';
import { ExperienceService } from './experience.service';

const job = (id: number, start: string, end: string | null): Experience => ({
  id,
  profileId: 1,
  company: `Company ${id}`,
  position: 'Developer',
  context: '',
  startDate: new Date(`${start}-01T00:00:00Z`),
  endDate: end ? new Date(`${end}-01T00:00:00Z`) : null,
});

describe('ExperienceService', () => {
  const service = new ExperienceService();

  it('counts both the first and the last month', () => {
    const model = service.toModel(job(1, '2024-09', '2025-12'));
    expect(model.durationMonths).toBe(16);
    expect(model).toMatchObject({ startDate: '2024-09', endDate: '2025-12', isCurrent: false });
  });

  it('treats a job without end date as current and measures it up to now', () => {
    const model = service.toModel(job(1, '2026-01', null), new Date('2026-11-11T00:00:00Z'));
    expect(model).toMatchObject({ endDate: null, isCurrent: true, durationMonths: 11 });
  });

  it('puts current jobs first, then the most recent ones', () => {
    const sorted = service.sort([job(1, '2020-09', '2021-01'), job(2, '2024-09', '2025-12'), job(3, '2026-01', null)]);
    expect(sorted.map((row) => row.id)).toEqual([3, 2, 1]);
  });
});
