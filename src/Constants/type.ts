import { ViewStyle, TextStyle } from 'react-native';


export type Locale = 'cn' | 'en' | 'hk' | 'tw' | 'id';
export interface ITheme {
    containerBackgroundColor:   string;
    calendarBackgroundColor: string;
    reservationBackgroundColor: string;
    todayTextColor: string;
    selectedTodayButtonBackgroundColor: string;
    selectedButtonBackgroundColor: string;
    dotBackgroundColor: string;
    disabledButtonTextColor: string;
    dotSize: number;
    knobShadowColor: string;
    buttonTextColor: string;
    dayNameTextColor: string;
    agendaItemBackgroundColor: string; 
    agendaItemTextColor: string;
}



export enum UpdateSources {
    CALENDAR_INIT = "calendarInit",
    WEEK_DAY_PRESS = "weekDayPress",
    MONTH_DAY_PRESS = "monthDayPress",
    MONTH_SCROLL = "monthScroll",
    WEEK_SCROLL = "weekScroll",
    PROP_UPDATE = "propUpdate",
    LIST_DRAG = 'listDrag',
}