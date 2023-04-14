import type { ITheme } from '../Constants/type';

export interface MarkedDates {
    [key: string]: {
        marked: boolean;
        markedColor: string;
    }
}
export interface MonthWeekCalendarProps {
    locale: 'cn' | 'hk' | 'en';
    calendarWidth?: number;
    markedDates?: MarkedDates;
    theme?: Partial<ITheme>;
    defaultDate?: string;
}

export type Mode = 'week' | 'month';