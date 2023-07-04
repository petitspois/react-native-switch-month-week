import type { StyleProp, ViewStyle } from 'react-native';
import type { ITheme } from '../Constants/type';
import type { AgendaListDataSource } from '../AgendaList';


export interface MarkedData {
    title:  string;
    description?: string;
    startTime?: string;
    endTime?: string;
    isAllDay?: boolean;
}
export interface MarkedDates {
    [key: string]: {
        marked: boolean;
        markedColor: string;
        data?: MarkedData[]
    }
}
export interface MonthWeekCalendarProps {
    defaultOpenMode?: 'Week' | 'Month'
    firstDay?: number;
    isKnob: boolean;
    modeType: 'Both' | 'Week' | 'Month';
    locale: 'cn' | 'hk' | 'en' | 'tw';
    calendarWidth?: number;
    markedDates?: MarkedDates;
    theme?: Partial<ITheme>;
    isReservation: boolean;
    customReservation?: (mode: 'week' | 'month') => JSX.Element | JSX.Element[] | null;
    onAgendaItemPress?: (data: AgendaListDataSource) => void;
    noEventsText?: string;
    CalendarContainerView?: React.ComponentType;
    containerWrapperStyle?: StyleProp<ViewStyle>;
}

export type Mode = 'week' | 'month';