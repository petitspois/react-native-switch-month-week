import type { ITheme } from './type';

export const NUMBER_OF_PAGES = 12 * 10;
export const DATE_FORMAT = 'YYYY-MM-DD'
const dayNamesShort_cn = ['日','一', '二', '三', '四', '五', '六']
const dayNamesShort_en = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dayNamesShort_hk = ['日','一', '二', '三', '四', '五', '六']


export const DayNamesShort ={
  cn: dayNamesShort_cn,
  en: dayNamesShort_en,
  hk: dayNamesShort_hk,
}

export const theme: ITheme ={
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#bbb',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#3370ff',
    dayTextColor: '#2d4150',
    textDisabledColor: '#818888',
    dotColor: '#3370ff',
    selectedDotColor: '#bbb',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }

