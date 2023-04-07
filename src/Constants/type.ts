import { ViewStyle, TextStyle } from 'react-native';

export interface ITheme{
    containerBackgroundColor: string;
    calendarBackgroundColor: string;
    todayTextColor: string;
    selectedTodayButtonBackgroundColor: string;
    selectedButtonBackgroundColor: string;
    dotBackgroundColor: string;
    disabledDayColor: string;
    dotSize: number;
    knobShadowColor: string;
    buttonTextColor: string;
    dayNameTextColor: string;
}

export enum UpdateSources {
    CALENDAR_INIT = "calendarInit",
    TODAY_PRESS = "todayPress",
    LIST_DRAG = "listDrag",
    WEEK_DAY_PRESS = "weekDayPress",
    MONTH_DAY_PRESS = "monthDayPress",
    DIFFERENT_MONTH_DAY_PRESS = "differentMonthDayPress",
    MONTH_SCROLL = "monthScroll",
    WEEK_SCROLL = "weekScroll",
    PROP_UPDATE = "propUpdate"
}