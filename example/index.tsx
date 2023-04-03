import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import moment from 'moment';


const Example = () => {
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    const [markedDates, setMarkedDates] = useState({
        '2023-04-02': {marked: true, markedColor: '#000'},
        '2023-04-04': {marked: true, markedColor: '#000'},
    })

    useEffect(()=>{
        setTimeout(() => {
            setMarkedDates(prev => ({...prev, '2023-04-05': {marked: true, markedColor: '#000'},}))
        }, 4000);
        setTimeout(() => {
            setMarkedDates(prev => ({...prev, '2023-04-07': {marked: true, markedColor: '#000'},}))
        }, 5000);
        setTimeout(() => {
            setMarkedDates(prev => ({...prev, '2023-04-09': {marked: true, markedColor: '#000'},}))
        }, 6000);
    }, [])

    return (
        <View style={{flex:1}}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider onMonthChange={(date, type)=>{
                setCurrentMonth(date)
            }}>
                <MonthWeekCalendar 
                    markedDates={markedDates} 
                />
            </MonthWeekCalendarProvider>
        </View>
    )
}

export default Example

const styles = StyleSheet.create({})