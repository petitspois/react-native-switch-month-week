import type { ITheme } from '../Constants/type';
import type { AgendaListDataSource } from '../AgendaList';


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
    customReservation?: () => JSX.Element | JSX.Element[] | null;
    onAgendaItemPress?: (data: AgendaListDataSource) => void;
}

export type Mode = 'week' | 'month';