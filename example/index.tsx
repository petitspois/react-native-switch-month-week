import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import moment from 'moment';


const Example = () => {
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    return (
        <View style={{flex:1}}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider onMonthChange={(date: string, type: any)=>{
                setCurrentMonth(date)
            }}>
                <MonthWeekCalendar />
            </MonthWeekCalendarProvider>
        </View>
    )
}

export default Example

const styles = StyleSheet.create({})