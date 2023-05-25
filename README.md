# React Native Switch Month Week

## A declarative cross-platform React Native calendar component for iOS and Android.

## Getting Started

## Features ✨

- Pure JS. No Native code required
- Customization of theme
- Detailed documentation and examples
- Support multiple languages
- Swipe to switch month and week
- Support Agenda List

## Getting Started 🔧

Here's how to get started with react-native-switch-month-week in your React Native project:

### Install the package:

Using `npm`:

```
$ npm install --save react-native-switch-month-week
```

Using `Yarn`:

```
$ yarn add react-native-switch-month-week
```

**React Native Switch Month Week is implemented in JavaScript, so no native module linking is required.**

## Example 🚀

### Please yarn android before pushing changes.

```tsx
    import { MonthWeekCalendar, MonthWeekCalendarProvider } from 'react-native-switch-month-week';

    const [theme, setTheme] = useState<any>({
        todayTextColor: '#3CA0AE',
        selectedTodayButtonBackgroundColor: '#3CA0AE',
        dotBackgroundColor: '#3CA0AE',
        agendaItemTextColor: '#3CA0AE',
    })
    const [date, setDate] = useState('2023-04-13')
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    const [markedDates, setMarkedDates] = useState({
        '2023-05-13': { marked: true, markedColor: '#000', data: { title: 'Code optimization', description: '5:00- 5:00 pm 11F high-speed conference room' } }
    })

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider
                defaultDate='2021-04-13'
                onMonthChange={(date, type) => {
                    setCurrentMonth(date)
                }}>
                <MonthWeekCalendar
                    locale={'tw'}
                    theme={theme}
                    markedDates={markedDates}
                />
            </MonthWeekCalendarProvider>
        </View>
    )
```

## API

### MonthWeekCalendarProvider

| Prop          | Description                                                             | Default       |
|---------------|-------------------------------------------------------------------------|---------------|
| defaultDate   | Initial date in 'yyyy-MM-dd' format.                                    | Default = now |
| onDateChanged | Callback for date change event                                          |               |
| onMonthChange | Callback for month change event                                         |               |


### MonthWeekCalendar

| Prop              | Description                                                             | Default           |
|-------------------|-------------------------------------------------------------------------|-------------------|
| locale            | i18n                                                                    | en                |
| calendarWidth     | Width of calendar                                                       | windowWidth       |
| markedDates       | Calendar mark                                                           | drill down        |
| theme             | Specify theme properties to override specific styles for calendar parts | drill down        |
| customReservation | User-defined reserved areas                                             | () => JSX.Element |

### Locale

```ts
    type Locale = 'cn' | 'hk' | 'en' | 'tw';
```

### markedDates

```ts
    // key = 'yyyy-MM-dd'
    export interface MarkedDates {
        [key: string]: {
            marked: boolean;
            markedColor: string;
            data?: MarkedData
        }
    }

    export interface MarkedData {
        title:  string;
        description: string;
    }
```

### Theme

```ts
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
```

## License

React Native Calendars is MIT licensed