import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';
import XDate from 'xdate';
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import moment from 'moment';


const Example = () => {
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    return (
        <>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendar onMonthChange={(date) => {
                setCurrentMonth(date)
            }}/>
            {/* <CalendarProvider date="2022-01-07">
                <WeekCalendar hideDayNames firstDay={1} />
            </CalendarProvider> */}
        </>
    )
}

export default Example

const styles = StyleSheet.create({})