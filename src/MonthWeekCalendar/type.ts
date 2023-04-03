import type { ITheme } from '../Constants/type';

export interface MarkedDates {
    [key: string]: {
        marked: boolean;
        markedColor: string;
    }
}
export interface MonthWeekCalendarProps {
    calendarWidth?: number;
    markedDates?: MarkedDates;
}

export type Mode = 'week' | 'month';