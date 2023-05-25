import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MonthWeekCalendar, MonthWeekCalendarProvider } from '../src';
import moment from 'moment';


const Example = () => {
    const [theme, setTheme] = useState<any>({
        todayTextColor: '#3CA0AE',
        selectedTodayButtonBackgroundColor: '#3CA0AE',
        dotBackgroundColor: '#3CA0AE',
        agendaItemTextColor: '#3CA0AE',
    })
    const [date, setDate] = useState('2023-04-13')
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    const [markedDates, setMarkedDates] = useState({
        '2023-05-13': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' } },
        '2023-05-22': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' } },
        '2023-05-17': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' } },
        '2023-05-24': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' } },
    })

    useEffect(() => {
        // setTimeout(() => {
        //     setTheme(
        //         { 
        //             containerBackgroundColor: '#040404',
        //             calendarBackgroundColor: '#191919',
        //             knobShadowColor: '#333333',
        //             selectedButtonBackgroundColor: '#333333',
        //             buttonTextColor: 'white',
        //             dayNameTextColor: 'white',
        //         }
        //     )
        // }, 4000);

    }, [])


    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider
                // defaultDate='2021-04-13'
                onMonthChange={(date, type) => {
                    console.log('date 1231232131:>> ', date);
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
}

export default Example

const styles = StyleSheet.create({})