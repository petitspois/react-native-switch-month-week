import type { ITheme } from '../Constants/type';


export interface MarkedData {
    title:  string;
    description: string;
}
export interface MarkedDates {
    [key: string]: {
        marked: boolean;
        markedColor: string;
        data?: MarkedData
    }
}
export interface MonthWeekCalendarProps {
    locale: 'cn' | 'hk' | 'en' | 'tw';
    calendarWidth?: number;
    markedDates?: MarkedDates;
    theme?: Partial<ITheme>;
    defaultDate?: string;
}

export type Mode = 'week' | 'month';