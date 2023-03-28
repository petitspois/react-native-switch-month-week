import { ViewStyle, TextStyle } from 'react-native';

export interface ITheme{
    backgroundColor: string;
    calendarBackground: string;
    textSectionTitleColor: string;
    textSectionTitleDisabledColor: string;
    selectedDayBackgroundColor: string;
    selectedDayTextColor: string;
    todayTextColor: string;
    dayTextColor: string;
    textDisabledColor: string;
    dotColor: string;
    selectedDotColor: string;
    arrowColor: string;
    disabledArrowColor: string;
    monthTextColor: string;
    indicatorColor: string;
    textDayFontFamily: TextStyle['fontFamily'];
    textMonthFontFamily: TextStyle['fontFamily'];
    textDayHeaderFontFamily: TextStyle['fontFamily'];
    textDayFontWeight: TextStyle['fontWeight'];
    textMonthFontWeight: TextStyle['fontWeight'];
    textDayHeaderFontWeight: TextStyle['fontWeight'];
    textDayFontSize: TextStyle['fontSize'];
    textMonthFontSize: TextStyle['fontSize'];
    textDayHeaderFontSize: TextStyle['fontSize'];
}