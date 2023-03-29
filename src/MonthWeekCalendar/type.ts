import type { ITheme } from '../Constants/type';
export interface MonthWeekCalendarProps {
    calendarWidth?: number;
    current?: string;
}

export type Mode = 'week' | 'month';