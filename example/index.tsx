import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from "react-native-calendars";
import moment from 'moment'; 


const Example = () => {
    const [theme, setTheme] = useState<any>()
    const [date, setDate] = useState('2023-04-13')
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    const [markedDates, setMarkedDates] = useState({
        '2013-03-31': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室'} },
        '2013-04-01': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室'} },
        '2013-04-07': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室'} },
        '2013-04-08': { marked: true, markedColor: '#000', data: { title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室'} },
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
}

export default Example

const styles = StyleSheet.create({})