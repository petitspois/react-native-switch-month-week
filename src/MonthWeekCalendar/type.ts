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
    theme?: Partial<ITheme>
}

export type Mode = 'week' | 'month';