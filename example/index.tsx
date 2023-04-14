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
        '2023-04-02': { marked: true, markedColor: '#000' },
        '2023-04-04': { marked: true, markedColor: '#000' },
    })

    useEffect(() => {
        setTimeout(() => {
            // setTheme(
            //     { 
            //         containerBackgroundColor: '#040404',
            //         calendarBackgroundColor: '#191919',
            //         knobShadowColor: '#333333',
            //         selectedButtonBackgroundColor: '#333333',
            //         buttonTextColor: 'white',
            //         dayNameTextColor: 'white',
            //     }
            // )
            setDate('2023-04-16')
        }, 4000);
    
    }, [])
    

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider
                date={date}
                onMonthChange={(date, type) => {
                    setCurrentMonth(date)
                }}>
                <MonthWeekCalendar
                    locale={'en'}
                    theme={theme}
                    markedDates={markedDates}
                />
            </MonthWeekCalendarProvider>
        </View>
    )
}

export default Example

const styles = StyleSheet.create({})