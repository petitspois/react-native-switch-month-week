import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';
import XDate from 'xdate';
import { WeekCalendar, CalendarProvider } from "react-native-calendars";


const Example = () => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    return (
        <>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold' }}>{new XDate(currentMonth).toString('yyyy-MM')}</Text>
            </View>
            <MonthWeekCalendar />
            {/* <CalendarProvider date="2022-01-07">
                <WeekCalendar hideDayNames firstDay={1} />
            </CalendarProvider> */}
        </>
    )
}

export default Example

const styles = StyleSheet.create({})